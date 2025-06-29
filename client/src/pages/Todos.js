import React, { useEffect, useState } from "react";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState("⏳ Loading...");
  const [newTodo, setNewTodo] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");


  const token = localStorage.getItem("token");

  // Fetch all todos
  const fetchTodos = async () => {
    if (!token) {
      setMessage("❌ No token found. Please login.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setTodos(data);
        if (data.length === 0) setMessage("📭 No todos yet.");
        else setMessage("");
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage("❌ Failed to load todos.");
    }
  };

  // Add new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newTodo }),
      });

      const data = await res.json();

      if (res.ok) {
        setTodos((prev) => [...prev, data.todo]);
        setNewTodo("");
        setMessage("");
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage("❌ Failed to add todo.");
    }
  };

  // Toggle complete status
const handleToggle = async (id) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/todos/${id}/toggle`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? data.todo : todo))
      );
    } else {
      setMessage(`❌ ${data.error}`);
    }
  } catch (err) {
    setMessage("❌ Toggle failed");
  }
};

// Delete a todo
const handleDelete = async (id) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } else {
      setMessage(`❌ ${data.error}`);
    }
  } catch (err) {
    setMessage("❌ Delete failed");
  }
};

const handleEdit = (id, currentText) => {
  setEditingId(id);
  setEditingText(currentText);
};

const handleUpdate = async (id) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: editingText }),
    });

    const data = await res.json();

    if (res.ok) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id ? { ...todo, text: editingText } : todo
        )
      );
      setEditingId(null);
      setEditingText("");
    } else {
      setMessage(`❌ ${data.error}`);
    }
  } catch (err) {
    setMessage("❌ Update failed");
  }
};

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Your To-Dos</h2>

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          placeholder="Enter new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {message && <p>{message}</p>}

<ul>
  {todos.map((todo) => (
    <li key={todo._id}>
      {editingId === todo._id ? (
        <>
          <input
            type="text"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
          />
          <button onClick={() => handleUpdate(todo._id)}>💾 Save</button>
          <button onClick={() => setEditingId(null)}>❌ Cancel</button>
        </>
      ) : (
        <>
          <span
            onClick={() => handleToggle(todo._id)}
            style={{
              cursor: "pointer",
              textDecoration: todo.completed ? "line-through" : "none",
              marginRight: "10px",
            }}
          >
            {todo.completed ? "✅" : "⬜️"} {todo.text}
          </span>
          <button onClick={() => handleEdit(todo._id, todo.text)}>✏️</button>
          <button onClick={() => handleDelete(todo._id)}>❌</button>
        </>
      )}
    </li>
  ))}
</ul>


    </div>
  );
}
