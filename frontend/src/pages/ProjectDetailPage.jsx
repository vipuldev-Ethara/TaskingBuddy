import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProject, updateProject, deleteProject, addProjectMember, removeProjectMember } from '../api/projects';
import { getTasks, updateTaskStatus, createTask, updateTask, deleteTask } from '../api/tasks';
import { getUsers } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { ArrowLeft, Calendar, Users, Plus, CheckCircle2, Clock, AlignLeft, Trash2, Edit2, X, Loader2, Settings } from 'lucide-react';
import { format } from 'date-fns';

const TaskCard = ({ task, onStatusChange, onEdit, onDelete, canEdit, isAdmin }) => {
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-400';
      case 'medium': return 'text-amber-600 bg-amber-100 dark:bg-amber-500/20 dark:text-amber-400';
      case 'low': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group relative">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {canEdit && (
            <select 
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value)}
              className="text-xs bg-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 outline-none cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          )}
          {canEdit && (
            <button 
              onClick={() => onEdit(task)}
              className="text-slate-400 hover:text-brand-500 transition-colors ml-1"
              title="Edit Task"
            >
              <Edit2 size={14} />
            </button>
          )}
          {isAdmin && (
            <button 
              onClick={() => onDelete(task.id)}
              className="text-slate-400 hover:text-red-500 transition-colors ml-1"
              title="Delete Task"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
      
      <h4 className="font-medium text-slate-900 dark:text-white mb-2 leading-tight">
        {task.title}
      </h4>
      
      {task.description && (
        <div className="flex items-center text-slate-400 mb-3">
          <AlignLeft size={14} />
        </div>
      )}
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Clock size={14} className={task.is_overdue ? 'text-red-500' : ''} />
          <span className={task.is_overdue ? 'text-red-500 font-medium' : ''}>
            {task.due_date ? format(new Date(task.due_date), 'MMM d') : '-'}
          </span>
        </div>
        
        {task.assigned_to && (
          <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold" title={task.assigned_to.first_name}>
            {task.assigned_to.avatar ? (
              <img src={task.assigned_to.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              task.assigned_to.first_name?.[0] || 'U'
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    due_date: '',
    assigned_to: ''
  });

  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'active'
  });

  const [isManageMembersModalOpen, setIsManageMembersModalOpen] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      const [projectData, tasksData, usersData] = await Promise.all([
        getProject(id),
        getTasks({ project: id }),
        getUsers()
      ]);
      setProject(projectData);
      setTasks(tasksData.results || tasksData);
      setAllUsers(usersData.results || usersData);
    } catch (error) {
      showToast('Failed to load project details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      showToast('Task updated', 'success');
    } catch (error) {
      showToast('Failed to update task status', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      showToast('Task deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete task', 'error');
    }
  };

  const openCreateTaskModal = (status) => {
    setEditingTaskId(null);
    setTaskForm({ status, title: '', description: '', due_date: '', assigned_to: '', priority: 'medium' });
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      due_date: task.due_date || '',
      assigned_to: task.assigned_to ? task.assigned_to.id : ''
    });
    setIsTaskModalOpen(true);
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...taskForm,
        project: id,
        assigned_to: taskForm.assigned_to || null,
        due_date: taskForm.due_date || null
      };
      
      if (editingTaskId) {
        await updateTask(editingTaskId, payload);
        showToast('Task updated successfully', 'success');
        setIsTaskModalOpen(false);
        fetchProjectDetails();
      } else {
        await createTask(payload);
        showToast('Task created successfully', 'success');
        setIsTaskModalOpen(false);
        fetchProjectDetails();
      }
    } catch (error) {
      showToast(editingTaskId ? 'Failed to update task' : 'Failed to create task', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditProjectModal = () => {
    setProjectForm({
      title: project.title,
      description: project.description || '',
      deadline: project.deadline || '',
      status: project.status
    });
    setIsEditProjectModalOpen(true);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    setIsSubmittingProject(true);
    try {
      const payload = {
        ...projectForm,
        deadline: projectForm.deadline || null
      };
      
      const updatedProject = await updateProject(id, payload);
      setProject(updatedProject);
      showToast('Project updated successfully', 'success');
      setIsEditProjectModalOpen(false);
    } catch (error) {
      showToast('Failed to update project', 'error');
      console.error(error);
    } finally {
      setIsSubmittingProject(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this project? This action cannot be undone and will delete all associated tasks.")) return;
    try {
      await deleteProject(id);
      showToast('Project deleted successfully', 'success');
      navigate('/projects');
    } catch (error) {
      showToast('Failed to delete project', 'error');
    }
  };

  const toggleProjectMember = async (targetUserId, isMember) => {
    try {
      if (isMember) {
        await removeProjectMember(id, targetUserId);
        showToast('Member removed from project', 'success');
      } else {
        await addProjectMember(id, targetUserId);
        showToast('Member added to project', 'success');
      }
      fetchProjectDetails();
    } catch (error) {
      showToast('Failed to update project members', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!project) return <div>Project not found</div>;

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const canEditTask = (task) => user?.role === 'admin' || task?.assigned_to?.id === user?.id;

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      <Link to="/projects" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors w-fit">
        <ArrowLeft size={16} className="mr-1" /> Back to Projects
      </Link>

      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{project.title}</h1>
            <div className="flex items-center gap-3">
              {user?.role === 'admin' && (
                <>
                  <button onClick={openEditProjectModal} className="btn btn-secondary flex items-center gap-2">
                    <Edit2 size={16} /> Edit
                  </button>
                  <button onClick={handleDeleteProject} className="btn btn-secondary text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2">
                    <Trash2 size={16} /> Delete
                  </button>
                </>
              )}
            </div>
          </div>
          
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl mb-6">
            {project.description || 'No description provided.'}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-brand-500" />
              <span>Due: {project.deadline ? format(new Date(project.deadline), 'MMM d, yyyy') : 'No deadline'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-brand-500" />
              <span>Status: <span className="capitalize font-medium text-slate-700 dark:text-slate-200">{project.status.replace('_', ' ')}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-brand-500" />
              <div className="flex -space-x-2">
                {project.members.slice(0, 5).map(member => (
                  <div key={member.id} className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 flex items-center justify-center text-[10px] font-bold overflow-hidden" title={member.first_name}>
                    {member.avatar ? (
                      <img src={member.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      member.first_name?.[0] || 'U'
                    )}
                  </div>
                ))}
                {project.members.length > 5 && (
                  <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                    +{project.members.length - 5}
                  </div>
                )}
              </div>
              {user?.role === 'admin' && (
                <button 
                  onClick={() => setIsManageMembersModalOpen(true)} 
                  className="ml-2 flex items-center gap-1 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium text-xs bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded-md transition-colors"
                >
                  <Settings size={12} /> Manage
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
          {/* To Do Column */}
          <div className="w-80 flex flex-col bg-slate-100/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 h-full">
            <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center bg-white/50 dark:bg-slate-800/50 rounded-t-xl">
              <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                To Do
                <span className="bg-slate-200 dark:bg-slate-700 text-xs px-2 py-0.5 rounded-full ml-1">{todoTasks.length}</span>
              </h3>
              {user?.role === 'admin' && (
                <button onClick={() => openCreateTaskModal('todo')} className="text-slate-400 hover:text-brand-500 transition-colors p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"><Plus size={18} /></button>
              )}
            </div>
            <div className="p-3 space-y-3 overflow-y-auto flex-1">
              {todoTasks.map(task => (
                <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onEdit={openEditTaskModal} onDelete={handleDeleteTask} canEdit={canEditTask(task)} isAdmin={user?.role === 'admin'} />
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="w-80 flex flex-col bg-slate-100/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 h-full">
            <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center bg-white/50 dark:bg-slate-800/50 rounded-t-xl">
              <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                In Progress
                <span className="bg-slate-200 dark:bg-slate-700 text-xs px-2 py-0.5 rounded-full ml-1">{inProgressTasks.length}</span>
              </h3>
              {user?.role === 'admin' && (
                <button onClick={() => openCreateTaskModal('in_progress')} className="text-slate-400 hover:text-brand-500 transition-colors p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"><Plus size={18} /></button>
              )}
            </div>
            <div className="p-3 space-y-3 overflow-y-auto flex-1">
              {inProgressTasks.map(task => (
                <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onEdit={openEditTaskModal} onDelete={handleDeleteTask} canEdit={canEditTask(task)} isAdmin={user?.role === 'admin'} />
              ))}
            </div>
          </div>

          {/* Completed Column */}
          <div className="w-80 flex flex-col bg-slate-100/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 h-full">
            <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center bg-white/50 dark:bg-slate-800/50 rounded-t-xl">
              <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Completed
                <span className="bg-slate-200 dark:bg-slate-700 text-xs px-2 py-0.5 rounded-full ml-1">{completedTasks.length}</span>
              </h3>
              {user?.role === 'admin' && (
                <button onClick={() => openCreateTaskModal('completed')} className="text-slate-400 hover:text-brand-500 transition-colors p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"><Plus size={18} /></button>
              )}
            </div>
            <div className="p-3 space-y-3 overflow-y-auto flex-1">
              {completedTasks.map(task => (
                <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onEdit={openEditTaskModal} onDelete={handleDeleteTask} canEdit={canEditTask(task)} isAdmin={user?.role === 'admin'} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Project Modal */}
      {isEditProjectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Project</h2>
              <button onClick={() => setIsEditProjectModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProject} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Title</label>
                <input type="text" required value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
                <textarea value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="input-field h-24 resize-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value})} className="input-field">
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deadline (Optional)</label>
                  <input type="date" value={projectForm.deadline} onChange={e => setProjectForm({...projectForm, deadline: e.target.value})} className="input-field" />
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsEditProjectModalOpen(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={isSubmittingProject} className="btn btn-primary flex-1">
                  {isSubmittingProject ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create/Edit Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingTaskId ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitTask} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
                <input type="text" required value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="input-field" placeholder="E.g., Update landing page copy" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
                <textarea value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} className="input-field h-24 resize-none" placeholder="Provide more details..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select value={taskForm.status} onChange={e => setTaskForm({...taskForm, status: e.target.value})} className="input-field">
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})} className="input-field">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign To (Optional)</label>
                  <select value={taskForm.assigned_to} onChange={e => setTaskForm({...taskForm, assigned_to: e.target.value})} className="input-field">
                    <option value="">Unassigned</option>
                    {project.members.map(m => (
                      <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date (Optional)</label>
                  <input type="date" value={taskForm.due_date} onChange={e => setTaskForm({...taskForm, due_date: e.target.value})} className="input-field" />
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary flex-1">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin mx-auto" /> : (editingTaskId ? 'Update Task' : 'Create Task')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Project Members Modal */}
      {isManageMembersModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Team Members</h2>
              <button onClick={() => setIsManageMembersModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto">
              <p className="text-sm text-slate-500 mb-4">Add or remove members for this specific project. Only project members can be assigned to tasks.</p>
              
              <div className="space-y-3">
                {allUsers.map(sysUser => {
                  const isMember = project.members.some(m => m.id === sysUser.id);
                  return (
                    <div key={sysUser.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 flex items-center justify-center text-sm font-bold overflow-hidden">
                          {sysUser.avatar ? (
                            <img src={sysUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            sysUser.first_name?.[0] || 'U'
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">
                            {sysUser.first_name} {sysUser.last_name}
                          </p>
                          <p className="text-xs text-slate-500 truncate max-w-[120px] sm:max-w-xs">{sysUser.email}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => toggleProjectMember(sysUser.id, isMember)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          isMember 
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400' 
                            : 'bg-brand-50 text-brand-600 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-400'
                        }`}
                      >
                        {isMember ? 'Remove' : 'Add'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
