import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="relative">
        <h1 className="text-9xl font-black text-slate-200 dark:text-slate-800 tracking-tighter">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">Page Not Found</span>
        </div>
      </div>
      
      <p className="text-slate-500 dark:text-slate-400 mt-6 max-w-md mx-auto">
        The page you are looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      
      <Link to="/" className="btn btn-primary mt-8 inline-flex items-center gap-2">
        <ArrowLeft size={18} />
        Go back home
      </Link>
    </div>
  );
};

export default NotFoundPage;
