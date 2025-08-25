'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Table from '@/components/Table';

// Mock data for maintenance
const maintenanceData = {
  overview: {
    totalStaff: 25,
    activeStaff: 22,
    openTickets: 45,
    resolvedToday: 28,
    avgResponseTime: '35 mins',
    satisfaction: 4.9
  },
  staff: [
    {
      id: 'mt-1',
      name: 'Riley Wilson',
      property: 'Holiday Inn San Antonio NW',
      currentTask: 'AC Maintenance',
      tasksCompleted: 5,
      efficiency: 97,
      status: 'active',
      specialty: 'HVAC'
    },
    {
      id: 'mt-2',
      name: 'Sam Davis',
      property: 'Hyatt Place San Antonio NW Medical Center',
      currentTask: 'Plumbing Repair Room 402',
      tasksCompleted: 4,
      efficiency: 96,
      status: 'active',
      specialty: 'Plumbing'
    },
    {
      id: 'mt-3',
      name: 'Jordan Lee',
      property: 'Holiday Inn San Antonio Stone Oak Area',
      currentTask: 'Electrical Inspection',
      tasksCompleted: 6,
      efficiency: 98,
      status: 'break',
      specialty: 'Electrical'
    }
  ],
  tickets: [
    {
      id: 1,
      location: 'Room 402',
      issue: 'Shower Leak',
      status: 'in-progress',
      assignedTo: 'Sam Davis',
      property: 'Hyatt Place San Antonio NW Medical Center',
      priority: 'high',
      type: 'Plumbing'
    },
    {
      id: 2,
      location: 'Floor 3',
      issue: 'AC Maintenance',
      status: 'in-progress',
      assignedTo: 'Riley Wilson',
      property: 'Holiday Inn San Antonio NW',
      priority: 'medium',
      type: 'HVAC'
    },
    {
      id: 3,
      location: 'Common Area',
      issue: 'Electrical Inspection',
      status: 'pending',
      assignedTo: 'Jordan Lee',
      property: 'Holiday Inn San Antonio Stone Oak Area',
      priority: 'medium',
      type: 'Electrical'
    }
  ]
};

export default function MaintenanceDashboard() {
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

  const getTypeBadge = (type) => {
    const styles = {
      'HVAC': 'bg-purple-100 text-purple-800',
      'Plumbing': 'bg-blue-100 text-blue-800',
      'Electrical': 'bg-orange-100 text-orange-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
        {type}
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
      key: 'specialty',
      label: 'Specialty',
      render: (value) => getTypeBadge(value)
    },
    {
      key: 'currentTask',
      label: 'Current Task'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => getStatusBadge(value)
    }
  ];

  const ticketColumns = [
    {
      key: 'location',
      label: 'Location'
    },
    {
      key: 'issue',
      label: 'Issue'
    },
    {
      key: 'property',
      label: 'Property'
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => getTypeBadge(value)
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
        <h1 className="text-2xl font-bold">Maintenance Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card 
          title="Active Staff" 
          value={maintenanceData.overview.activeStaff}
          subtitle={`of ${maintenanceData.overview.totalStaff} Total Staff`}
        />
        <Card 
          title="Open Tickets" 
          value={maintenanceData.overview.openTickets}
          subtitle={`${maintenanceData.overview.resolvedToday} Resolved Today`}
        />
        <Card 
          title="Response Time" 
          value={maintenanceData.overview.avgResponseTime}
          subtitle="Average Response"
        />
      </div>

      <div className="bg-[#101828] rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Maintenance Staff</h2>
        <Table 
          data={maintenanceData.staff}
          columns={staffColumns}
        />
      </div>

      <div className="bg-[#101828] rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Active Tickets</h2>
        <Table 
          data={maintenanceData.tickets}
          columns={ticketColumns}
        />
      </div>
    </div>
  );
}