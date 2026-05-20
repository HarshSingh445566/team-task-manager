import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/dashboard').then((res) => setData(res.data));
  }, []);

  const getStatusColor = (status) => {
    if (status === 'todo') return 'bg-slate-500';
    if (status === 'in-progress') return 'bg-yellow-500';
    if (status === 'done') return 'bg-green-500';
    return 'bg-purple-500';
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-slate-400 mt-1">Here's what's happening with your tasks today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 font-medium">Total Tasks</p>
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-white">{data?.total ?? '...'}</p>
            <p className="text-slate-500 text-sm mt-1">Assigned to you</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 font-medium">Overdue</p>
              <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-white">{data?.overdue ?? '...'}</p>
            <p className="text-slate-500 text-sm mt-1">Need attention</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 font-medium">Completed</p>
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-white">
              {data?.byStatus?.find((s) => s.status === 'done')?.count ?? '0'}
            </p>
            <p className="text-slate-500 text-sm mt-1">Tasks done</p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-6">Tasks by Status</h2>
          {data?.byStatus?.length === 0 && (
            <p className="text-slate-400">No tasks yet.</p>
          )}
          <div className="space-y-4">
            {data?.byStatus?.map((item) => (
              <div key={item.status} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
                <span className="text-slate-300 capitalize w-28">{item.status}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getStatusColor(item.status)}`}
                    style={{ width: `${(item.count / data.total) * 100}%` }}
                  />
                </div>
                <span className="text-slate-400 text-sm w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}