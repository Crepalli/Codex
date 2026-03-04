const http = require('http');
const path = require('path');
const fs = require('fs/promises');
const { createReadStream } = require('fs');
const { randomUUID } = require('crypto');

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_FILE = path.join(__dirname, 'data', 'todos.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

async function readTodos() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf8');

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeTodos(todos) {
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf8');
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': MIME_TYPES['.json'] });
  res.end(JSON.stringify(payload));
}

function normalizeText(value) {
  return String(value || '').trim();
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        reject(new Error('Payload muito grande.'));
      }
    });

    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error('JSON inválido.'));
      }
    });

    req.on('error', reject);
  });
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const todoIdMatch = url.pathname.match(/^\/api\/todos\/([^/]+)$/);

  if (req.method === 'GET' && url.pathname === '/api/todos') {
    const todos = await readTodos();
    const sorted = todos.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return sendJson(res, 200, sorted);
  }

  if (req.method === 'POST' && url.pathname === '/api/todos') {
    const body = await parseBody(req);
    const text = normalizeText(body.text);

    if (!text) {
      return sendJson(res, 400, { error: 'Informe uma tarefa válida.' });
    }

    const todos = await readTodos();
    const todo = {
      id: randomUUID(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };

    todos.push(todo);
    await writeTodos(todos);
    return sendJson(res, 201, todo);
  }

  if (todoIdMatch && req.method === 'PUT') {
    const body = await parseBody(req);
    const todoId = todoIdMatch[1];
    const todos = await readTodos();
    const index = todos.findIndex((item) => item.id === todoId);

    if (index < 0) {
      return sendJson(res, 404, { error: 'Tarefa não encontrada.' });
    }

    if (Object.prototype.hasOwnProperty.call(body, 'text')) {
      const text = normalizeText(body.text);
      if (!text) {
        return sendJson(res, 400, { error: 'O texto da tarefa não pode ser vazio.' });
      }
      todos[index].text = text;
    }

    if (Object.prototype.hasOwnProperty.call(body, 'completed')) {
      todos[index].completed = Boolean(body.completed);
    }

    await writeTodos(todos);
    return sendJson(res, 200, todos[index]);
  }

  if (todoIdMatch && req.method === 'DELETE') {
    const todoId = todoIdMatch[1];
    const todos = await readTodos();
    const nextTodos = todos.filter((item) => item.id !== todoId);

    if (nextTodos.length === todos.length) {
      return sendJson(res, 404, { error: 'Tarefa não encontrada.' });
    }

    await writeTodos(nextTodos);
    res.writeHead(204);
    return res.end();
  }

  return sendJson(res, 404, { error: 'Endpoint não encontrado.' });
}

async function handleStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const safePath = path.normalize(url.pathname).replace(/^([.][.][/\\])+/, '');
  const pathname = safePath === '/' ? '/index.html' : safePath;
  const filePath = path.join(PUBLIC_DIR, pathname);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Acesso negado');
  }

  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) throw new Error('Not file');

    const ext = path.extname(filePath);
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream'
    });
    return createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Página não encontrada');
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith('/api/')) {
      await handleApi(req, res);
    } else {
      await handleStatic(req, res);
    }
  } catch (error) {
    sendJson(res, 500, { error: error.message || 'Erro interno no servidor.' });
  }
});

server.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
