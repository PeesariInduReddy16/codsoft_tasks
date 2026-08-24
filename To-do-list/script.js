/* =========================================
   TASKFLOW
   Smart To-Do Application
========================================= */


/* =========================================
   DOM ELEMENTS
========================================= */

const taskForm =
    document.getElementById("taskForm");

const taskInput =
    document.getElementById("taskInput");

const taskError =
    document.getElementById("taskError");

const category =
    document.getElementById("category");

const priority =
    document.getElementById("priority");

const dueDate =
    document.getElementById("dueDate");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const filterSelect =
    document.getElementById("filterSelect");

const categoryButtons =
    document.querySelectorAll(".category-button");

const totalTasks =
    document.getElementById("totalTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const completedTasks =
    document.getElementById("completedTasks");

const progressFill =
    document.getElementById("progressFill");

const progressPercent =
    document.getElementById("progressPercent");

const taskCountLabel =
    document.getElementById("taskCountLabel");

const clearCompleted =
    document.getElementById("clearCompleted");

const themeToggle =
    document.getElementById("themeToggle");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const editModal =
    document.getElementById("editModal");

const closeModal =
    document.getElementById("closeModal");

const saveEdit =
    document.getElementById("saveEdit");

const editTaskInput =
    document.getElementById("editTaskInput");

const editCategory =
    document.getElementById("editCategory");

const editPriority =
    document.getElementById("editPriority");

const editDueDate =
    document.getElementById("editDueDate");


/* =========================================
   DATA
========================================= */

let tasks =
    JSON.parse(
        localStorage.getItem("taskflowTasks")
    ) || [];

let activeCategory = "all";

let editingTaskId = null;


/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    setMinimumDate();

    updateDate();

    loadTheme();

    renderTasks();

    updateStats();

    document.getElementById("year").textContent =
        new Date().getFullYear();

});


/* =========================================
   MINIMUM DATE
========================================= */

function setMinimumDate() {

    const today =
        new Date().toISOString().split("T")[0];

    dueDate.min = today;

    editDueDate.min = today;

}


/* =========================================
   CURRENT DATE
========================================= */

function updateDate() {

    const now = new Date();

    const day =
        now.toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );

    const date =
        now.toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    document.getElementById(
        "currentDay"
    ).textContent = day;

    document.getElementById(
        "currentDate"
    ).textContent = date;

}


/* =========================================
   ADD TASK
========================================= */

taskForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const text =
            taskInput.value.trim();


        if (text === "") {

            taskError.textContent =
                "Please enter a task.";

            taskInput.focus();

            return;

        }


        if (text.length < 3) {

            taskError.textContent =
                "Task must contain at least 3 characters.";

            taskInput.focus();

            return;

        }


        taskError.textContent = "";


        const task = {

            id: Date.now(),

            text: text,

            category:
                category.value,

            priority:
                priority.value,

            dueDate:
                dueDate.value,

            completed: false,

            createdAt:
                new Date().toISOString()

        };


        tasks.unshift(task);


        saveTasks();

        renderTasks();

        updateStats();


        taskForm.reset();

        category.value = "Personal";

        priority.value = "Medium";


        showToast(
            "Task added successfully!"
        );

    }
);


/* =========================================
   SAVE TASKS
========================================= */

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


/* =========================================
   RENDER TASKS
========================================= */

function renderTasks() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();

    const filter =
        filterSelect.value;


    let filteredTasks =
        tasks.filter(task => {


            /* SEARCH */

            const matchesSearch =
                task.text
                    .toLowerCase()
                    .includes(searchTerm);


            /* STATUS / OTHER FILTER */

            let matchesFilter = true;


            if (filter === "pending") {

                matchesFilter =
                    !task.completed;

            }


            if (filter === "completed") {

                matchesFilter =
                    task.completed;

            }


            if (filter === "high") {

                matchesFilter =
                    task.priority === "High";

            }


            if (filter === "today") {

                matchesFilter =
                    isToday(task.dueDate);

            }


            /* CATEGORY */

            const matchesCategory =
                activeCategory === "all" ||
                task.category === activeCategory;


            return (
                matchesSearch &&
                matchesFilter &&
                matchesCategory
            );

        });


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        emptyState.classList.add("show");

    } else {

        emptyState.classList.remove("show");

    }


    filteredTasks.forEach(task => {

        const taskElement =
            createTaskElement(task);

        taskList.appendChild(
            taskElement
        );

    });


    const visibleCount =
        filteredTasks.length;

    taskCountLabel.textContent =
        `${visibleCount} ${
            visibleCount === 1
                ? "task"
                : "tasks"
        }`;

}


