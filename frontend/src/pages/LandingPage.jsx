import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Users, BarChart3, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white transition-colors duration-200">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-brand-500 p-2 rounded-lg text-white">
            <LayoutDashboard size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">TaskingBuddy</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-brand-500 transition-colors">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Manage your team's work in <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-600">one place</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Collaborate seamlessly, track progress effortlessly, and deliver projects on time with our modern task management platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn btn-primary text-lg px-8 py-4">
              Start for free <ArrowRight className="ml-2" size={20} />
            </Link>
            <a href="#features" className="btn btn-secondary text-lg px-8 py-4">
              See how it works
            </a>
          </div>
        </div>
        
        {/* Abstract Dashboard Preview */}
        <div className="mt-20 max-w-5xl mx-auto rounded-xl glass-card overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-700/50 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-dark-bg via-transparent to-transparent z-10 top-1/2"></div>
          <img 
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Dashboard Preview" 
            className="w-full h-auto object-cover opacity-90 dark:opacity-70"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white dark:bg-slate-900 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to manage projects</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our platform provides all the tools your team needs to stay organized, focused, and productive.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <CheckSquare size={32} className="text-brand-500" />,
                title: 'Task Tracking',
                description: 'Create, assign, and track tasks from start to finish with customizable statuses and priorities.'
              },
              {
                icon: <Users size={32} className="text-blue-500" />,
                title: 'Team Collaboration',
                description: 'Work together seamlessly with built-in team management, roles, and real-time updates.'
              },
              {
                icon: <BarChart3 size={32} className="text-purple-500" />,
                title: 'Insightful Analytics',
                description: 'Make data-driven decisions with real-time dashboard analytics and productivity metrics.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:-translate-y-2 transition-transform duration-300">
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-dark-bg py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard size={20} className="text-brand-500" />
            <span className="font-bold">TaskingBuddy</span>
          </div>
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} TaskingBuddy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
