const input = document.getElementById("input");
const add = document.getElementById("add");
const list = document.getElementById("task-list");

let tasks = [];
try {
    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks = Array.isArray(savedTasks) ? savedTasks : [];
} catch (error) {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task, index) {
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(task.completed);

    const taskElement = document.createElement("span");
    taskElement.textContent = task.text;
    taskElement.classList.toggle("completed", checkbox.checked);

    checkbox.addEventListener("change", function() {
        task.completed = checkbox.checked;
        taskElement.classList.toggle("completed", checkbox.checked);
        saveTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete task: ${task.text}`);
    deleteButton.addEventListener("click", function() {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    });

    listItem.append(checkbox, taskElement, deleteButton);
    list.appendChild(listItem);
}

function renderTasks() {
    list.replaceChildren();
    tasks.forEach(renderTask);
}

renderTasks();

add.addEventListener("click", function() {
    const taskText = input.value.trim();
    if (!taskText) return;

    tasks.push({ text: taskText, completed: false });
    saveTasks();
    renderTasks();
    input.value = "";
    input.focus();
});
