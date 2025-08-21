'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Table from '@/components/Table';

// Mock data for General Manager - Resort & Spa property
const gmData = {
  property: {
    id: 'property2',
    name: 'Resort & Spa',
    totalStaff: 35,
    activeStaff: 32,
    occupancy: '92%',
    revenue: '$156,800',
    efficiency: 98,
    tasks: { total: 60, completed: 57 }
  },
  employees: [
    {
      id: 'emp-1',
      name: 'Alex Johnson',
      department: 'housekeeping',
      position: 'Senior Housekeeper',
      status: 'active',
      tasksCompleted: 145,
      rating: 4.8,
      efficiency: 98,
      attendance: 100,
      currentTask: 'Room 301 Cleaning',
      skills: ['Room Cleaning', 'Deep Clean', 'Laundry'],
      phone: '+1 (555) 123-4567',
      email: 'alex.johnson@resort.com'
    },
    {
      id: 'emp-2',
      name: 'Jamie Smith',
      department: 'housekeeping',
      position: 'Housekeeper',
      status: 'active',
      tasksCompleted: 132,
      rating: 4.9,
      efficiency: 95,
      attendance: 98,
      currentTask: 'Restocking Supplies',
      skills: ['Deep Clean', 'Inventory'],
      phone: '+1 (555) 123-4568',
      email: 'jamie.smith@resort.com'
    },
    {
      id: 'emp-3',
      name: 'Taylor Brown',
      department: 'housekeeping',
      position: 'Housekeeper',
      status: 'busy',
      tasksCompleted: 128,
      rating: 4.7,
      efficiency: 94,
      attendance: 97,
      currentTask: 'Deep Cleaning Room 105',
      skills: ['Room Cleaning', 'Maintenance'],
      phone: '+1 (555) 123-4569',
      email: 'taylor.brown@resort.com'
    },
    {
      id: 'emp-4',
      name: 'Riley Wilson',
      department: 'maintenance',
      position: 'Maintenance Technician',
      status: 'active',
      tasksCompleted: 89,
      rating: 4.9,
      efficiency: 97,
      attendance: 100,
      currentTask: 'AC Maintenance',
      skills: ['HVAC', 'Electrical'],
      phone: '+1 (555) 123-4570',
      email: 'riley.wilson@resort.com'
    },
    {
      id: 'emp-5',
      name: 'Sam Davis',
      department: 'maintenance',
      position: 'Plumber',
      status: 'busy',
      tasksCompleted: 93,
      rating: 4.8,
      efficiency: 96,
      attendance: 99,
      currentTask: 'Fixing Shower in 402',
      skills: ['Plumbing', 'General Repairs'],
      phone: '+1 (555) 123-4571',
      email: 'sam.davis@resort.com'
    },
    {
      id: 'emp-6',
      name: 'Casey Lee',
      department: 'front-desk',
      position: 'Front Desk Manager',
      status: 'active',
      tasksCompleted: 67,
      rating: 4.9,
      efficiency: 99,
      attendance: 100,
      currentTask: 'Guest Check-in',
      skills: ['Customer Service', 'Reservations'],
      phone: '+1 (555) 123-4572',
      email: 'casey.lee@resort.com'
    }
  ]
};

export default function GMDashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      busy: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      offline: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getDepartmentBadge = (department) => {
    const styles = {
      housekeeping: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      maintenance: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'front-desk': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[department]}`}>
        {department.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    );
  };

  const getEfficiencyIndicator = (value) => {
    const color = value >= 95 ? 'text-green-500' : value >= 90 ? 'text-yellow-500' : 'text-red-500';
    return <span className={color}>{value}%</span>;
  };

  const filteredEmployees = selectedDepartment === 'all' 
    ? gmData.employees 
    : gmData.employees.filter(emp => emp.department === selectedDepartment);

  const columns = [
    { 
      key: 'name',
      label: 'Employee Name'
    },
    { 
      key: 'department',
      label: 'Department',
      render: (value) => getDepartmentBadge(value)
    },
    {
      key: 'position',
      label: 'Position'
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
      key: 'status',
      label: 'Status',
      render: (value) => getStatusBadge(value)
    }
  ];

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'housekeeping', name: 'Housekeeping' },
    { id: 'maintenance', name: 'Maintenance' },
    { id: 'front-desk', name: 'Front Desk' }
  ];

  const activeEmployees = gmData.employees.filter(emp => emp.status === 'active').length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">General Manager Dashboard</h1>
        <div className="text-sm text-gray-100">
          Property: <span className="font-medium text-white">{gmData.property.name}</span>
        </div>
      </div>

      {/* Property Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card 
          title="Total Staff" 
          value={gmData.property.totalStaff}
          subtitle={`${gmData.property.activeStaff} Active`}
          trend="+2"
          trendUp={true}
        />
        <Card 
          title="Occupancy Rate" 
          value={gmData.property.occupancy}
          trend="+5.2%"
          trendUp={true}
          subtitle="Current Period"
        />
        <Card 
          title="Task Completion" 
          value={`${gmData.property.tasks.completed}/${gmData.property.tasks.total}`}
          subtitle="Today's Tasks"
          trend="+3.8%"
          trendUp={true}
        />
        <Card 
          title="Efficiency Score" 
          value={`${gmData.property.efficiency}%`}
          subtitle="Property Average"
          trend="+1.8%"
          trendUp={true}
        />
      </div>

      {/* Department Filter */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-100">Filter by Department:</label>
          <div className="flex space-x-2">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedDepartment === dept.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card 
          title="Available Staff" 
          value={activeEmployees}
          subtitle={`${((activeEmployees/gmData.property.totalStaff) * 100).toFixed(0)}% of total`}
        />
        <Card 
          title="Average Rating" 
          value="4.8 ★"
          subtitle="Staff Performance"
          trend="+0.1"
          trendUp={true}
        />
        <Card 
          title="Monthly Revenue" 
          value={gmData.property.revenue}
          subtitle="Property Revenue"
          trend="+8.5%"
          trendUp={true}
        />
      </div>

      {/* Employee Table */}
      <div className="bg-[#101828] rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Employee Overview</h2>
          <span className="text-sm text-gray-300">
            {filteredEmployees.length} employees
          </span>
        </div>
        <Table 
          data={filteredEmployees}
          columns={columns}
        />
      </div>

      {/* Department Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-[#101828] rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Department Distribution</h2>
          <div className="space-y-4">
            {departments.filter(d => d.id !== 'all').map((dept) => {
              const deptEmployees = gmData.employees.filter(emp => emp.department === dept.id);
              const percentage = ((deptEmployees.length / gmData.property.totalStaff) * 100).toFixed(0);
              return (
                <div key={dept.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-white">{dept.name}</div>
                    <div className="text-sm text-gray-400">{deptEmployees.length} employees</div>
                  </div>
                  <div className="text-sm font-medium text-blue-400">
                    {percentage}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#101828] rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Performance Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-white">Average Efficiency</div>
              <div className="text-green-400 font-medium">96.8%</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-white">Average Attendance</div>
              <div className="text-blue-400 font-medium">99.2%</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-white">Tasks Completed Today</div>
              <div className="text-yellow-400 font-medium">57/60</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-white">Active Staff</div>
              <div className="text-green-400 font-medium">{activeEmployees}/{gmData.property.totalStaff}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
