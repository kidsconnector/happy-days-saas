import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  ChevronDown, 
  Calendar,
  Mail,
  Tag,
  MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { calculateAge, formatDate } from '../../lib/utils';

// Mock data - in a real app, this would come from an API
const MOCK_CHILDREN = [
  {
    id: '1',
    name: 'Emma Thompson',
    birthdate: '2018-06-28',
    parentName: 'Sarah Thompson',
    email: 'sarah.thompson@example.com',
    phone: '+1 (555) 123-4567',
    tags: ['Summer Camp', 'Art Class'],
    createdAt: '2023-01-15T09:24:00Z',
  },
  {
    id: '2',
    name: 'Noah Garcia',
    birthdate: '2017-07-04',
    parentName: 'Miguel Garcia',
    email: 'miguel.garcia@example.com',
    phone: '+1 (555) 987-6543',
    tags: ['Swimming', 'Birthday Party'],
    createdAt: '2023-02-10T14:30:00Z',
  },
  {
    id: '3',
    name: 'Sophia Chen',
    birthdate: '2019-07-08',
    parentName: 'Mei Chen',
    email: 'mei.chen@example.com',
    phone: '+1 (555) 456-7890',
    tags: ['Daycare', 'Summer Camp'],
    createdAt: '2023-01-20T11:15:00Z',
  },
  {
    id: '4',
    name: 'Liam Johnson',
    birthdate: '2020-07-15',
    parentName: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '+1 (555) 789-0123',
    tags: ['New Customer', 'Daycare'],
    createdAt: '2023-03-05T16:45:00Z',
  },
  {
    id: '5',
    name: 'Olivia Williams',
    birthdate: '2019-03-12',
    parentName: 'Jennifer Williams',
    email: 'jennifer.williams@example.com',
    phone: '+1 (555) 234-5678',
    tags: ['Art Class', 'Referred'],
    createdAt: '2023-02-28T10:20:00Z',
  },
  {
    id: '6',
    name: 'Mason Brown',
    birthdate: '2018-11-28',
    parentName: 'David Brown',
    email: 'david.brown@example.com',
    phone: '+1 (555) 876-5432',
    tags: ['Birthday Party', 'Swimming'],
    createdAt: '2023-01-05T13:10:00Z',
  },
];

const ChildrenPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewType, setViewType] = useState<'table' | 'cards'>('table');
  
  // Get all unique tags from children data
  const allTags = Array.from(
    new Set(MOCK_CHILDREN.flatMap(child => child.tags))
  ).sort();
  
  // Filter children based on search term and selected tags
  const filteredChildren = MOCK_CHILDREN.filter(child => {
    const matchesSearch = 
      searchTerm === '' || 
      child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.some(tag => child.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Children Records</h1>
        <div className="flex items-center gap-3">
          <Link to="/children/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Add Child
            </Button>
          </Link>
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Export
          </Button>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <Input
            placeholder="Search children or parents..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<Search className="h-4 w-4" />}
            fullWidth
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Button 
              variant="outline" 
              leftIcon={<Filter className="h-4 w-4" />}
              rightIcon={<ChevronDown className="h-4 w-4" />}
            >
              Filter
            </Button>
            {/* Filter dropdown would go here */}
          </div>
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button 
              className={`px-3 py-2 text-sm ${viewType === 'table' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-600'}`}
              onClick={() => setViewType('table')}
            >
              Table
            </button>
            <button 
              className={`px-3 py-2 text-sm ${viewType === 'cards' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-600'}`}
              onClick={() => setViewType('cards')}
            >
              Cards
            </button>
          </div>
        </div>
      </div>
      
      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                selectedTags.includes(tag)
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
      
      {/* Children list */}
      {filteredChildren.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-1">No children found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          <Link to="/children/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Add Child
            </Button>
          </Link>
        </div>
      ) : viewType === 'table' ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Birthdate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredChildren.map((child) => (
                  <tr key={child.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{child.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{child.parentName}</div>
                      <div className="text-sm text-gray-500">{child.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(child.birthdate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{calculateAge(child.birthdate)} years</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {child.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                        Edit
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChildren.map((child) => (
            <Card key={child.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{child.name}</h3>
                      <p className="text-sm text-gray-500">
                        Parent: {child.parentName}
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        Born {formatDate(child.birthdate)} ({calculateAge(child.birthdate)} years old)
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{child.email}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-1">
                    {child.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex justify-between">
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    Edit
                  </button>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    Send Campaign
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChildrenPage;