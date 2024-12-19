const API_URL = "http://localhost:3000/todos";

const todoInput = document.getElementById("todoInput");
const addTaskButton = document.getElementById("addTaskButton");
const todoList = document.getElementById("todoList");

// Fetch and display todos
function fetchTodos() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((todos) => {
      todoList.innerHTML = "";
      todos.forEach((todo) => {
        const listItem = document.createElement("li");
        listItem.className = todo.completed ? "completed" : "";
        listItem.innerHTML = `
              <span>${todo.title}</span>
              <div>
                <button onclick="deleteTodo(${todo.id})">Delete</button>
              </div>
            `;

        // Add click listener to mark the task as completed
        listItem.addEventListener("click", () =>
          toggleCompleted(todo.id, !todo.completed)
        );
        todoList.appendChild(listItem);
      });
    });
}

// Add a new todo
addTaskButton.addEventListener("click", () => {
  const title = todoInput.value.trim();
  if (title) {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, completed: false }),
    }).then(() => {
      fetchTodos();
      todoInput.value = "";
    });
  }
});

// Delete a todo
function deleteTodo(id) {
  fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  }).then(fetchTodos);
}

// Toggle the completed status of a todo
function toggleCompleted(id, completed) {
  fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  }).then(fetchTodos);
}

// Initial fetch
fetchTodos();
