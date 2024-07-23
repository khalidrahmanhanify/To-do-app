document.addEventListener("DOMContentLoaded", function () {
  const inputBox = document.getElementById("input-box");
  const listContainer = document.getElementById("list-container");
  const progressBar = document.getElementById("progress-bar");

  function addTask() {
    if (inputBox.value.trim() === "") {
      alert("You must write something!");
      return;
    }

    let li = createTaskElement(inputBox.value.trim());
    listContainer.prepend(li);
    inputBox.value = "";
    saveData();
    updateProgressBar();
  }

  function createTaskElement(taskText) {
    let li = document.createElement("li");
    li.textContent = taskText;

    let spanMenu = document.createElement("span");
    spanMenu.innerHTML = "\u22EE"; // Three dots symbol
    spanMenu.className = "menu";
    spanMenu.onclick = function (e) {
      e.stopPropagation();
      toggleDropdown(li);
    };
    li.appendChild(spanMenu);

    let dropdown = document.createElement("div");
    dropdown.className = "dropdown-content";

    let editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    editButton.className = "edit";
    editButton.onclick = function (e) {
      e.stopPropagation();
      editTask(li);
      closeDropdown(dropdown);
    };

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function () {
      li.remove();
      saveData();
      updateProgressBar();
      closeDropdown(dropdown);
    };

    dropdown.appendChild(editButton);
    dropdown.appendChild(deleteButton);
    li.appendChild(dropdown);

    li.addEventListener("click", function () {
      this.classList.toggle("checked");
      saveData();
      updateProgressBar();
    });

    return li;
  }

  function editTask(li) {
    let currentText = li.childNodes[0].textContent.trim();
    let newText = prompt("Edit your task:", currentText);
    if (newText === null || newText === "") {
      alert("You must write something!");
    } else {
      li.childNodes[0].textContent = newText;
      saveData();
    }
  }

  function saveData() {
    localStorage.setItem("todoList", listContainer.innerHTML);
  }

  function loadTasks() {
    listContainer.innerHTML = localStorage.getItem("todoList") || "";
    let items = listContainer.querySelectorAll("li");
    items.forEach(function (item) {
      initializeTaskItem(item);
    });
    updateProgressBar();
  }

  function initializeTaskItem(item) {
    item.addEventListener("click", function () {
      this.classList.toggle("checked");
      saveData();
      updateProgressBar();
    });

    let menu = item.querySelector(".menu");
    menu.onclick = function (e) {
      e.stopPropagation();
      toggleDropdown(item);
    };

    let editBtn = item.querySelector(".edit");
    if (editBtn) {
      editBtn.onclick = function (e) {
        e.stopPropagation();
        editTask(item);
        closeDropdown(item.querySelector(".dropdown-content"));
      };
    }

    let deleteBtn = item.querySelector(".dropdown-content button:nth-child(2)");
    if (deleteBtn) {
      deleteBtn.onclick = function () {
        item.remove();
        saveData();
        updateProgressBar();
        closeDropdown(item.querySelector(".dropdown-content"));
      };
    }

    let closeBtn = item.querySelector(".dropdown-content button:nth-child(3)");
    if (closeBtn) {
      closeBtn.onclick = function (e) {
        e.stopPropagation();
        closeDropdown(item.querySelector(".dropdown-content"));
      };
    }
  }

  function toggleDropdown(li) {
    let dropdown = li.querySelector(".dropdown-content");
    if (dropdown.classList.contains("show")) {
      closeDropdown(dropdown);
    } else {
      closeDropdown();
      dropdown.classList.add("show");
      document.addEventListener("click", closeDropdownOutside);
    }
  }

  function closeDropdown(dropdown) {
    let dropdowns = document.querySelectorAll(".dropdown-content.show");
    dropdowns.forEach(function (dropdown) {
      dropdown.classList.remove("show");
    });
    document.removeEventListener("click", closeDropdownOutside);
  }

  function closeDropdownOutside(e) {
    let dropdowns = document.querySelectorAll(".dropdown-content.show");
    dropdowns.forEach(function (dropdown) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("show");
      }
    });
    document.removeEventListener("click", closeDropdownOutside);
  }
  const addButton = document.getElementById("add-button");
  addButton.addEventListener("click", addTask);

  inputBox.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });

  function updateProgressBar() {
    const totalTasks = listContainer.querySelectorAll("li").length;
    const completedTasks = listContainer.querySelectorAll("li.checked").length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    progressBar.style.width = progress + "%";

    const progressPercentage = document.getElementById("progress-percentage");
    progressPercentage.textContent = progress.toFixed(0) + "%";
  }

  loadTasks();
});
