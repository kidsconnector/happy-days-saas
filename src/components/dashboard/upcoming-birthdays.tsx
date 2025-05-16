import React from 'react';
import { Gift, CalendarClock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatDate, calculateAge } from '../../lib/utils';

// Mock data - in a real app, this would come from an API
const MOCK_UPCOMING_BIRTHDAYS = [
  {
    id: '1',
    name: 'Emma Thompson',
    birthdate: '2018-06-28',
    daysUntil: 12,
    parentName: 'Sarah Thompson',
    email: 'sarah.thompson@example.com',
  },
  {
    id: '2',
    name: 'Noah Garcia',
    birthdate: '2017-07-04',
    daysUntil: 18,
    parentName: 'Miguel Garcia',
    email: 'miguel.garcia@example.com',
  },
  {
    id: '3',
    name: 'Sophia Chen',
    birthdate: '2019-07-08',
    daysUntil: 22,
    parentName: 'Mei Chen',
    email: 'mei.chen@example.com',
  },
  {
    id: '4',
    name: 'Liam Johnson',
    birthdate: '2020-07-15',
    daysUntil: 29,
    parentName: 'Robert Johnson',
    email: 'robert.johnson@example.com',
  },
];

const UpcomingBirthdays: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5 text-indigo-500" />
          <span>Upcoming Birthdays</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {MOCK_UPCOMING_BIRTHDAYS.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No upcoming birthdays in the next 30 days.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {MOCK_UPCOMING_BIRTHDAYS.map((child) => (
              <div key={child.id} className="py-3 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{child.name}</p>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <span className="truncate">
                      Turning {calculateAge(child.birthdate) + 1} on {formatDate(child.birthdate, 'MMMM d')}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 truncate">
                    Parent: {child.parentName}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                    <CalendarClock className="mr-1 h-3 w-3" />
                    In {child.daysUntil} days
                  </div>
                  <button 
                    className="mt-1 text-xs text-indigo-600 hover:text-indigo-900"
                  >
                    Send now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <button className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">
            View all birthdays →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingBirthdays;