document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");
    const toggleModeButton = document.getElementById("toggle-mode");
    const modeIcon = document.getElementById("mode-icon");
    const progressCircle = document.getElementById("progress-circle");
    const congratulationsMessage = document.getElementById("congratulations-message");
    const dateTimeElement = document.getElementById("current-date-time");
    const totalTasksElement = document.getElementById("total-tasks");
    const completedTasksElement = document.getElementById("completed-tasks");

    let tasks = [];

    function updateDateTime() {
        const now = new Date();
        dateTimeElement.textContent = now.toLocaleString();
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    function updateAnalytics() {
        const completedTasks = tasks.filter(task => task.completed).length;
        const totalTasks = tasks.length;

        totalTasksElement.textContent = `Total Tasks: ${totalTasks}`;
        completedTasksElement.textContent = `Completed Tasks: ${completedTasks}`;
        const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        progressCircle.style.width = `${progress}%`;

        congratulationsMessage.classList.toggle("hidden", completedTasks !== totalTasks || totalTasks === 0);
    }

    addTaskButton.addEventListener("click", () => {
        const taskName = taskInput.value.trim();
        if (taskName === "") return;

        const task = { id: Date.now(), name: taskName, completed: false, timer: 0, running: false };
        tasks.push(task);
        renderTasks();
        taskInput.value = "";
    });

    function toggleTimer(task) {
        task.running = !task.running;
        if (task.running) {
            task.timerInterval = setInterval(() => {
                task.timer++;
                renderTasks();
            }, 1000);
        } else {
            clearInterval(task.timerInterval);
        }
        renderTasks();
    }

    function formatTime(seconds) {
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    }

    function toggleCompletion(task) {
        task.completed = !task.completed;

        // Stop the timer if the task is marked as completed
        if (task.completed && task.running) {
            clearInterval(task.timerInterval);
            task.running = false;
        }

        renderTasks();
    }

    function editTask(task) {
        const newTaskName = prompt("Edit Task Name:", task.name);
        if (newTaskName !== null && newTaskName.trim() !== "") {
            task.name = newTaskName.trim();
            renderTasks();
        }
    }

    function removeTask(task) {
        tasks = tasks.filter(t => t.id !== task.id);
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach(task => {
            const taskItem = document.createElement("li");
            taskItem.className = "task-item";

            taskItem.innerHTML = `
                <label class="task-label">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
                    <span class="task-name ${task.completed ? "strikethrough" : ""}">${task.name}</span>
                </label>
                <div class="task-buttons">
                    <span>${formatTime(task.timer)}</span>
                    <button class="start-stop-btn">${task.running ? "Stop" : "Start"}</button>
                    <button class="edit-btn">✏️ Edit</button>
                    <button class="remove-btn">❌</button>
                </div>
            `;

            const checkbox = taskItem.querySelector(".task-checkbox");
            const startStopButton = taskItem.querySelector(".start-stop-btn");
            const editButton = taskItem.querySelector(".edit-btn");
            const removeButton = taskItem.querySelector(".remove-btn");

            checkbox.addEventListener("change", () => toggleCompletion(task));
            startStopButton.addEventListener("click", () => toggleTimer(task));
            editButton.addEventListener("click", () => editTask(task));
            removeButton.addEventListener("click", () => removeTask(task));

            taskList.appendChild(taskItem);
        });
        updateAnalytics();
    }

    toggleModeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        modeIcon.textContent = document.body.classList.contains("dark-mode") ? "🌙" : "🌞";
    });

    renderTasks();
});
