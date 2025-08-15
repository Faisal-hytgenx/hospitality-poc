'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Table from '@/components/Table';

// Mock data for admin dashboard
const adminData = {
  overview: {
    totalStaff: 80,
    activeStaff: 72,
    totalProperties: 3,
    avgEfficiency: 96,
    taskCompletion: 94,
    staffSatisfaction: 4.7
  },
  properties: [
    {
      id: 'property1',
      name: 'Luxury Hotel Downtown',
      staff: 25,
      occupancy: '87%',
      efficiency: 96,
      revenue: '$124,500',
      tasks: { total: 45, completed: 42 }
    },
    {
      id: 'property2',
      name: 'Resort & Spa',
      staff: 35,
      occupancy: '92%',
      efficiency: 98,
      revenue: '$156,800',
      tasks: { total: 60, completed: 57 }
    },
    {
      id: 'property3',
      name: 'Business Hotel Central',
      staff: 20,
      occupancy: '85%',
      efficiency: 94,
      revenue: '$98,300',
      tasks: { total: 35, completed: 32 }
    }
  ]
};

export default function AdminDashboard() {
  const [selectedProperty, setSelectedProperty] = useState(adminData.properties[0]);

  const getEfficiencyBadge = (value) => {
    const styles = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800'
    };
    const level = value >= 95 ? 'high' : value >= 90 ? 'medium' : 'low';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[level]}`}>
        {value}%
      </span>
    );
  };

  const propertyColumns = [
    { 
      key: 'name',
      label: 'Property'
    },
    {
      key: 'staff',
      label: 'Staff',
      render: (value) => `${value} members`
    },
    {
      key: 'occupancy',
      label: 'Occupancy'
    },
    {
      key: 'efficiency',
      label: 'Efficiency',
      render: (value) => getEfficiencyBadge(value)
    },
    {
      key: 'tasks',
      label: 'Tasks',
      render: (value) => `${value.completed}/${value.total}`
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card 
          title="Total Staff" 
          value={adminData.overview.totalStaff}
          subtitle={`${adminData.overview.activeStaff} Active Members`}
          trend="+5"
          trendUp={true}
        />
        <Card 
          title="Properties" 
          value={adminData.overview.totalProperties}
          subtitle="Under Management"
        />
        <Card 
          title="Staff Satisfaction" 
          value={`${adminData.overview.staffSatisfaction} ★`}
          subtitle="Average Rating"
          trend="+0.2"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card 
          title="Task Completion" 
          value={`${adminData.overview.taskCompletion}%`}
          subtitle="Across All Properties"
          trend="+2.5%"
          trendUp={true}
        />
        <Card 
          title="Efficiency Score" 
          value={`${adminData.overview.avgEfficiency}%`}
          subtitle="Average Performance"
          trend="+1.8%"
          trendUp={true}
        />
        <Card 
          title="Total Revenue" 
          value="$379.6K"
          subtitle="All Properties"
          trend="+8.5%"
          trendUp={true}
        />
      </div>

      <div className="bg-[#101828] rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Property Overview</h2>
        <Table 
          data={adminData.properties}
          columns={propertyColumns}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#101828] rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Staff Distribution</h2>
          <div className="space-y-4">
            {adminData.properties.map((property) => (
              <div key={property.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{property.name}</div>
                  <div className="text-sm text-gray-500">{property.staff} Staff Members</div>
                </div>
                <div className="text-sm font-medium text-blue-600">
                  {((property.staff / adminData.overview.totalStaff) * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#101828] rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
          <div className="space-y-4">
            {adminData.properties.map((property) => (
              <div key={property.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{property.name}</div>
                  <div className="text-sm text-gray-500">
                    Revenue: {property.revenue}
                  </div>
                </div>
                <div>
                  {getEfficiencyBadge(property.efficiency)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}