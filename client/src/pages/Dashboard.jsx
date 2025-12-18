import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const users = ["Anand", "Rahul", "Suresh"];

const Dashboard = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design Login Page",
      description: "Create responsive login UI",
      dueDate: "2025-01-10",
      status: "pending",
      priority: "high",
      assignedTo: "Anand",
    },
  ]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({ role: "admin" });

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewTask, setViewTask] = useState(null);

  const MODAL_BACKDROP =
    "fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center";

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    assignedTo: "",
  });

  const handleChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleSubmitTask = (e) => {
    e.preventDefault();

    if (isEditing) {
      setTasks(
        tasks.map((task) =>
          task.id === selectedTaskId ? { ...task, ...taskForm } : task
        )
      );
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          ...taskForm,
          status: "pending",
        },
      ]);
    }

    resetModal();
  };

  const resetModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedTaskId(null);
    setTaskForm({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
      assignedTo: "",
    });
  };

  const handleEdit = (task) => {
    setIsEditing(true);
    setSelectedTaskId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      assignedTo: task.assignedTo,
    });
    setShowModal(true);
  };

  const handleView = (task) => {
    setViewTask(task);
    setShowViewModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const handleStatusUpdate = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: "completed" } : task
      )
    );
  };

  const getUserInfo = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/user-info",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        }
      );
      if (response.data.success) {
        setUserInfo(response.data.data);
      }
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          error?.response?.message ||
          error?.message
      );
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const visibleTasks =
    userInfo?.role === "admin"
      ? tasks
      : tasks.filter((task) => task.assignedTo === userInfo?.name);

  useEffect(() => {
    getUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Dashboard ({userInfo.role})</h1>

        {userInfo.role === "admin" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Create Task
          </button>
        )}
      </div>

      {/* Task Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Due Date</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Assigned To</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {visibleTasks.map((task) => (
              <tr key={task.id} className="border-t">
                <td className="p-3">{task.title}</td>
                <td className="p-3">{task.dueDate}</td>
                <td className="p-3 capitalize">{task.priority}</td>
                <td className="p-3 capitalize">
                  <span
                    className={
                      task.status === "completed"
                        ? "text-green-600"
                        : "text-orange-600"
                    }
                  >
                    {task.status}
                  </span>
                </td>
                <td className="p-3">{task.assignedTo}</td>
                <td className="p-3 space-x-3">
                  <button
                    onClick={() => handleView(task)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>

                  {userInfo.role === "user" && task.status !== "completed" && (
                    <button
                      onClick={() => handleStatusUpdate(task.id)}
                      className="text-green-600 hover:underline"
                    >
                      Mark As Complete
                    </button>
                  )}

                  {userInfo.role === "admin" && (
                    <>
                      <button
                        onClick={() => handleEdit(task)}
                        className="text-yellow-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className={MODAL_BACKDROP}>
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Task" : "Create Task"}
            </h2>

            <form onSubmit={handleSubmitTask} className="space-y-3">
              <input
                name="title"
                placeholder="Title"
                required
                value={taskForm.title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <textarea
                name="description"
                placeholder="Description"
                value={taskForm.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                type="date"
                name="dueDate"
                value={taskForm.dueDate}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <select
                name="priority"
                value={taskForm.priority}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <select
                name="assignedTo"
                required
                value={taskForm.assignedTo}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Assign User</option>
                {users.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={resetModal}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                  {isEditing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showViewModal && viewTask && (
        <div className={MODAL_BACKDROP}>
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Task Details</h2>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Title:</strong> {viewTask.title}
              </p>
              <p>
                <strong>Description:</strong> {viewTask.description || "—"}
              </p>
              <p>
                <strong>Due Date:</strong> {viewTask.dueDate}
              </p>
              <p>
                <strong>Priority:</strong> {viewTask.priority}
              </p>
              <p>
                <strong>Status:</strong> {viewTask.status}
              </p>
              <p>
                <strong>Assigned To:</strong> {viewTask.assignedTo}
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setShowViewModal(false)}
                className="border px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