/* =========================================
   CREATE TASK ELEMENT
========================================= */

function createTaskElement(task) {

    const article =
        document.createElement("article");

    article.className =
        `task-item ${
            task.completed
                ? "completed"
                : ""
        }`;


    /* CHECKBOX */

    const checkbox =
        document.createElement("button");

    checkbox.className =
        "task-checkbox";

    checkbox.setAttribute(
        "aria-label",
        "Mark task complete"
    );


    if (task.completed) {

        checkbox.innerHTML =
            '<i class="fa-solid fa-check"></i>';

    }


    checkbox.addEventListener(
        "click",
        () => toggleTask(task.id)
    );


    /* CONTENT */

    const content =
        document.createElement("div");


    const name =
        document.createElement("div");

    name.className =
        "task-name";

    name.textContent =
        task.text;


    const meta =
        document.createElement("div");

    meta.className =
        "task-meta";


    /* CATEGORY */

    const categoryBadge =
        document.createElement("span");

    categoryBadge.className =
        "badge category-badge";

    categoryBadge.innerHTML =
        `<i class="fa-solid fa-tag"></i>
         ${escapeHTML(task.category)}`;


    /* PRIORITY */

    const priorityBadge =
        document.createElement("span");

    priorityBadge.className =
        `badge priority-${task.priority.toLowerCase()}`;

    priorityBadge.innerHTML =
        `<i class="fa-solid fa-flag"></i>
         ${escapeHTML(task.priority)}`;


    meta.appendChild(categoryBadge);

    meta.appendChild(priorityBadge);


    /* DUE DATE */

    if (task.dueDate) {

        const due =
            document.createElement("span");

        due.className =
            "due-date";


        if (isOverdue(task.dueDate) &&
            !task.completed) {

            due.classList.add("overdue");

            due.innerHTML =
                `<i class="fa-solid fa-triangle-exclamation"></i>
                 Overdue`;

        } else if (isToday(task.dueDate)) {

            due.classList.add("today");

            due.innerHTML =
                `<i class="fa-solid fa-clock"></i>
                 Due Today`;

        } else {

            due.innerHTML =
                `<i class="fa-regular fa-calendar"></i>
                 ${formatDate(task.dueDate)}`;

        }


        meta.appendChild(due);

    }


    content.appendChild(name);

    content.appendChild(meta);


    /* ACTIONS */

    const actions =
        document.createElement("div");

    actions.className =
        "task-actions";


    /* EDIT */

    const editButton =
        document.createElement("button");

    editButton.className =
        "task-action edit";

    editButton.innerHTML =
        '<i class="fa-solid fa-pen"></i>';

    editButton.setAttribute(
        "aria-label",
        "Edit task"
    );

    editButton.addEventListener(
        "click",
        () => openEditModal(task.id)
    );


    /* DELETE */

    const deleteButton =
        document.createElement("button");

    deleteButton.className =
        "task-action delete";

    deleteButton.innerHTML =
        '<i class="fa-solid fa-trash"></i>';

    deleteButton.setAttribute(
        "aria-label",
        "Delete task"
    );

    deleteButton.addEventListener(
        "click",
        () => deleteTask(task.id)
    );


    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    article.appendChild(checkbox);

    article.appendChild(content);

    article.appendChild(actions);


    return article;

}


/* =========================================
   TOGGLE TASK
========================================= */

function toggleTask(id) {

    tasks =
        tasks.map(task => {

            if (task.id === id) {

                return {
                    ...task,
                    completed:
                        !task.completed
                };

            }

            return task;

        });


    saveTasks();

    renderTasks();

    updateStats();


    const task =
        tasks.find(
            task => task.id === id
        );


    showToast(
        task.completed
            ? "Task completed! 🎉"
            : "Task moved to pending."
    );

}


/* =========================================
   DELETE TASK
========================================= */

function deleteTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) return;


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    renderTasks();

    updateStats();


    showToast(
        "Task deleted."
    );

}


/* =========================================
   EDIT MODAL
========================================= */

