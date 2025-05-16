import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart3 } from 'lucide-react';

// Mock data - in a real app, this would come from an API
const MOCK_CAMPAIGN_DATA = [
  {
    name: 'Jan',
    sent: 45,
    opened: 30,
    clicked: 15,
  },
  {
    name: 'Feb',
    sent: 50,
    opened: 35,
    clicked: 20,
  },
  {
    name: 'Mar',
    sent: 60,
    opened: 45,
    clicked: 25,
  },
  {
    name: 'Apr',
    sent: 70,
    opened: 50,
    clicked: 30,
  },
  {
    name: 'May',
    sent: 65,
    opened: 45,
    clicked: 22,
  },
  {
    name: 'Jun',
    sent: 80,
    opened: 60,
    clicked: 35,
  },
];

const CampaignStats: React.FC = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-indigo-500" />
          <span>Campaign Performance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={MOCK_CAMPAIGN_DATA}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sent" name="Emails Sent" fill="#6366F1" />
              <Bar dataKey="opened" name="Emails Opened" fill="#22D3EE" />
              <Bar dataKey="clicked" name="Links Clicked" fill="#EC4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignStats;