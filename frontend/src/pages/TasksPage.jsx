import React, { useState, useEffect, useMemo } from 'react';
import { getTasks, updateTaskStatus } from '../api/tasks';
import { useAuth } from '../contexts/AuthContext';
import { CheckSquare, Search, Filter, Clock, CheckCircle2, Loader, Circle, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '../contexts/ToastContext';

/* ─── Donut Chart (pure CSS/SVG) ─── */
const DonutChart = ({ segments }) => {
  const size = 160;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
      {/* background track */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="currentColor"
        className="text-slate-100 dark:text-slate-800"
        strokeWidth={strokeWidth}
      />
      {total === 0 ? (
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="currentColor"
          className="text-slate-200 dark:text-slate-700"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeLinecap="round"
        />
      ) : (
        segments.map((seg, i) => {
          const pct = seg.value / total;
          const dash = pct * circumference;
          const offset = cumulative * circumference;
          cumulative += pct;
          return (
            <circle
              key={i}
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          );
        })
      )}
    </svg>
  );
};

/* ─── Horizontal Bar Chart ─── */
const HorizontalBar = ({ label, count, total, color, icon: Icon, iconClass }) => {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className={`flex items-center gap-2 font-medium ${iconClass}`}>
          <Icon size={15} />
          <span>{label}</span>
        </div>
        <span className="text-slate-500 dark:text-slate-400 text-xs">{count} task{count !== 1 ? 's' : ''} · {pct}%</span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
};

/* ─── Stat Pill ─── */
const StatPill = ({ label, count, colorClass, dotColor }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${colorClass}`}>
    <span className="w-2 h-2 rounded-full" style={{ background: dotColor }} />
    <span>{count}</span>
    <span className="opacity-80">{label}</span>
  </div>
);

/* ─── Main Page ─── */
const TasksPage = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Always fetch ALL tasks for stats, and also apply filter for table
      const [allData, filteredData] = await Promise.all([
        getTasks({}),
        getTasks(statusFilter ? { status: statusFilter } : {})
      ]);
      setAllTasks(allData.results || allData);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setAllTasks(allTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      showToast('Status updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-400';
      case 'medium': return 'text-amber-600 bg-amber-100 dark:bg-amber-500/20 dark:text-amber-400';
      case 'low': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  /* ── Derived stats ── */
  const stats = useMemo(() => {
    const todo = allTasks.filter(t => t.status === 'todo').length;
    const inProgress = allTasks.filter(t => t.status === 'in_progress').length;
    const completed = allTasks.filter(t => t.status === 'completed').length;
    const total = allTasks.length;
    return { todo, inProgress, completed, total };
  }, [allTasks]);

  const donutSegments = [
    { value: stats.completed, color: '#10b981' },
    { value: stats.inProgress, color: '#3b82f6' },
    { value: stats.todo, color: '#94a3b8' },
  ];

  /* ── Filtered tasks for table ── */
  const displayedTasks = useMemo(() => {
    return allTasks
      .filter(t => !statusFilter || t.status === statusFilter)
      .filter(t => !searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [allTasks, statusFilter, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="text-brand-500" />
            My Tasks
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track all your assigned tasks.</p>
        </div>
      </div>

      {/* ── Task Stats Charts ── */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Donut Chart Card */}
          <div className="glass-card p-6 flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2 self-start">
              <BarChart2 size={18} className="text-brand-500" />
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Task Overview</h3>
            </div>

            <div className="relative">
              <DonutChart segments={donutSegments} />
              {/* Centre label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Total</span>
              </div>
            </div>

            {/* Legend pills */}
            <div className="flex flex-wrap justify-center gap-2">
              <StatPill label="Done" count={stats.completed} colorClass="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" dotColor="#10b981" />
              <StatPill label="In Progress" count={stats.inProgress} colorClass="bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" dotColor="#3b82f6" />
              <StatPill label="To Do" count={stats.todo} colorClass="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" dotColor="#94a3b8" />
            </div>
          </div>

          {/* Horizontal Bars Card */}
          <div className="glass-card p-6 space-y-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 size={18} className="text-brand-500" />
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">Breakdown by Status</h3>
              </div>
              <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">{stats.total} tasks total</span>
            </div>

            <div className="space-y-5 pt-2">
              <HorizontalBar
                label="Completed"
                count={stats.completed}
                total={stats.total}
                color="#10b981"
                icon={CheckCircle2}
                iconClass="text-emerald-600 dark:text-emerald-400"
              />
              <HorizontalBar
                label="In Progress"
                count={stats.inProgress}
                total={stats.total}
                color="#3b82f6"
                icon={Loader}
                iconClass="text-blue-600 dark:text-blue-400"
              />
              <HorizontalBar
                label="To Do"
                count={stats.todo}
                total={stats.total}
                color="#94a3b8"
                icon={Circle}
                iconClass="text-slate-500 dark:text-slate-400"
              />
            </div>

            {/* Completion % row */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">Completion Rate</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                    style={{ width: `${stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearch} className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={18} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-full sm:w-48 cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Task Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
        </div>
      ) : displayedTasks.length > 0 ? (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Task Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {displayedTasks.map(task => (
                  <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900 dark:text-white">{task.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                      {task.project?.title || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className={`flex items-center gap-1.5 ${task.is_overdue ? 'text-red-500 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
                        <Clock size={14} />
                        {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        disabled={user.role !== 'admin' && task.assigned_to?.id !== user.id}
                        className={`text-sm rounded-full px-3 py-1 font-medium border-0 cursor-pointer outline-none ${
                          task.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 text-center text-slate-500">
          No tasks found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default TasksPage;
