// --- DOM Elements ---
const inputTask = document.getElementById("inputTask");
const addTaskBtn = document.getElementById("addTaskBtn");
const mainDiv = document.querySelector(".mainDiv");
const emptyState = document.getElementById("emptyState");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const themeToggle = document.getElementById("themeToggle");

// --- Data Initialization ---
let taskArr = JSON.parse(localStorage.getItem("tasks")) || [];

// --- Core Logic Functions ---

// Save to LocalStorage and Refresh UI
function syncData() {
  localStorage.setItem("tasks", JSON.stringify(taskArr));
  updateUI();
}

// Update Progress Bar, Text, and Empty State
function updateUI() {
  // 1. Toggle Empty State
  emptyState.style.display = taskArr.length === 0 ? "block" : "none";

  // 2. Calculate Progress
  if (taskArr.length === 0) {
    progressBar.style.width = "0%";
    progressText.innerText = "0%";
  } else {
    const completedCount = taskArr.filter((t) => t.sts).length;
    const percentage = Math.round((completedCount / taskArr.length) * 100);
    progressBar.style.width = percentage + "%";
    progressText.innerText = percentage + "%";
  }
}

// Render a task element
function renderTask(taskObj) {
  const taskContainer = document.createElement("div");
  taskContainer.className = "taskContainer";
  if (taskObj.sts) taskContainer.classList.add("completed-task");

  // Checkbox
  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.className = "checkbox";
  cb.checked = taskObj.sts;

  const taskTextDiv = document.createElement("div");
  taskTextDiv.className = "taskTextDiv";
  taskTextDiv.innerText = taskObj.description;
  if (taskObj.sts) taskTextDiv.style.textDecoration = "line-through";

  // Checkbox Event
  cb.addEventListener("change", function () {
    taskObj.sts = cb.checked;
    taskTextDiv.style.textDecoration = cb.checked ? "line-through" : "none";
    taskContainer.classList.toggle("completed-task", cb.checked);
    syncData();
  });

  // Controls Container
  const taskControlDiv = document.createElement("div");
  taskControlDiv.className = "taskControlDiv";

  // --- NEW INLINE EDIT LOGIC ---
  const editBtn = document.createElement("div");
  editBtn.className = "taskEditDiv";
  editBtn.innerHTML = '<i class="ri-pencil-line"></i>';

  editBtn.onclick = () => {
    // If already editing, don't do anything
    if (taskTextDiv.querySelector(".inline-edit-input")) return;

    const originalText = taskObj.description;
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "inline-edit-input";
    editInput.value = originalText;

    taskTextDiv.innerHTML = "";
    taskTextDiv.appendChild(editInput);
    editInput.focus();

    // Save Function
    const saveEdit = () => {
      const newText = editInput.value.trim();
      if (newText && newText !== "") {
        taskObj.description = newText;
        taskTextDiv.innerText = newText;
        syncData();
      } else {
        taskTextDiv.innerText = originalText; // Revert if empty
      }
    };

    editInput.onkeypress = (e) => {
      if (e.key === "Enter") saveEdit();
    };
    editInput.onblur = saveEdit; // Save if user clicks away
  };

  // Delete Button
  const deleteBtn = document.createElement("div");
  deleteBtn.className = "taskRemoveDiv";
  deleteBtn.innerHTML = '<i class="ri-delete-bin-line"></i>';
  deleteBtn.onclick = () => {
    // Slide out animation
    taskContainer.style.transform = "translateX(30px)";
    taskContainer.style.opacity = "0";
    setTimeout(() => {
      taskArr = taskArr.filter((t) => t !== taskObj);
      taskContainer.remove();
      syncData();
    }, 300);
  };

  taskControlDiv.appendChild(editBtn);
  taskControlDiv.appendChild(deleteBtn);

  taskContainer.appendChild(cb);
  taskContainer.appendChild(taskTextDiv);
  taskContainer.appendChild(taskControlDiv);

  mainDiv.prepend(taskContainer);
}

// --- Initialization ---

function init() {
  mainDiv.innerHTML = "";
  taskArr.forEach(renderTask);
  updateUI();

  // Apply saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.querySelector("i").className = "ri-sun-line";
  }
}

function addNewTask() {
  const val = inputTask.value.trim();
  if (!val) return;

  const newTask = { description: val, sts: false };
  taskArr.push(newTask);
  renderTask(newTask);
  inputTask.value = "";
  syncData();
}

// --- Global Event Listeners ---

addTaskBtn.onclick = addNewTask;

inputTask.onkeypress = (e) => {
  if (e.key === "Enter") addNewTask();
};

themeToggle.onclick = () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeToggle.querySelector("i").className = isDark
    ? "ri-sun-line"
    : "ri-moon-line";
  localStorage.setItem("theme", isDark ? "dark" : "light");
};

// Start the app
init();
