const express = require("express");
const ToDo = require("../models/ToDo");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected GET /api/todos
router.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await ToDo.find({ userId: req.user.userId });
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/todos - Add new todo
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "To-Do text is required" });
    }

    const newTodo = new ToDo({
      userId: req.user.userId,
      text,
    });

    await newTodo.save();

    res.status(201).json({ message: "To-Do created", todo: newTodo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/todos/:id/toggle
router.patch("/:id/toggle", authMiddleware, async (req, res) => {
  try {
    const todo = await ToDo.findOne({ _id: req.params.id, userId: req.user.userId });

    if (!todo) return res.status(404).json({ error: "To-Do not found" });

    todo.completed = !todo.completed;
    await todo.save();

    res.json({ message: "To-Do toggled", todo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/todos/:id
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    const todo = await ToDo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { text },
      { new: true }
    );

    if (!todo) return res.status(404).json({ error: "To-Do not found" });

    res.json({ message: "To-Do updated", todo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/todos/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await ToDo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!todo) return res.status(404).json({ error: "To-Do not found" });

    res.json({ message: "To-Do deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
