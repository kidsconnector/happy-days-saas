import React from 'react';
import LoginForm from '../../components/auth/login-form';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            start your 14-day free trial
          </Link>
        </p>
      </div>
      
      <LoginForm />
      
      <div className="mt-6">
        <div className="text-center">
          <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;