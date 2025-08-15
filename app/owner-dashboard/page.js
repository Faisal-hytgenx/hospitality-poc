'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Table from '@/components/Table';

// Mock staff data with performance metrics
const mockStaff = {
  housekeeping: [
    { 
      id: 'hk-1', 
      name: 'Alex Johnson', 
      skills: ['Room Cleaning', 'Deep Clean', 'Laundry'],
      available: true, 
      property: 'Luxury Hotel Downtown',
      tasksCompleted: 145,
      rating: 4.8,
      efficiency: 98,
      attendance: 100,
      currentTask: 'Room 301 Cleaning'
    },
    { 
      id: 'hk-2', 
      name: 'Jamie Smith', 
      skills: ['Deep Clean', 'Inventory'],
      available: true, 
      property: 'Resort & Spa',
      tasksCompleted: 132,
      rating: 4.9,
      efficiency: 95,
      attendance: 98,
      currentTask: 'Restocking Supplies'
    },
    { 
      id: 'hk-3', 
      name: 'Taylor Brown', 
      skills: ['Room Cleaning', 'Maintenance'],
      available: false, 
      property: 'Luxury Hotel Downtown',
      tasksCompleted: 128,
      rating: 4.7,
      efficiency: 94,
      attendance: 97,
      currentTask: 'Deep Cleaning Room 105'
    }
  ],
  maintenance: [
    { 
      id: 'mt-1', 
      name: 'Riley Wilson', 
      skills: ['HVAC', 'Electrical'],
      available: true, 
      property: 'Resort & Spa',
      tasksCompleted: 89,
      rating: 4.9,
      efficiency: 97,
      attendance: 100,
      currentTask: 'AC Maintenance'
    },
    { 
      id: 'mt-2', 
      name: 'Sam Davis', 
      skills: ['Plumbing', 'General Repairs'],
      available: false, 
      property: 'Luxury Hotel Downtown',
      tasksCompleted: 93,
      rating: 4.8,
      efficiency: 96,
      attendance: 99,
      currentTask: 'Fixing Shower in 402'
    }
  ]
};

// Mock property metrics
const mockMetrics = {
  'Luxury Hotel Downtown': {
    revenue: '$124,500',
    occupancyRate: '87%',
    guestSatisfaction: 4.8,
    taskCompletion: '96%',
    staffing: {
      total: 25,
      active: 22,
      departments: {
        housekeeping: 15,
        maintenance: 10
      }
    },
    tasks: {
      total: 45,
      completed: 42,
      pending: 3
    }
  },
  'Resort & Spa': {
    revenue: '$156,800',
    occupancyRate: '92%',
    guestSatisfaction: 4.9,
    taskCompletion: '98%',
    staffing: {
      total: 35,
      active: 32,
      departments: {
        housekeeping: 20,
        maintenance: 15
      }
    },
    tasks: {
      total: 60,
      completed: 57,
      pending: 3
    }
  }
};

export default function OwnerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [staffMembers, setStaffMembers] = useState([]);
  const [propertyMetrics, setPropertyMetrics] = useState(null);

  useEffect(() => {
    // Combine all staff and filter by owner's properties
    const allStaff = [
      ...mockStaff.housekeeping.map(s => ({ ...s, department: 'housekeeping' })),
      ...mockStaff.maintenance.map(s => ({ ...s, department: 'maintenance' }))
    ];

    setStaffMembers(allStaff);

    // Get metrics for first property (for demo)
    setPropertyMetrics(mockMetrics['Luxury Hotel Downtown']);
  }, [user]);

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

  const getEfficiencyIndicator = (value) => {
    const color = value >= 95 ? 'text-green-500' : value >= 90 ? 'text-yellow-500' : 'text-red-500';
    return <span className={color}>{value}%</span>;
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
      key: 'currentTask',
      label: 'Current Task'
    },
    { 
      key: 'efficiency',
      label: 'Efficiency',
      render: (value) => getEfficiencyIndicator(value)
    },
    { 
      key: 'available',
      label: 'Status',
      render: (value) => getStatusBadge(value)
    }
  ];

  const activeStaff = staffMembers.filter(s => s.available).length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card 
          title="Monthly Revenue" 
          value={propertyMetrics?.revenue || '$0'}
          trend="+12.5%"
          trendUp={true}
          subtitle="vs Last Month"
        />
        <Card 
          title="Occupancy Rate" 
          value={propertyMetrics?.occupancyRate || '0%'}
          trend="+5.2%"
          trendUp={true}
          subtitle="Current Period"
        />
        <Card 
          title="Guest Satisfaction" 
          value={`${propertyMetrics?.guestSatisfaction || 0} ★`}
          trend="+0.3"
          trendUp={true}
          subtitle="Guest Rating"
        />
        <Card 
          title="Task Completion" 
          value={propertyMetrics?.taskCompletion || '0%'}
          trend="+3.8%"
          trendUp={true}
          subtitle="Service Tasks"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card 
          title="Total Staff" 
          value={staffMembers.length}
          subtitle={`${propertyMetrics?.staffing?.departments?.housekeeping || 0} Housekeeping, ${propertyMetrics?.staffing?.departments?.maintenance || 0} Maintenance`}
        />
        <Card 
          title="Available Now" 
          value={activeStaff}
          subtitle={`${((activeStaff/staffMembers.length) * 100).toFixed(0)}% of total`}
        />
        <Card 
          title="Tasks Today" 
          value={propertyMetrics?.tasks?.total || 0}
          subtitle={`${propertyMetrics?.tasks?.completed || 0} Completed`}
        />
        <Card 
          title="Pending Tasks" 
          value={propertyMetrics?.tasks?.pending || 0}
          subtitle="Need Attention"
        />
      </div>

      <div className="bg-[#101828] rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Staff Overview</h2>
        <Table 
          data={staffMembers}
          columns={columns}
        />
      </div>
    </div>
  );
}