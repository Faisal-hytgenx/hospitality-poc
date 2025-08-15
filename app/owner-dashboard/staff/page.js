'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/Card';
import Table from '@/components/Table';

import { mockStaff, mockProperties } from '@/data/mockData';

export default function StaffOverview() {
  const { user } = useAuth();
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    // Combine all staff and filter by owner's properties
    const allStaff = [
      ...mockStaff.housekeeping.map(s => ({ ...s, department: 'housekeeping' })),
      ...mockStaff.maintenance.map(s => ({ ...s, department: 'maintenance' }))
    ].filter(staff => user?.properties?.includes(staff.property));

    setStaffMembers(allStaff);
  }, [user]);

  const filteredStaff = selectedDepartment === 'all' 
    ? staffMembers 
    : staffMembers.filter(staff => staff.department === selectedDepartment);

  const getStatusBadge = (available) => {
    const styles = {
      true: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      false: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[available]}`}>
        {available ? 'Available' : 'Busy'}
      </span>
    );
  };

  const getDepartmentBadge = (department) => {
    const styles = {
      housekeeping: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      maintenance: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[department]}`}>
        {department.charAt(0).toUpperCase() + department.slice(1)}
      </span>
    );
  };

  const getRatingBadge = (rating) => {
    return (
      <div className="flex items-center">
        <span className="text-yellow-500 mr-1">★</span>
        <span>{rating.toFixed(1)}</span>
      </div>
    );
  };

  const columns = [
    { 
      key: 'name',
      label: 'Name'
    },
    { 
      key: 'department',
      label: 'Department',
      render: (value) => getDepartmentBadge(value)
    },
    {
      key: 'currentLocation',
      label: 'Location'
    },
    {
      key: 'currentTask',
      label: 'Current Task'
    },
    {
      key: 'schedule',
      label: 'Schedule'
    },
    {
      key: 'tasksCompleted',
      label: 'Tasks Done'
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (value) => getRatingBadge(value)
    },
    { 
      key: 'available',
      label: 'Status',
      render: (value) => getStatusBadge(value)
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Overview</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedDepartment('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedDepartment === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Staff
          </button>
          <button
            onClick={() => setSelectedDepartment('housekeeping')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedDepartment === 'housekeeping'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Housekeeping
          </button>
          <button
            onClick={() => setSelectedDepartment('maintenance')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedDepartment === 'maintenance'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Maintenance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card 
          title="Total Staff" 
          value={staffMembers.length} 
        />
        <Card 
          title="Available Now" 
          value={staffMembers.filter(s => s.available).length}
        />
        <Card 
          title="Total Tasks Done" 
          value={staffMembers.reduce((sum, staff) => sum + staff.tasksCompleted, 0)}
        />
        <Card 
          title="Avg Rating" 
          value={`${(staffMembers.reduce((sum, staff) => sum + staff.rating, 0) / staffMembers.length).toFixed(1)} ★`}
        />
      </div>

      <div className="bg-[#101828] rounded-lg shadow p-6">
        <Table 
          data={filteredStaff}
          columns={columns}
        />
      </div>
    </div>
  );
}
