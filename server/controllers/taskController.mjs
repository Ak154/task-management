import Task from "../models/task.mjs";

export const createTask = async (req, res) => {
  const { title, description = "", dueDate, priority, assignedTo } = req.body;
  try {
    let newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      createdBy: req.user.userId,
    });

    await newTask.save();
    res
      .status(201)
      .json({ message: "Task created successfully", success: true });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error while creating task",
      success: false,
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const tasks = await Task.find({ assignedTo: req.user.userId })
      .skip(skip)
      .limit(limit)
      .sort({ dueDate: 1 });

    const total = await Task.countDocuments();

    res.status(200).json({
      message: "Tasks get successfully",
      tasks,
      total,
      page,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server while getting tasks",
      success: false,
      error,
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found", success: false });
    }
    res.status(200).json({ message: "Get tasks id", task, success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error while getting task by id",
      success: false,
      error,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Task updated successfully", success: true });
    // res.json(task);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error while updating task",
      success: false,
      error,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found", success: false });
    }
    res
      .status(200)
      .json({ message: "Task deleted successfully", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error while deleting tasks",
      success: false,
      error,
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found", success: false });
    }
    task.status = req.body.status;
    await task.save();
    res
      .status(200)
      .json({ message: "Task status updated successfully", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error while updating status",
      success: false,
      error,
    });
  }
};
