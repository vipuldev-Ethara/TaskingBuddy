import React, { useState, useEffect } from 'react';
import { getUsers, removeUser, inviteUser } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Users, Mail, Phone, Shield, User as UserIcon, Trash2, UserPlus, X, Loader2 } from 'lucide-react';

const TeamCard = ({ member, isAdmin, onRemove }) => {
  return (
    <div className="glass-card p-6 flex flex-col items-center text-center">
      <div className="relative mb-4">
        <div className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-2xl font-bold text-brand-700 dark:text-brand-300 shadow-md overflow-hidden">
          {member.avatar ? (
            <img src={member.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            member.first_name?.[0] || 'U'
          )}
        </div>
        <div className="absolute bottom-0 right-0 p-1 bg-white dark:bg-slate-800 rounded-full shadow-sm">
          {member.role === 'admin' ? (
            <Shield size={14} className="text-brand-500" />
          ) : (
            <UserIcon size={14} className="text-slate-400" />
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
        {member.first_name} {member.last_name}
      </h3>
      <p className="text-sm font-medium text-brand-600 dark:text-brand-400 mb-4 capitalize">
        {member.role}
      </p>
      
      {member.bio && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2">
          {member.bio}
        </p>
      )}
      
      <div className="w-full space-y-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Mail size={14} className="text-slate-400" />
          <a href={`mailto:${member.email}`} className="hover:text-brand-500 transition-colors truncate">
            {member.email}
          </a>
        </div>
        {member.phone && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Phone size={14} className="text-slate-400" />
            <span>{member.phone}</span>
          </div>
        )}
      </div>

      {isAdmin && (
        <button 
          onClick={() => onRemove(member.id)}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
          Remove Member
        </button>
      )}
    </div>
  );
};

const TeamPage = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: '',
    role: 'member'
  });

  const fetchTeam = async () => {
    try {
      const data = await getUsers();
      setTeam(data.results || data);
    } catch (error) {
      console.error("Failed to fetch team", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await removeUser(id);
      showToast('Member removed successfully', 'success');
      setTeam(team.filter(m => m.id !== id));
    } catch (error) {
      showToast('Failed to remove member', 'error');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await inviteUser(formData);
      showToast('Member added successfully', 'success');
      setIsAddModalOpen(false);
      setFormData({ first_name: '', last_name: '', email: '', password: '', password_confirm: '', role: 'member' });
      fetchTeam();
    } catch (error) {
      const data = error.response?.data;
      const msg = data?.email?.[0] || data?.error || data?.password?.[0] || 'Failed to add member. Please check all fields.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="text-brand-500" />
            Team Members
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Meet the people you work with.</p>
        </div>
        
        {user?.role === 'admin' && (
          <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary flex items-center gap-2">
            <UserPlus size={18} />
            Add Member
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {team.map(member => (
            <TeamCard 
              key={member.id} 
              member={member} 
              isAdmin={user?.role === 'admin'}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Member</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddMember} className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                  <input type="text" required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                  <input type="text" required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="input-field" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-field" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                <input type="password" required value={formData.password_confirm} onChange={e => setFormData({...formData, password_confirm: e.target.value})} className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="input-field">
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary flex-1">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
