const addBtn = document.getElementById('addBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

document.addEventListener('DOMContentLoaded', loadTasks);
addBtn.addEventListener('click', addTask);

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const task = { text: taskText, completed: false };
  addTaskToDOM(task);
  saveTask(task);
  taskInput.value = "";
}

function addTaskToDOM(task) {
  const li = document.createElement('li');
  if (task.completed) li.classList.add('completed');

  li.innerHTML = `
    <span>${task.text}</span>
    <div class="buttons">
      <button class="edit"><i class='bx bxs-edit'></i></button>
      <button class="delete"><i class='bx bx-trash'></i></button>
    </div>
  `;

  const span = li.querySelector('span');
  const editBtn = li.querySelector('.edit');
  const deleteBtn = li.querySelector('.delete');

  // ✅ Mark complete toggle
  span.addEventListener('click', function () {
    li.classList.toggle('completed');
    updateTaskStatus(task.text, li.classList.contains('completed'));
  });

  // 🗑️ Delete task
  deleteBtn.addEventListener('click', function () {
    li.remove();
    deleteTask(task.text);
  });

  // ✏️ Inline Edit
  editBtn.addEventListener('click', function () {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = span.textContent;
    input.classList.add('edit-input');

    // Replace span with input
    li.replaceChild(input, span);
    input.focus();

    // Save changes on Enter or when focus leaves
    const saveEdit = () => {
      const newText = input.value.trim();
      if (newText && newText !== task.text) {
        updateTaskText(task.text, newText);
        task.text = newText;
      }
      span.textContent = task.text;
      li.replaceChild(span, input);
    };

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') saveEdit();
    });
  });

  taskList.appendChild(li);
}

const filterSelect = document.getElementById('filter');
filterSelect.addEventListener('change', filterTasks);

function filterTasks() {
  const filter = filterSelect.value;
  const tasks = taskList.querySelectorAll('li');

  tasks.forEach(task => {
    switch (filter) {
      case 'all':
        task.style.display = 'flex';
        break;
      case 'completed':
        task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
        break;
      case 'pending':
        task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
        break;
    }
  });
}


// 🔹 LocalStorage functions
function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = getTasks();
  tasks.forEach(task => addTaskToDOM(task));
}

function updateTaskStatus(taskText, completed) {
  let tasks = getTasks();
  tasks = tasks.map(t => t.text === taskText ? { ...t, completed } : t);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(taskText) {
  let tasks = getTasks();
  tasks = tasks.filter(t => t.text !== taskText);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskText(oldText, newText) {
  let tasks = getTasks();
  tasks = tasks.map(t => t.text === oldText ? { ...t, text: newText } : t);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

const darkModeToggle = document.getElementById("darkModeToggle");

darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", darkModeToggle.checked);
});
