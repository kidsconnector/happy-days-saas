import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Mail, 
  Settings, 
  BarChart3, 
  Code, 
  Gift,
  LogOut 
} from 'lucide-react';
import { useAuthStore, useUIStore } from '../../lib/store';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const { setSidebarOpen } = useUIStore();
  
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        'flex items-center gap-x-3 px-3 py-2 rounded-md text-sm font-medium',
        'transition-colors duration-200',
        isActive 
          ? 'bg-indigo-700 text-white' 
          : 'text-gray-200 hover:bg-indigo-800 hover:text-white'
      )}
      onClick={() => setSidebarOpen(false)}
    >
      <span className="flex-shrink-0 w-5 h-5">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

interface SectionProps {
  label: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ label, children }) => {
  return (
    <div className="space-y-1">
      <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      {children}
    </div>
  );
};

const SidebarNav: React.FC = () => {
  const { logout } = useAuthStore();
  const { user } = useAuthStore();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="flex-1 space-y-6 px-2 py-4">
      <Section label="General">
        <NavItem to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <NavItem to="/children" icon={<Users size={18} />} label="Children" />
        <NavItem to="/events" icon={<Calendar size={18} />} label="Events" />
        <NavItem to="/campaigns" icon={<Mail size={18} />} label="Campaigns" />
      </Section>
      
      <Section label="Marketing">
        <NavItem to="/templates" icon={<Mail size={18} />} label="Email Templates" />
        {user?.role !== 'staff' && (
          <NavItem to="/coupons" icon={<Gift size={18} />} label="Coupons" />
        )}
        <NavItem to="/analytics" icon={<BarChart3 size={18} />} label="Analytics" />
      </Section>
      
      {user?.role !== 'staff' && (
        <Section label="Administration">
          <NavItem to="/api" icon={<Code size={18} />} label="API Access" />
          <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
        </Section>
      )}
      
      <div className="pt-8">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-indigo-800 hover:text-white transition-colors duration-200"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default SidebarNav;