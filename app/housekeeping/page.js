'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Table from '@/components/Table';

// Mock data for housekeeping
const housekeepingData = {
  overview: {
    totalStaff: 45,
    activeStaff: 42,
    tasksToday: 125,
    completedTasks: 98,
    avgCleaningTime: '42 mins',
    satisfaction: 4.8
  },
  staff: [
    {
      id: 'hk-1',
      name: 'Alex Johnson',
      property: 'Luxury Hotel Downtown',
      currentTask: 'Room 301 Cleaning',
      tasksCompleted: 8,
      efficiency: 98,
      status: 'active'
    },
    {
      id: 'hk-2',
      name: 'Jamie Smith',
      property: 'Resort & Spa',
      currentTask: 'Restocking Supplies',
      tasksCompleted: 6,
      efficiency: 95,
      status: 'active'
    },
    {
      id: 'hk-3',
      name: 'Taylor Brown',
      property: 'Business Hotel Central',
      currentTask: 'Deep Cleaning Room 105',
      tasksCompleted: 7,
      efficiency: 94,
      status: 'break'
    }
  ],
  tasks: [
    {
      id: 1,
      room: '301',
      type: 'Regular Cleaning',
      status: 'in-progress',
      assignedTo: 'Alex Johnson',
      property: 'Luxury Hotel Downtown',
      priority: 'high'
    },
    {
      id: 2,
      room: 'Storage',
      type: 'Restocking',
      status: 'in-progress',
      assignedTo: 'Jamie Smith',
      property: 'Resort & Spa',
      priority: 'medium'
    },
    {
      id: 3,
      room: '105',
      type: 'Deep Cleaning',
      status: 'pending',
      assignedTo: 'Taylor Brown',
      property: 'Business Hotel Central',
      priority: 'high'
    }
  ]
};

export default function HousekeepingDashboard() {
  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      break: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      pending: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const staffColumns = [
    {
      key: 'name',
      label: 'Staff Member'
    },
    {
      key: 'property',
      label: 'Property'
    },
    {
      key: 'currentTask',
      label: 'Current Task'
    },
    {
      key: 'tasksCompleted',
      label: 'Tasks Done'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => getStatusBadge(value)
    }
  ];

  const taskColumns = [
    {
      key: 'room',
      label: 'Room/Area'
    },
    {
      key: 'type',
      label: 'Task Type'
    },
    {
      key: 'assignedTo',
      label: 'Assigned To'
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (value) => getPriorityBadge(value)
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => getStatusBadge(value)
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Housekeeping Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card 
          title="Staff on Duty" 
          value={housekeepingData.overview.activeStaff}
          subtitle={`of ${housekeepingData.overview.totalStaff} Total Staff`}
        />
        <Card 
          title="Tasks Today" 
          value={housekeepingData.overview.tasksToday}
          subtitle={`${housekeepingData.overview.completedTasks} Completed`}
        />
        <Card 
          title="Avg Cleaning Time" 
          value={housekeepingData.overview.avgCleaningTime}
          subtitle="Per Room"
        />
      </div>

      <div className="bg-[#101828] rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Staff Overview</h2>
        <Table 
          data={housekeepingData.staff}
          columns={staffColumns}
        />
      </div>

      <div className="bg-[#101828] rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Active Tasks</h2>
        <Table 
          data={housekeepingData.tasks}
          columns={taskColumns}
        />
      </div>
    </div>
  );
}