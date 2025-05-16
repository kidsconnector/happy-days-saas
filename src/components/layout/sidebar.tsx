import React, { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { useUIStore, useAuthStore } from '../../lib/store';
import SidebarNav from './sidebar-nav';
import { cn } from '../../lib/utils';
import { PartyPopper, Sparkles } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { tenant } = useAuthStore();
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={React.Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={React.Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <X className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                
                <div className="flex grow flex-col overflow-y-auto bg-indigo-600 px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <div className="flex items-center gap-2 py-4">
                      <PartyPopper className="h-8 w-8 text-indigo-200" />
                      <span className="text-xl font-bold text-white">KiddoConnect</span>
                    </div>
                  </div>
                  <div className="mt-2 mb-6">
                    {tenant && (
                      <div className="flex flex-col">
                        <span className="text-xs text-indigo-200">Current Business</span>
                        <span className="text-sm font-medium text-white flex items-center">
                          {tenant.businessName}
                          <Sparkles className="ml-1 h-3 w-3 text-amber-300" />
                        </span>
                      </div>
                    )}
                  </div>
                  <SidebarNav />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col overflow-y-auto bg-indigo-600 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center gap-2 py-4">
              <PartyPopper className="h-8 w-8 text-indigo-200" />
              <span className="text-xl font-bold text-white">KiddoConnect</span>
            </div>
          </div>
          <div className="mt-2 mb-6">
            {tenant && (
              <div className="flex flex-col">
                <span className="text-xs text-indigo-200">Current Business</span>
                <span className="text-sm font-medium text-white flex items-center">
                  {tenant.businessName}
                  <Sparkles className="ml-1 h-3 w-3 text-amber-300" />
                </span>
              </div>
            )}
          </div>
          <SidebarNav />
        </div>
      </div>
    </>
  );
};

export default Sidebar;