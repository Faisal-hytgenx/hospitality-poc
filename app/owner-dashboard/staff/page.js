'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/Card';
import Table from '@/components/Table';

import { mockStaff } from '@/data/mockData';

export default function StaffOverview() {
  const { user } = useAuth();
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Demo fallback data shown if no staff found
  const demoStaff = [
    { id: 'hk-dem-1', name: 'Alex Johnson', department: 'housekeeping', propertyName: 'Luxury Hotel Downtown', currentLocation: 'Floor 3', currentTask: 'Room 301 Cleaning', schedule: '9AM - 5PM', tasksCompleted: 145, rating: 4.8, available: true },
    { id: 'hk-dem-2', name: 'Jamie Smith', department: 'housekeeping', propertyName: 'Resort & Spa', currentLocation: 'Storage', currentTask: 'Restocking Supplies', schedule: '8AM - 4PM', tasksCompleted: 132, rating: 4.9, available: true },
    { id: 'hk-dem-3', name: 'Taylor Brown', department: 'housekeeping', propertyName: 'Luxury Hotel Downtown', currentLocation: 'Floor 1', currentTask: 'Deep Cleaning Room 105', schedule: '10AM - 6PM', tasksCompleted: 128, rating: 4.7, available: false },
    { id: 'mt-dem-1', name: 'Riley Wilson', department: 'maintenance', propertyName: 'Resort & Spa', currentLocation: 'Basement', currentTask: 'AC Maintenance', schedule: '7AM - 3PM', tasksCompleted: 89, rating: 4.9, available: true },
    { id: 'mt-dem-2', name: 'Sam Davis', department: 'maintenance', propertyName: 'Luxury Hotel Downtown', currentLocation: 'Floor 4', currentTask: 'Fixing Shower in 402', schedule: '9AM - 5PM', tasksCompleted: 93, rating: 4.8, available: false },
    { id: 'mt-dem-3', name: 'Jordan Lee', department: 'maintenance', propertyName: 'Holiday Inn San Antonio Stone Oak Area', currentLocation: 'Lobby', currentTask: 'Electrical Inspection', schedule: '11AM - 7PM', tasksCompleted: 76, rating: 4.6, available: true }
  ];

  useEffect(() => {
    // Combine all staff. If owner properties exist, filter by them; otherwise show all for demo
    const combined = [
      ...mockStaff.housekeeping.map(s => ({ ...s, department: 'housekeeping' })),
      ...mockStaff.maintenance.map(s => ({ ...s, department: 'maintenance' }))
    ];

    const ownerProps = Array.isArray(user?.properties) ? user.properties : null;
    const filtered = ownerProps && ownerProps.length ? combined.filter(staff => ownerProps.includes(staff.property)) : combined;

    // Normalize property display name
    const normalized = filtered.map(s => ({
      ...s,
      propertyName: s.propertyName || s.property
    }));

    setStaffMembers(normalized);
  }, [user]);

  const filteredStaff = selectedDepartment === 'all' 
    ? staffMembers 
    : staffMembers.filter(staff => staff.department === selectedDepartment);

  // Always have something to show for demo
  const effectiveStaff = (filteredStaff.length ? filteredStaff : (staffMembers.length ? staffMembers : demoStaff));

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
    const safe = typeof rating === 'number' && !isNaN(rating) ? rating : 0;
    return (
      <div className="flex items-center">
        <span className="text-yellow-500 mr-1">★</span>
        <span>{safe.toFixed(1)}</span>
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
      key: 'propertyName',
      label: 'Property'
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

  const total = effectiveStaff.length || 0;
  const totalTasksDone = effectiveStaff.reduce((sum, staff) => sum + (staff.tasksCompleted || 0), 0);
  const avgRating = total ? (effectiveStaff.reduce((sum, staff) => sum + (staff.rating || 0), 0) / total).toFixed(1) : '4.8';
  const availableNow = effectiveStaff.filter(s => s.available).length;

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
          value={total} 
        />
        <Card 
          title="Available Now" 
          value={availableNow}
        />
        <Card 
          title="Total Tasks Done" 
          value={totalTasksDone}
        />
        <Card 
          title="Avg Rating" 
          value={`${avgRating} ★`}
        />
      </div>

      <div className="bg-[#101828] rounded-lg shadow p-6">
        <Table 
          data={effectiveStaff}
          columns={columns}
        />
      </div>
    </div>
  );
}