import React from 'react';
import { Mail, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatRelativeTime } from '../../lib/utils';
import { cn } from '../../lib/utils';

// Mock data - in a real app, this would come from an API
const MOCK_RECENT_CAMPAIGNS = [
  {
    id: '1',
    title: 'June Birthday Reminders',
    sentAt: '2023-06-15T10:30:00Z',
    status: 'sent',
    recipients: 8,
    opened: 6,
    clicked: 4,
  },
  {
    id: '2',
    title: 'Summer Camp Promotion',
    sentAt: '2023-06-10T14:15:00Z',
    status: 'sent',
    recipients: 45,
    opened: 32,
    clicked: 18,
  },
  {
    id: '3',
    title: 'July Birthday Reminders',
    sentAt: null,
    status: 'scheduled',
    recipients: 12,
    opened: 0,
    clicked: 0,
    scheduledFor: '2023-06-25T09:00:00Z',
  },
  {
    id: '4',
    title: 'Easter Special Offer',
    sentAt: '2023-04-01T08:45:00Z',
    status: 'sent',
    recipients: 52,
    opened: 40,
    clicked: 22,
  },
];

const RecentCampaigns: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mail className="h-5 w-5 text-indigo-500" />
          <span>Recent Campaigns</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {MOCK_RECENT_CAMPAIGNS.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No campaigns found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {MOCK_RECENT_CAMPAIGNS.map((campaign) => (
              <div key={campaign.id} className="py-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{campaign.title}</p>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      {campaign.status === 'sent' ? (
                        <span>Sent {formatRelativeTime(campaign.sentAt!)}</span>
                      ) : (
                        <span>Scheduled for {formatRelativeTime(campaign.scheduledFor!)}</span>
                      )}
                    </div>
                  </div>
                  <div className="ml-2">
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                      campaign.status === 'sent' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                    )}>
                      {campaign.status === 'sent' ? (
                        <>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Sent
                        </>
                      ) : (
                        <>
                          <Clock className="mr-1 h-3 w-3" />
                          Scheduled
                        </>
                      )}
                    </span>
                  </div>
                </div>
                
                {campaign.status === 'sent' && (
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div className="text-gray-500">
                      <span className="font-medium text-gray-900">{campaign.recipients}</span> recipients
                    </div>
                    <div className="text-gray-500">
                      <span className="font-medium text-gray-900">{campaign.opened}</span> opened
                    </div>
                    <div className="text-gray-500">
                      <span className="font-medium text-gray-900">{campaign.clicked}</span> clicked
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <button className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">
            View all campaigns →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentCampaigns;