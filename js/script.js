'use strict';

const newTaskInput = document.querySelector('.header__input');
const addNewTaskBtn = document.querySelector('.header__btn');
const headerError = document.querySelector('.header__error');
const tasksContainer = document.querySelector('.tasks');
const undoneIcon = document.querySelector('.task__undoneIcon');
const doneIcon = document.querySelector('.task__doneIcon');
const editTaskBtn = document.querySelector('.task__editBtn');
const deleteTaskBtn = document.querySelector('.task__deleteBtn');

let id = 0;
let tasks = [];

const clearInput = function () {
	newTaskInput.value = '';
	headerError.style.display = 'none';
	headerError.textContent = '';
};

const saveTask = function () {
	if (!newTaskInput.value) {
		headerError.textContent = 'Task cannot be empty!';
		headerError.style.display = 'block';
		return;
	}

	const newTask = {
		id: id,
		taskValue: newTaskInput.value,
		isDone: false,
	};

	id++;
	tasks.push(newTask);
	clearInput();
	renderTasks();
};

const renderTasks = function () {
	tasksContainer.innerHTML = '';
	tasks.forEach(task => {
		const html = `
      <div class="task">
        <div class="task__valueBox">
          <p class="task__id">${task.id}</p>
          ${
						task.isDone
							? '<i class="fas fa-circle task__doneIcon"></i>'
							: '<i class="far fa-circle task__undoneIcon"></i>'
					}
          <p class="task__value ${task.isDone ? 'task__done' : ''}">${task.taskValue}</p>
        </div>
        <div class="task__buttons">
          <button class="task__btn task__editBtn">
            <i class="fas fa-edit"></i>
          </button>
          <button class="task__btn task__deleteBtn">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `;
		tasksContainer.insertAdjacentHTML('beforeend', html);
	});
};

const switchTask = function (task) {
	if (task.isDone === true) {
		task.isDone = false;
	} else {
		task.isDone = true;
	}
};

addNewTaskBtn.addEventListener('click', saveTask);
tasksContainer.addEventListener('click', function (e) {
	const taskId = e.target.closest('.task').querySelector('.task__id').textContent;
	const task = tasks.find(task => task.id === +taskId);
	switchTask(task);
	renderTasks();
});
