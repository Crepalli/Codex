const listEl = document.getElementById('todo-list');
const formEl = document.getElementById('todo-form');
const inputEl = document.getElementById('todo-input');
const statsEl = document.getElementById('stats');
const template = document.getElementById('todo-item-template');

let todos = [];

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Erro ao processar requisição.');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function renderStats() {
  const total = todos.length;
  const done = todos.filter((todo) => todo.completed).length;
  statsEl.textContent = total
    ? `${done} de ${total} tarefa(s) concluída(s).`
    : 'Nenhuma tarefa cadastrada ainda.';
}

function renderList() {
  listEl.innerHTML = '';

  if (!todos.length) {
    const li = document.createElement('li');
    li.className = 'empty-state';
    li.textContent = 'Sua lista está vazia. Adicione a primeira tarefa 🚀';
    listEl.append(li);
    renderStats();
    return;
  }

  todos.forEach((todo) => {
    const node = template.content.cloneNode(true);
    const item = node.querySelector('.todo-item');
    const checkbox = node.querySelector('input[type="checkbox"]');
    const textInput = node.querySelector('.todo-item__text');
    const deleteBtn = node.querySelector('.todo-item__delete');

    checkbox.checked = todo.completed;
    textInput.value = todo.text;

    if (todo.completed) {
      item.classList.add('todo-item--done');
    }

    checkbox.addEventListener('change', () => updateTodo(todo.id, { completed: checkbox.checked }));

    let previousText = todo.text;
    textInput.addEventListener('focus', () => {
      previousText = textInput.value;
    });

    textInput.addEventListener('blur', () => {
      const nextText = textInput.value.trim();
      if (!nextText || nextText === previousText) {
        textInput.value = previousText;
        return;
      }
      updateTodo(todo.id, { text: nextText });
    });

    textInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        textInput.blur();
      }
      if (event.key === 'Escape') {
        textInput.value = previousText;
        textInput.blur();
      }
    });

    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    listEl.append(node);
  });

  renderStats();
}

async function loadTodos() {
  todos = await request('/api/todos');
  renderList();
}

async function createTodo(text) {
  const created = await request('/api/todos', {
    method: 'POST',
    body: JSON.stringify({ text })
  });

  todos.unshift(created);
  renderList();
}

async function updateTodo(id, payload) {
  const updated = await request(`/api/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

  todos = todos.map((todo) => (todo.id === id ? updated : todo));
  renderList();
}

async function deleteTodo(id) {
  await request(`/api/todos/${id}`, { method: 'DELETE' });
  todos = todos.filter((todo) => todo.id !== id);
  renderList();
}

formEl.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;

  try {
    await createTodo(text);
    inputEl.value = '';
    inputEl.focus();
  } catch (error) {
    alert(error.message);
  }
});

loadTodos().catch((error) => {
  console.error(error);
  statsEl.textContent = 'Falha ao carregar tarefas. Verifique o servidor.';
});
