import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { User, Mail, Phone, FileText, Camera, Shield, Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        bio: formData.bio
      });
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    
    setIsChangingPassword(true);
    try {
      await changePassword({
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword
      });
      showToast('Password changed successfully', 'success');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      let msg = 'Failed to change password';
      if (error.response?.data?.old_password) msg = error.response.data.old_password[0];
      showToast(msg, 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-6 flex flex-col items-center text-center">
            <div className="relative mb-4 group cursor-pointer">
              <div className="w-32 h-32 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-4xl font-bold text-brand-600 dark:text-brand-400 overflow-hidden ring-4 ring-white dark:ring-slate-800 shadow-lg">
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.first_name?.[0] || 'U'
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {user?.first_name} {user?.last_name}
            </h2>
            <div className="flex items-center gap-1.5 mt-1 text-brand-600 dark:text-brand-400 font-medium bg-brand-50 dark:bg-brand-500/10 px-3 py-1 rounded-full text-sm">
              <Shield size={14} />
              <span className="capitalize">{user?.role}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 flex items-center gap-2 justify-center w-full truncate">
              <Mail size={14} /> {user?.email}
            </p>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-2">
              Personal Information
            </h3>
            
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input-field pl-9" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input-field pl-9" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field pl-9" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-slate-400" size={16} />
                  <textarea name="bio" value={formData.bio} onChange={handleChange} className="input-field pl-9 h-24 py-2 resize-none" placeholder="Write a short bio about yourself..." />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isUpdating} className="btn btn-primary min-w-[120px]">
                  {isUpdating ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          <div className="glass-card p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-2">
              Security
            </h3>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                <input type="password" required name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} className="input-field" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                  <input type="password" required name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                  <input type="password" required name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="input-field" />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isChangingPassword} className="btn btn-secondary min-w-[140px]">
                  {isChangingPassword ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
