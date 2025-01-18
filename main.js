// Selectors for new category form
const newCategoryForm = document.querySelector('[data-new-category-form]');
const newCategoryInput = document.querySelector('[data-new-category-input]');

// Selector for categories container
const categoriesContainer = document.querySelector('[data-categories]');

// Selector for currently viewing
const currentlyViewing = document.querySelector('[data-currently-viewing]');

// Selector for new task form
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskSelect = document.querySelector('[data-new-task-select]');
const newTaskInput = document.querySelector('[data-new-task-input]');

// Selector for edit task form
const editTaskForm = document.querySelector('[data-edit-task-form]');
const editTaskSelect = document.querySelector('[data-edit-task-select]');
const editTaskInput = document.querySelector('[data-edit-task-input]');

// Selector for task container
const tasksContainer = document.querySelector('[data-cards]');

// Local storage keys
const LOCAL_STORAGE_CATEGORIES_KEY = 'LOCAL_STORAGE_CATEGORIES_KEY';
const LOCAL_STORAGE_TASK_KEY = 'LOCAL_STORAGE_TASK_KEY';
const LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY = 'LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY';

let selectedCategoryId = localStorage.getItem(LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY);
let categories = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY)) || [];
let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASK_KEY)) || [];

// EVENT: Add Category
newCategoryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const category = newCategoryInput.value;
    const isCategoryEmpty = !category || !category.trim().length;

    if (isCategoryEmpty) {
        return console.log('please enter a task');
    }

    categories.push({ _id: Date.now().toString(), category: category, color: getRandomHexColor() });

    newCategoryInput.value = '';

    saveAndRender();
});

// EVENT: Get Selected Category Id
categoriesContainer.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'li') {
        if (!e.target.dataset.categoryId) {
            selectedCategoryId = null;
        } else {
            selectedCategoryId = e.target.dataset.categoryId;
        }

        saveAndRender();
    }
});

// EVENT: Get Selected Category Color
categoriesContainer.addEventListener('change', (e) => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const newCategoryColor = e.target.value;
        const categoryId = e.target.parentElement.dataset.categoryId;
        const categoryToEdit = categories.find((category) => category._id === categoryId);

        categoryToEdit.color = newCategoryColor;

        saveAndRender();
    }
});

// EVENT: Delete Selected Category
currentlyViewing.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'span') {
        categories = categories.filter((category) => category._id !== selectedCategoryId);

        task = task.filter((task) => task.categoryId !== selectedCategoryId);

        selectedCategoryId = null;

        saveAndRender();
    }
});

// EVENT: Add Task
newTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    task.push({
        _id: Date.now().toString(),
        categoryId: newTaskSelect.value,
        task: newTaskInput.value,
    });

    newTaskSelect.value = '';
    newTaskInput.value = '';

    saveAndRender();
});

// EVENT: Load Edit Task Form With Values
let taskToEdit = null;
tasksContainer.addEventListener('click', (e) => {
    if (e.target.classList[1] === 'fa-edit') {
        newTaskForm.style.display = 'none';
        editTaskForm.style.display = 'flex';

        taskToEdit = tasks.find((task) => task._id === e.target.dataset.editTask);

        editTaskSelect.value = taskToEdit.categoryId;
        editTaskInput.value = taskToEdit.task;
    }
    if (e.target.classList[1] === 'fa-trash-alt') {
        const taskToDeleteIndex = task.findIndex((task) => task._id === e.target.dataset.deleteTask);

        tasks.splice(taskToDeleteIndex, 1);

        saveAndRender();
    }
});

// EVENT: Update The Task Being Edited With New Values
editTaskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    taskToEdit.categoryId = editTaskSelect.value;
    taskToEdit.task = editTaskInput.value;

    editTaskForm.style.display = 'none';
    newTaskForm.style.display = 'flex';

    editTaskSelect.value = '';
    editTaskInput.value = '';

    saveAndRender();
});

// *==================== Functions ====================

function saveAndRender() {
    save();
    render();
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
    localStorage.setItem(LOCAL_STORAGE_TASK_KEY, JSON.stringify(todos));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_CATEGORY_ID_KEY, selectedCategoryId);
}

function render() {
    clearChildElements(categoriesContainer);
    clearChildElements(newTaskSelect);
    clearChildElements(editTaskSelect);
    clearChildElements(tasksContainer);

    renderCategories();
    renderFormOptions();
    renderTasks();

    // Set the current viewing category
    if (!selectedCategoryId || selectedCategoryId === 'null') {
        currentlyViewing.innerHTML = `You are currently viewing <strong>All Categories</strong>`;
    } else {
        const currentCategory = categories.find((category) => category._id === selectedCategoryId);
        currentlyViewing.innerHTML = `You are currently viewing <strong>${currentCategory.category}</strong> <span>(delete)</span>`;
    }
}

function renderCategories() {
    categoriesContainer.innerHTML += `<li class="sidebar-item ${selectedCategoryId === 'null' || selectedCategoryId === null ? 'active' : ''}" data-category-id="">View All</li>
	`;

    categories.forEach(({ _id, category, color }) => {
        categoriesContainer.innerHTML += ` <li class="sidebar-item ${_id === selectedCategoryId ? 'active' : ''}" data-category-id=${_id}>${category}<input class="sidebar-color" type="color" value=${color}></li>`;
    });
}

function renderFormOptions() {

    newTaskSelect.innerHTML += `<option value="">Select A Category</option>`;
    editTaskSelect.innerHTML += `<option value="">Select A Category</option>`;

    categories.forEach(({ _id, category }) => {
        newTaskSelect.innerHTML += `<option value=${_id}>${category}</option>`;
        editTaskSelect.innerHTML += `<option value=${_id}>${category}</option>`;
    });
}

function renderTasks() {
    let taskToRender = task;

    // if their is a Selected Category Id, and selected category id !== 'null then filter the tasks
    if (selectedCategoryId && selectedCategoryId !== 'null') {
        taskToRender = task.filter((task) => task.categoryId === selectedCategoryId);
    }

    // Render Tasks
    tasksToRender.forEach(({ _id, categoryId, task }) => {

        // Get Complimentary categoryDetails Based On TaskId
        const { color, category } = categories.find(({ _id }) => _id === categoryId);
        const backgroundColor = convertHexToRGBA(color, 20);
        taskContainer.innerHTML += `
			<div class="task" style="border-color: ${color}">
					<div class="task-tag" style="background-color: ${backgroundColor}; color: ${color};">
						${category}
					</div>
					<p class="task-description">${task}</p>
					<div class="task-actions">
						<i class="far fa-edit" data-edit-task=${_id}></i>
						<i class="far fa-trash-alt" data-delete-task=${_id}></i>
					</div>
			</div>`;
    });
}

// HELPERS
function clearChildElements(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function convertHexToRGBA(hexCode, opacity) {
    let hex = hexCode.replace('#', '');

    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity / 100})`;
}

function getRandomHexColor() {
    var hex = (Math.round(Math.random() * 0xffffff)).toString(16);
    while (hex.length < 6) hex = "0" + hex;
    return `#${hex}`;
}

window.addEventListener('load', render);
