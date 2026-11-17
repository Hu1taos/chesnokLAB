window.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#newtask");
    const input = document.querySelector("#task-input");
    const tasksContainer = document.querySelector("#tasks");
    const count = document.querySelector("#task-count");
    const clearCompletedButton = document.querySelector("#clear-completed");

    let tasks = [];

    function updateCount() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        count.textContent = `${completed} из ${total} выполнено`;
    }

    function renderTasks() {
        tasksContainer.innerHTML = "";

        if (tasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon" aria-hidden="true">✦</div>
                    <strong>Пока задач нет</strong>
                    <span>Добавьте первую задачу выше</span>
                </div>
            `;
            updateCount();
            return;
        }

        tasks.forEach(task => {
            const taskElement = document.createElement("div");
            taskElement.className = `task${task.completed ? " completed" : ""}`;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "task-check";
            checkbox.checked = task.completed;
            checkbox.setAttribute("aria-label", "Отметить задачу выполненной");
            checkbox.addEventListener("change", function () {
                task.completed = checkbox.checked;
                renderTasks();
            });

            const name = document.createElement("span");
            name.className = "task-name";
            name.textContent = task.text;

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-button";
            deleteButton.innerHTML = "&#10005;";
            deleteButton.title = "Удалить задачу";
            deleteButton.setAttribute("aria-label", "Удалить задачу");
            deleteButton.addEventListener("click", function () {
                tasks = tasks.filter(item => item.id !== task.id);
                renderTasks();
            });

            taskElement.append(checkbox, name, deleteButton);
            tasksContainer.appendChild(taskElement);
        });

        updateCount();
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const taskText = input.value.trim();

        if (taskText === "") {
            alert("Введите описание задачи!");
            input.focus();
            return;
        }

        tasks.push({
            id: Date.now(),
            text: taskText,
            completed: false
        });

        input.value = "";
        input.focus();
        renderTasks();
    });

    clearCompletedButton.addEventListener("click", function () {
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
    });

    renderTasks();
});
