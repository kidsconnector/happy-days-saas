import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';
import Sidebar from './sidebar';
import { useLocation } from 'react-router-dom';

interface PageTitleMap {
  [key: string]: string;
}

const pageTitles: PageTitleMap = {
  '/dashboard': 'Dashboard',
  '/children': 'Children Records',
  '/children/new': 'Add New Child',
  '/events': 'Events',
  '/events/new': 'Create New Event',
  '/campaigns': 'Marketing Campaigns',
  '/campaigns/new': 'Create New Campaign',
  '/templates': 'Email Templates',
  '/templates/new': 'Create New Template',
  '/templates/edit': 'Edit Template',
  '/coupons': 'Coupon Management',
  '/analytics': 'Analytics & Reports',
  '/api': 'API Access',
  '/settings': 'Business Settings',
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  
  // Get the current page title based on the path
  const getPageTitle = () => {
    const path = location.pathname;
    
    // Exact match
    if (pageTitles[path]) {
      return pageTitles[path];
    }
    
    // Check for dynamic routes (e.g., /children/edit/123)
    if (path.startsWith('/children/edit/')) {
      return 'Edit Child Record';
    }
    
    if (path.startsWith('/templates/edit/')) {
      return 'Edit Email Template';
    }
    
    // Default title
    return 'Dashboard';
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="lg:pl-72">
        <Header title={getPageTitle()} />
        
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;