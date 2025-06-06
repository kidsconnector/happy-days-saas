import React, { useState } from 'react';
import StatsCard from '../../components/dashboard/stats-card';
import UpcomingBirthdays from '../../components/dashboard/upcoming-birthdays';
import RecentCampaigns from '../../components/dashboard/recent-campaigns';
import CampaignStats from '../../components/dashboard/campaign-stats';
import { Users, Mail, Gift, CalendarCheck } from 'lucide-react';
import AddChildModal from '../../components/children/add-child-modal';
import CreateCampaignModal from '../../components/campaigns/create-campaign-modal';
import ScheduleEventModal from '../../components/events/schedule-event-modal';

const DashboardPage: React.FC = () => {
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [isScheduleEventOpen, setIsScheduleEventOpen] = useState(false);

  const handleChildAdded = () => {
    // Refresh data if needed
  };

  const handleCampaignCreated = () => {
    // Refresh data if needed
  };

  const handleEventScheduled = () => {
    // Refresh data if needed
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Children"
          value="124"
          trend="up"
          trendValue="12% from last month"
          icon={<Users className="h-6 w-6 text-indigo-600" />}
        />
        <StatsCard
          title="Campaigns Sent"
          value="38"
          description="Last 30 days"
          icon={<Mail className="h-6 w-6 text-sky-600" />}
        />
        <StatsCard
          title="Upcoming Birthdays"
          value="15"
          description="Next 30 days"
          icon={<Gift className="h-6 w-6 text-pink-600" />}
        />
        <StatsCard
          title="Scheduled Events"
          value="4"
          trend="up"
          trendValue="2 more than last month"
          icon={<CalendarCheck className="h-6 w-6 text-emerald-600" />}
        />
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <CampaignStats />
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsAddChildOpen(true)}
              >
                <Users className="h-6 w-6 text-indigo-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Add Child</span>
              </button>
              <button 
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsCreateCampaignOpen(true)}
              >
                <Mail className="h-6 w-6 text-indigo-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Create Campaign</span>
              </button>
              <button 
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setIsScheduleEventOpen(true)}
              >
                <CalendarCheck className="h-6 w-6 text-indigo-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Schedule Event</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <UpcomingBirthdays />
          <RecentCampaigns />
        </div>
      </div>

      {/* Modals */}
      <AddChildModal
        isOpen={isAddChildOpen}
        onClose={() => setIsAddChildOpen(false)}
        onSuccess={handleChildAdded}
      />
      
      <CreateCampaignModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        onSuccess={handleCampaignCreated}
      />
      
      <ScheduleEventModal
        isOpen={isScheduleEventOpen}
        onClose={() => setIsScheduleEventOpen(false)}
        onSuccess={handleEventScheduled}
      />
    </div>
  );
};

export default DashboardPage;