'use strict';

const newTaskInput = document.querySelector('.header__input');
const addNewTaskBtn = document.querySelector('.header__btn');
const headerError = document.querySelector('.header__error');
const tasksContainer = document.querySelector('.tasks');
const undoneIcon = document.querySelector('.task__undoneIcon');
const doneIcon = document.querySelector('.task__doneIcon');
const modalShadow = document.querySelector('.modal-shadow');
const modal = document.querySelector('.modal');
const modalInput = document.querySelector('.modal__input');
const modalEditTaskBtn = document.querySelector('.modal__editTaskBtn');
const modalError = document.querySelector('.modal__error');
const modalCloseBtn = document.querySelector('.modal__closeBtn');

let id;
let tasks;
let editTaskId;

const clearInput = function () {
	newTaskInput.value = '';
	headerError.style.display = 'none';
	headerError.textContent = '';
};

const makeStringCapitalize = function (string) {
	return string[0].toUpperCase() + string.slice(1);
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
	saveIntoLocalStorage();
	renderTasks();
};

const deleteTask = function (taskId) {
	const taskIndex = tasks.findIndex(element => element.id === taskId);
	tasks.splice(taskIndex, 1);
	saveIntoLocalStorage();
};

const renderTasks = function () {
	getFromLocalStorage();
	let html;
	tasksContainer.innerHTML = '';
	if (tasks.length > 0) {
		tasks.forEach(task => {
			html = `
				<div class="task">
					<div class="task__valueBox">
						<p class="task__id">${task.id}</p>
						${task.isDone ? '<i class="fas fa-circle task__doneIcon"></i>' : '<i class="far fa-circle task__undoneIcon"></i>'}
						<p class="task__value ${task.isDone ? 'task__done' : ''}">${makeStringCapitalize(task.taskValue)}</p>
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
	} else {
		html = `<p class="task__info">You don't have any tasks yet</p>`;
		tasksContainer.insertAdjacentHTML('afterbegin', html);
	}
};

const openModal = function (taskId) {
	const task = tasks.find(task => task.id === taskId);
	modalInput.value = task.taskValue;
	modalError.textContent = '';
	modal.classList.add('display-block');
	modalShadow.classList.add('display-block');
};

const closeModal = function () {
	modalInput.value = '';
	modalError.textContent = '';
	modal.classList.remove('display-block');
	modalShadow.classList.remove('display-block');
};

const editTask = function (taskId) {
	const task = tasks.find(task => task.id === taskId);
	const newValue = modalInput.value;

	if (!newValue) {
		modalError.textContent = 'Task cannot be empty!';
		modalError.style.display = 'block';
		return;
	}

	task.taskValue = newValue;
	saveIntoLocalStorage();
	renderTasks();
	closeModal();
};

const switchTask = function (task) {
	if (task.isDone === true) {
		task.isDone = false;
	} else {
		task.isDone = true;
	}
};

const saveIntoLocalStorage = function () {
	localStorage.setItem('id', JSON.stringify(id));
	localStorage.setItem('tasks', JSON.stringify(tasks));
};

const getFromLocalStorage = function () {
	id = JSON.parse(localStorage.getItem('id')) || 0;
	tasks = JSON.parse(localStorage.getItem('tasks')) || [];
};

const init = function () {
	renderTasks();
};

// Event Listeners

document.addEventListener('DOMContentLoaded', init);

addNewTaskBtn.addEventListener('click', saveTask);

newTaskInput.addEventListener('keydown', function (e) {
	if (e.key === 'Enter') {
		saveTask();
	}
});

tasksContainer.addEventListener('click', function (e) {
	const taskId = e.target.closest('.task').querySelector('.task__id').textContent;
	if (e.target.closest('.task__deleteBtn')) {
		deleteTask(+taskId);
		renderTasks();
	}
	if (e.target.closest('.task__editBtn')) {
		editTaskId = +taskId;
		openModal(editTaskId);
	}
});

tasksContainer.addEventListener('click', function (e) {
	if (e.target.closest('.task__buttons')) {
		return;
	}

	const taskId = e.target.closest('.task').querySelector('.task__id').textContent;
	const task = tasks.find(task => task.id === +taskId);
	switchTask(task);
	saveIntoLocalStorage();
	renderTasks();
});

modalCloseBtn.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape') {
		closeModal();
	}
});

modalShadow.addEventListener('click', closeModal);

modalEditTaskBtn.addEventListener('click', function () {
	editTask(editTaskId);
});
