import React from 'react';
import { PartyPopper, Sparkles } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="relative">
            <PartyPopper className="h-12 w-12 text-indigo-600" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-400" />
          </div>
        </div>
        <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
          KiddoConnect
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Event marketing for family-oriented businesses
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;