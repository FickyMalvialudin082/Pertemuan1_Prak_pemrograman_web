document.addEventListener("DOMContentLoaded", () => {
  // 1. Ambil elemen DOM
  const todoForm = document.querySelector("#todoForm");
  const taskInput = document.querySelector("#taskInput");
  const inputError = document.querySelector("#inputError");
  const todoList = document.querySelector("#todoList");
  const taskCounter = document.querySelector("#taskCounter");
  const clearCompletedBtn = document.querySelector("#clearCompletedBtn");

  // 2. Fungsi membaca dan menyimpan ke LocalStorage
  const getTasks = () => JSON.parse(localStorage.getItem("todo_tasks")) || [];
  const saveTasks = (tasks) => localStorage.setItem("todo_tasks", JSON.stringify(tasks));

  // Fitur 1: Fungsi pembaruan Task Counter
  const updateTaskCounter = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;

    taskCounter.textContent = `Total: ${total} Tugas | Selesai: ${completed} | Belum Selesai: ${pending}`;
  };

  // 3. Fungsi menampilkan daftar tugas ke layar
  const renderTasks = () => {
    const tasks = getTasks();
    todoList.innerHTML = "";

    // Sinkronisasi counter setiap kali re-render
    updateTaskCounter(tasks);

    if (tasks.length === 0) {
      todoList.innerHTML = `<li style="text-align: center; color: #64748b; font-size: 14px; padding: 12px 0;">Belum ada tugas tersimpan.</li>`;
      return;
    }

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `todo-item ${task.completed ? "completed" : ""}`;
      li.innerHTML = `
        <span class="todo-text">${task.text}</span>
        <div class="todo-actions">
          <button class="action-btn complete-btn" data-index="${index}">
            ${task.completed ? "Batal" : "Selesai"}
          </button>
          <button class="action-btn delete-btn" data-index="${index}">
            Hapus
          </button>
        </div>
      `;
      todoList.appendChild(li);
    });
  };

  // 4. Tambah tugas saat formulir dikirim
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();

    if (taskText.length < 3) {
      taskInput.classList.add("error");
      inputError.style.display = "block";
      return;
    }

    taskInput.classList.remove("error");
    inputError.style.display = "none";

    const tasks = getTasks();
    tasks.push({ text: taskText, completed: false });
    saveTasks(tasks);

    taskInput.value = "";
    renderTasks();
  });

  // 5. Delegasi event untuk tombol Selesai dan Hapus
  todoList.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (index === undefined) return;

    const tasks = getTasks();

    if (e.target.classList.contains("complete-btn")) {
      tasks[index].completed = !tasks[index].completed;
      saveTasks(tasks);
      renderTasks();
    } else if (e.target.classList.contains("delete-btn")) {
      // Fitur 3: Konfirmasi dialog sebelum menghapus tugas
      const confirmed = confirm("Apakah Anda yakin ingin menghapus tugas ini?");
      if (confirmed) {
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
      }
    }
  });

  // Fitur 2: Bersihkan tugas yang sudah berstatus selesai
  clearCompletedBtn.addEventListener("click", () => {
    const tasks = getTasks();
    const activeTasks = tasks.filter((task) => !task.completed);

    saveTasks(activeTasks);
    renderTasks();
  });

  // Render pertama kali saat halaman dimuat
  renderTasks();
});