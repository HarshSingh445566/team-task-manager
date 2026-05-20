import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchProjects = () => {
    api.get('/projects').then((res) => setProjects(res.data));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await api.post('/projects', form);
      setForm({ name: '', description: '' });
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      alert('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    fetchProjects();
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <p className="text-slate-400 mt-1">Manage your team projects</p>
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-3 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Project
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg">No projects yet</p>
            <p className="text-slate-500 text-sm mt-1">Create your first project to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-purple-500 transition duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="flex-1"
                    onClick={() => navigate(`/projects/${project.id}/tasks`)}
                  >
                    <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-white font-semibold text-lg group-hover:text-purple-400 transition">
                      {project.name}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">{project.description || 'No description'}</p>
                  </div>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-slate-500 hover:text-red-400 transition ml-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                  <span className="text-slate-500 text-xs">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                  <span
                    onClick={() => navigate(`/projects/${project.id}/tasks`)}
                    className="text-purple-400 text-sm font-medium hover:text-purple-300 transition"
                  >
                    View Tasks →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Project Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-white font-bold text-xl mb-6">Create New Project</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition resize-none"
                    placeholder="Enter project description"
                    rows={3}
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
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}