import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard } from 'lucide-react';

const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Redirect to dashboard if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-4 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-400/20 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[100px]" />

      <div className="w-full max-w-5xl flex rounded-2xl glass-card overflow-hidden shadow-2xl z-10">
        {/* Left Side - Brand/Image */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-brand-600 to-brand-800 p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <LayoutDashboard size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold">TaskingBuddy</span>
          </div>

          <div className="relative z-10 mt-20">
            <h1 className="text-4xl font-bold leading-tight mb-6">
              Manage your team's work in one place
            </h1>
            <p className="text-brand-100 text-lg leading-relaxed mb-8">
              Collaborate seamlessly, track progress effortlessly, and deliver projects on time with our modern task management platform.
            </p>

            <div className="flex gap-4">
              <div className="flex -space-x-4">
                <div className="w-10 h-10 rounded-full border-2 border-brand-600 bg-emerald-400"></div>
                <div className="w-10 h-10 rounded-full border-2 border-brand-600 bg-blue-400"></div>
                <div className="w-10 h-10 rounded-full border-2 border-brand-600 bg-purple-400"></div>
                <div className="w-10 h-10 rounded-full border-2 border-brand-600 bg-white/20 flex items-center justify-center text-xs font-bold backdrop-blur-md">
                  +1k
                </div>
              </div>
              <p className="text-sm font-medium flex items-center text-brand-50">
                Join 1,000+ teams already using TaskingBuddy
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form Container */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 bg-white dark:bg-slate-900 flex flex-col justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
