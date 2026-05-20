import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Tasks() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', due_date: '', assigned_to: '' });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchTasks = () => {
    api.get(`/projects/${id}/tasks`).then((res) => setTasks(res.data));
  };

  useEffect(() => {
    fetchTasks();
  }, [id]);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await api.post(`/projects/${id}/tasks`, form);
      setForm({ title: '', description: '', due_date: '', assigned_to: '' });
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      alert('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    await api.put(`/tasks/${taskId}`, { status });
    fetchTasks();
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    await api.delete(`/tasks/${taskId}`);
    fetchTasks();
  };

  const getStatusBadge = (status) => {
    if (status === 'todo') return 'bg-slate-500/20 text-slate-300 border-slate-500/50';
    if (status === 'in-progress') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
    if (status === 'done') return 'bg-green-500/20 text-green-300 border-green-500/50';
    return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
  };

  const isOverdue = (due_date, status) => {
    if (!due_date || status === 'done') return false;
    return new Date(due_date) < new Date();
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Tasks</h1>
            <p className="text-slate-400 mt-1">Manage tasks for this project</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-3 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg">No tasks yet</p>
            <p className="text-slate-500 text-sm mt-1">Create your first task to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-slate-800 border rounded-2xl p-6 transition duration-200 ${
                  isOverdue(task.due_date, task.status)
                    ? 'border-red-500/50'
                    : 'border-slate-700 hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold text-lg">{task.title}</h3>
                      {isOverdue(task.due_date, task.status) && (
                        <span className="bg-red-500/20 text-red-400 border border-red-500/50 text-xs px-2 py-1 rounded-full">
                          Overdue
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-slate-400 text-sm mb-3">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-3 py-1 rounded-full border capitalize ${getStatusBadge(task.status)}`}>
                        {task.status}
                      </span>
                      {task.due_date && (
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 transition"
                    >
                      <option value="todo">Todo</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-slate-500 hover:text-red-400 transition p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Task Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-white font-bold text-xl mb-6">Create New Task</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Task Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition resize-none"
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={form.due_date}
                    onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Assign To (User ID)</label>
                  <input
                    type="number"
                    value={form.assigned_to}
                    onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                    placeholder="Enter user ID"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}