function openEditModal(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) return;


    editingTaskId = id;


    editTaskInput.value =
        task.text;

    editCategory.value =
        task.category;

    editPriority.value =
        task.priority;

    editDueDate.value =
        task.dueDate;


    editModal.classList.add(
        "show"
    );

    editTaskInput.focus();

}


function closeEditModal() {

    editModal.classList.remove(
        "show"
    );

    editingTaskId = null;

}


closeModal.addEventListener(
    "click",
    closeEditModal
);


editModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            editModal
        ) {

            closeEditModal();

        }

    }
);


/* =========================================
   SAVE EDIT
========================================= */

saveEdit.addEventListener(
    "click",
    () => {

        const newText =
            editTaskInput.value.trim();


        if (newText.length < 3) {

            showToast(
                "Task must contain at least 3 characters."
            );

            return;

        }


        tasks =
            tasks.map(task => {

                if (
                    task.id ===
                    editingTaskId
                ) {

                    return {

                        ...task,

                        text: newText,

                        category:
                            editCategory.value,

                        priority:
                            editPriority.value,

                        dueDate:
                            editDueDate.value

                    };

                }

                return task;

            });


        saveTasks();

        renderTasks();

        updateStats();

        closeEditModal();


        showToast(
            "Task updated successfully!"
        );

    }
);


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    renderTasks
);


/* =========================================
   FILTER
========================================= */

filterSelect.addEventListener(
    "change",
    renderTasks
);


/* =========================================
   CATEGORY FILTER
========================================= */

categoryButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            categoryButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            activeCategory =
                button.dataset.category;


            renderTasks();

        }
    );

});


/* =========================================
   CLEAR COMPLETED
========================================= */

clearCompleted.addEventListener(
    "click",
    () => {

        const completedCount =
            tasks.filter(
                task => task.completed
            ).length;


        if (completedCount === 0) {

            showToast(
                "There are no completed tasks."
            );

            return;

        }


        tasks =
            tasks.filter(
                task => !task.completed
            );


        saveTasks();

        renderTasks();

        updateStats();


        showToast(
            `${completedCount} completed ${
                completedCount === 1
                    ? "task"
                    : "tasks"
            } cleared.`
        );

    }
);


/* =========================================
   UPDATE STATISTICS
========================================= */

function updateStats() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            task => task.completed
        ).length;

    const pending =
        total - completed;


    totalTasks.textContent =
        total;

    completedTasks.textContent =
        completed;

    pendingTasks.textContent =
        pending;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    progressFill.style.width =
        `${percentage}%`;

    progressPercent.textContent =
        `${percentage}%`;

}


/* =========================================
   DATE HELPERS
========================================= */

function isToday(dateString) {

    if (!dateString) return false;


    const today =
        new Date();

    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    return (
        today.getFullYear() ===
            date.getFullYear() &&

        today.getMonth() ===
            date.getMonth() &&

        today.getDate() ===
            date.getDate()
    );

}


function isOverdue(dateString) {

    if (!dateString) return false;


    const today =
        new Date();

    today.setHours(
        0, 0, 0, 0
    );


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    return date < today;

}


function formatDate(dateString) {

    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric"
        }
    );

}


/* =========================================
   TOAST
========================================= */

let toastTimer;


function showToast(message) {

    toastMessage.textContent =
        message;

    toast.classList.add(
        "show"
    );


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================
   DARK / LIGHT MODE
========================================= */

function loadTheme() {

    const saved =
        localStorage.getItem(
            "taskflowTheme"
        );


    if (saved === "light") {

        document.body.classList.add(
            "light"
        );

        themeToggle.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    }

}


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );


        const isLight =
            document.body.classList.contains(
                "light"
            );


        localStorage.setItem(
            "taskflowTheme",
            isLight
                ? "light"
                : "dark"
        );


        themeToggle.innerHTML =
            isLight

                ? '<i class="fa-solid fa-sun"></i>'

                : '<i class="fa-solid fa-moon"></i>';

    }
);


/* =========================================
   ESCAPE HTML
   Prevents unsafe HTML in task names
========================================= */

function escapeHTML(value) {

    return value
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================
   KEYBOARD SUPPORT
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            editModal.classList.contains(
                "show"
            )
        ) {

            closeEditModal();

        }

    }
);