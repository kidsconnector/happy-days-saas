import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bell, User, Menu as MenuIcon, Settings, LogOut, HelpCircle } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../lib/store';
import { cn } from '../../lib/utils';

const Header: React.FC<{ title?: string }> = ({ title = 'Dashboard' }) => {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      
      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />
      
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex-1 flex items-center">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-500 hover:text-gray-900"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>
          
          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                <User className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                  {user?.name || 'User'}
                </span>
              </span>
            </Menu.Button>
            
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#profile"
                      className={cn(
                        active ? 'bg-gray-50' : '',
                        'block px-3 py-2 text-sm leading-6 text-gray-900 flex items-center'
                      )}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Your profile
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#settings"
                      className={cn(
                        active ? 'bg-gray-50' : '',
                        'block px-3 py-2 text-sm leading-6 text-gray-900 flex items-center'
                      )}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#help"
                      className={cn(
                        active ? 'bg-gray-50' : '',
                        'block px-3 py-2 text-sm leading-6 text-gray-900 flex items-center'
                      )}
                    >
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help & Support
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => logout()}
                      className={cn(
                        active ? 'bg-gray-50' : '',
                        'block w-full text-left px-3 py-2 text-sm leading-6 text-gray-900 flex items-center'
                      )}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header;