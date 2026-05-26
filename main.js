let todos = JSON.parse(localStorage.getItem('todos')) || [];

window.addEventListener('load', () => {

	const nameInput = document.querySelector('#name');
	const newTodoForm = document.querySelector('#new-todo-form');
	const searchInput = document.querySelector('#search');

	const username = localStorage.getItem('username') || '';

	nameInput.value = username;

	/* SAVE USERNAME */

	nameInput.addEventListener('change', (e) => {
		localStorage.setItem('username', e.target.value);
	});

	/* ADD TODO */

	newTodoForm.addEventListener('submit', e => {

		e.preventDefault();

		const todo = {
			content: e.target.elements.content.value,
			category: e.target.elements.category.value,
			dueDate: e.target.elements.dueDate.value,
			done: false,
			createdAt: new Date().getTime()
		};

		/* VALIDATION */

		if (!todo.content || !todo.category) {
			alert('Please fill all fields');
			return;
		}

		todos.push(todo);

		localStorage.setItem('todos', JSON.stringify(todos));

		e.target.reset();

		DisplayTodos();
	});

	/* SEARCH */

	searchInput.addEventListener('input', () => {
		DisplayTodos(searchInput.value);
	});

	/* DARK MODE */

	const themeToggle = document.querySelector('#themeToggle');

	themeToggle.addEventListener('click', () => {

		document.body.classList.toggle('dark');

		if (document.body.classList.contains('dark')) {
			localStorage.setItem('theme', 'dark');
		} else {
			localStorage.setItem('theme', 'light');
		}
	});

	/* LOAD SAVED THEME */

	if (localStorage.getItem('theme') === 'dark') {
		document.body.classList.add('dark');
	}

	/* FILTER BUTTONS */

	document.querySelector('#show-all')
	.addEventListener('click', () => {
		DisplayTodos();
	});

	document.querySelector('#show-completed')
	.addEventListener('click', () => {
		DisplayTodos('', 'completed');
	});

	document.querySelector('#show-pending')
	.addEventListener('click', () => {
		DisplayTodos('', 'pending');
	});

	/* CLEAR ALL */

	document.querySelector('#clear-all')
	.addEventListener('click', () => {

		if (confirm('Delete all todos?')) {

			todos = [];

			localStorage.setItem('todos', JSON.stringify(todos));

			DisplayTodos();
		}
	});

	DisplayTodos();
});

/* DISPLAY TODOS */

function DisplayTodos(searchText = '', filter = 'all') {

	const todoList = document.querySelector('#todo-list');

	const taskCount = document.querySelector('#task-count');

	todoList.innerHTML = "";

	let filteredTodos = todos.filter(todo =>
		todo.content.toLowerCase()
		.includes(searchText.toLowerCase())
	);

	/* FILTER LOGIC */

	if (filter === 'completed') {
		filteredTodos = filteredTodos.filter(todo => todo.done);
	}

	if (filter === 'pending') {
		filteredTodos = filteredTodos.filter(todo => !todo.done);
	}

	taskCount.innerText =
	`Total Tasks: ${filteredTodos.length}`;

	filteredTodos.forEach(todo => {

		const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');

		if (todo.done) {
			todoItem.classList.add('done');
		}

		/* LABEL */

		const label = document.createElement('label');

		const input = document.createElement('input');

		input.type = 'checkbox';

		input.checked = todo.done;

		const span = document.createElement('span');

		span.classList.add('bubble');

		if (todo.category == 'personal') {
			span.classList.add('personal');
		} else {
			span.classList.add('business');
		}

		label.appendChild(input);
		label.appendChild(span);

		/* CONTENT */

		const content = document.createElement('div');

		content.classList.add('todo-content');

		content.innerHTML = `
			<div>
				<input type="text"
				value="${todo.content}"
				readonly>

				<p>📅 Due: ${todo.dueDate || 'No Date'}</p>
			</div>
		`;

		/* ACTIONS */

		const actions = document.createElement('div');

		actions.classList.add('actions');

		const edit = document.createElement('button');

		edit.classList.add('edit');

		edit.innerText = 'Edit';

		const deleteButton = document.createElement('button');

		deleteButton.classList.add('delete');

		deleteButton.innerText = 'Delete';

		actions.appendChild(edit);
		actions.appendChild(deleteButton);

		/* APPEND */

		todoItem.appendChild(label);
		todoItem.appendChild(content);
		todoItem.appendChild(actions);

		todoList.appendChild(todoItem);

		/* CHECKBOX */

		input.addEventListener('change', (e) => {

			todo.done = e.target.checked;

			localStorage.setItem('todos', JSON.stringify(todos));

			DisplayTodos(searchText, filter);
		});

		/* EDIT */

		edit.addEventListener('click', () => {

			const contentInput =
			content.querySelector('input');

			contentInput.removeAttribute('readonly');

			contentInput.focus();

			contentInput.addEventListener('blur', (e) => {

				contentInput.setAttribute('readonly', true);

				todo.content = e.target.value;

				localStorage.setItem('todos', JSON.stringify(todos));

				DisplayTodos(searchText, filter);
			});
		});

		/* DELETE */

		deleteButton.addEventListener('click', () => {

			todos = todos.filter(t => t != todo);

			localStorage.setItem('todos', JSON.stringify(todos));

			DisplayTodos(searchText, filter);
		});
	});
}