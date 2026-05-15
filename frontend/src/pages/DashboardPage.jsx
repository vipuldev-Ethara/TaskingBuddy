import React, { useState, useEffect } from 'react';
import { getDashboardStats, getActivityLogs } from '../api/dashboard';
import { 
  CheckCircle2, Clock, FolderKanban, ListTodo, 
  TrendingUp, Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="glass-card p-6 flex items-center gap-4">
    <div className={`p-4 rounded-xl ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
    </div>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, activitiesData] = await Promise.all([
          getDashboardStats(),
          getActivityLogs()
        ]);
        setStats(statsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const { overview, tasks_by_status, productivity } = stats || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {user?.first_name}! Here's what's happening.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Projects" 
          value={overview?.total_projects || 0}
          icon={<FolderKanban size={24} />}
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
        />
        <StatCard 
          title="Total Tasks" 
          value={overview?.total_tasks || 0}
          icon={<ListTodo size={24} />}
          colorClass="bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
        />
        <StatCard 
          title="Completed Tasks" 
          value={overview?.completed_tasks || 0}
          icon={<CheckCircle2 size={24} />}
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
        />
        <StatCard 
          title="Overdue Tasks" 
          value={overview?.overdue_tasks || 0}
          icon={<Clock size={24} />}
          colorClass="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Charts/Progress (using simple HTML/CSS for now) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Productivity Trend</h3>
              <span className="text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded flex items-center gap-1">
                <TrendingUp size={14} /> +{productivity?.recently_completed || 0} this week
              </span>
            </div>
            
            {/* Simple CSS Bar Chart Representation */}
            <div className="h-64 flex items-end justify-between gap-2 pb-6 border-b border-slate-100 dark:border-slate-800">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const height = Math.random() * 80 + 10; // Mock data for visual
                return (
                  <div key={day} className="flex flex-col items-center flex-1 gap-2 group">
                    <div 
                      className="w-full max-w-[40px] bg-brand-500 rounded-t-md transition-all duration-300 group-hover:bg-brand-400"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-slate-500">{day}</span>
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Task Status</h3>
              <div className="space-y-4">
                {tasks_by_status?.map(status => (
                  <div key={status.status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-slate-600 dark:text-slate-300">{status.status.replace('_', ' ')}</span>
                      <span className="font-medium">{status.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          status.status === 'completed' ? 'bg-emerald-500' :
                          status.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${(status.count / (overview.total_tasks || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                {(!tasks_by_status || tasks_by_status.length === 0) && (
                   <p className="text-sm text-slate-500">No tasks available.</p>
                )}
              </div>
            </div>
            
            {/* Mock Quick Actions */}
            <div className="glass-card p-6 bg-gradient-to-br from-brand-600 to-brand-800 text-white border-transparent">
              <h3 className="text-lg font-bold mb-2">Need to assign work?</h3>
              <p className="text-brand-100 text-sm mb-6">Create a new task and assign it to your team members instantly.</p>
              <button className="bg-white text-brand-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-50 transition-colors w-full">
                Create New Task
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="glass-card p-0 overflow-hidden flex flex-col h-full max-h-[800px]">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Activity className="text-brand-500" size={20} />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {activities.length > 0 ? activities.map((activity) => (
              <div key={activity.id} className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-[-24px] before:w-px before:bg-slate-200 dark:before:bg-slate-700 last:before:hidden">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-brand-100 dark:bg-brand-900 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 text-sm border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-800 dark:text-slate-200">
                    <span className="font-semibold">{activity.user?.first_name}</span> {activity.description}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-500 text-sm">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
