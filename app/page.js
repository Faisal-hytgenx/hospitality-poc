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
      id: 'hyatt-san-antonio-nw',
      name: 'Hyatt Place San Antonio NW Medical Center',
      staff: 25,
      occupancy: '87%',
      efficiency: 96,
      revenue: '$124,500',
      tasks: { total: 45, completed: 42 },
      assignedGM: 'Michael Chen',
      assignedStaff: 25
    },
    {
      id: 'holiday-inn-san-antonio-nw',
      name: 'Holiday Inn San Antonio NW',
      staff: 20,
      occupancy: '92%',
      efficiency: 98,
      revenue: '$98,300',
      tasks: { total: 35, completed: 32 },
      assignedGM: 'Sarah Johnson',
      assignedStaff: 20
    },
    {
      id: 'holiday-inn-stone-oak',
      name: 'Holiday Inn San Antonio Stone Oak Area',
      staff: 22,
      occupancy: '85%',
      efficiency: 94,
      revenue: '$156,800',
      tasks: { total: 40, completed: 38 },
      assignedGM: null,
      assignedStaff: 22
    }
  ],
  // All tasks across all properties
  allTasks: [
    {
      id: 'task-1',
      title: 'Room 301 Cleaning',
      property: 'Hyatt Place San Antonio NW Medical Center',
      propertyId: 'hyatt-san-antonio-nw',
      department: 'housekeeping',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'Alex Johnson',
      dueDate: '2024-01-15',
      estimatedTime: '30 min'
    },
    {
      id: 'task-2',
      title: 'HVAC Maintenance - Floor 2',
      property: 'Holiday Inn San Antonio NW',
      propertyId: 'holiday-inn-san-antonio-nw',
      department: 'maintenance',
      priority: 'medium',
      status: 'pending',
      assignedTo: null,
      dueDate: '2024-01-16',
      estimatedTime: '2 hours'
    },
    {
      id: 'task-3',
      title: 'Guest Check-in Assistance',
      property: 'Holiday Inn San Antonio Stone Oak Area',
      propertyId: 'holiday-inn-stone-oak',
      department: 'front-desk',
      priority: 'high',
      status: 'completed',
      assignedTo: 'Casey Lee',
      dueDate: '2024-01-14',
      estimatedTime: '15 min'
    },
    {
      id: 'task-4',
      title: 'Deep Cleaning - Suite 105',
      property: 'Holiday Inn San Antonio NW',
      propertyId: 'holiday-inn-san-antonio-nw',
      department: 'housekeeping',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: 'Taylor Brown',
      dueDate: '2024-01-15',
      estimatedTime: '3 hours'
    },
    {
      id: 'task-5',
      title: 'Plumbing Repair - Room 402',
      property: 'Hyatt Place San Antonio NW Medical Center',
      propertyId: 'hyatt-san-antonio-nw',
      department: 'maintenance',
      priority: 'high',
      status: 'pending',
      assignedTo: null,
      dueDate: '2024-01-15',
      estimatedTime: '1 hour'
    },
    {
      id: 'task-6',
      title: 'Inventory Restocking',
      property: 'Holiday Inn San Antonio Stone Oak Area',
      propertyId: 'holiday-inn-stone-oak',
      department: 'housekeeping',
      priority: 'low',
      status: 'pending',
      assignedTo: null,
      dueDate: '2024-01-17',
      estimatedTime: '45 min'
    }
  ],
  // Available staff for assignment
  availableStaff: [
    {
      id: 'staff-1',
      name: 'Alex Johnson',
      department: 'housekeeping',
      position: 'Senior Housekeeper',
      currentProperty: 'Hyatt Place San Antonio NW Medical Center',
      currentPropertyId: 'hyatt-san-antonio-nw',
      status: 'available',
      skills: ['Room Cleaning', 'Deep Clean', 'Laundry'],
      efficiency: 98
    },
    {
      id: 'staff-2',
      name: 'Jamie Smith',
      department: 'housekeeping',
      position: 'Housekeeper',
      currentProperty: 'Holiday Inn San Antonio NW',
      currentPropertyId: 'holiday-inn-san-antonio-nw',
      status: 'available',
      skills: ['Deep Clean', 'Inventory'],
      efficiency: 95
    },
    {
      id: 'staff-3',
      name: 'Taylor Brown',
      department: 'housekeeping',
      position: 'Housekeeper',
      currentProperty: 'Hyatt Place San Antonio NW Medical Center',
      currentPropertyId: 'hyatt-san-antonio-nw',
      status: 'busy',
      skills: ['Room Cleaning', 'Maintenance'],
      efficiency: 94
    },
    {
      id: 'staff-4',
      name: 'Riley Wilson',
      department: 'maintenance',
      position: 'Maintenance Technician',
      currentProperty: 'Holiday Inn San Antonio NW',
      currentPropertyId: 'holiday-inn-san-antonio-nw',
      status: 'available',
      skills: ['HVAC', 'Electrical'],
      efficiency: 97
    },
    {
      id: 'staff-5',
      name: 'Sam Davis',
      department: 'maintenance',
      position: 'Plumber',
      currentProperty: 'Hyatt Place San Antonio NW Medical Center',
      currentPropertyId: 'hyatt-san-antonio-nw',
      status: 'available',
      skills: ['Plumbing', 'General Repairs'],
      efficiency: 96
    },
    {
      id: 'staff-6',
      name: 'Casey Lee',
      department: 'front-desk',
      position: 'Front Desk Manager',
      currentProperty: 'Holiday Inn San Antonio Stone Oak Area',
      currentPropertyId: 'holiday-inn-stone-oak',
      status: 'available',
      skills: ['Customer Service', 'Reservations'],
      efficiency: 99
    }
  ],
  // Available General Managers
  availableGMs: [
    {
      id: 'gm-1',
      name: 'Sarah Johnson',
      currentProperty: 'Holiday Inn San Antonio NW',
      currentPropertyId: 'holiday-inn-san-antonio-nw',
      experience: '8 years',
      rating: 4.9,
      status: 'assigned'
    },
    {
      id: 'gm-2',
      name: 'Michael Chen',
      currentProperty: 'Hyatt Place San Antonio NW Medical Center',
      currentPropertyId: 'hyatt-san-antonio-nw',
      experience: '6 years',
      rating: 4.8,
      status: 'assigned'
    },
    {
      id: 'gm-3',
      name: 'David Rodriguez',
      currentProperty: null,
      currentPropertyId: null,
      experience: '5 years',
      rating: 4.7,
      status: 'available'
    },
    {
      id: 'gm-4',
      name: 'Lisa Thompson',
      currentProperty: null,
      currentPropertyId: null,
      experience: '7 years',
      rating: 4.9,
      status: 'available'
    }
  ]
};

export default function AdminDashboard() {
  const [selectedProperty, setSelectedProperty] = useState(adminData.properties[0]);
  const [viewMode, setViewMode] = useState('overview'); // 'overview', 'tasks', 'property-detail'
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskAssignment, setShowTaskAssignment] = useState(false);
  const [showStaffAssignment, setShowStaffAssignment] = useState(false);
  const [showGMAssignment, setShowGMAssignment] = useState(false);
  const [selectedStaffForTask, setSelectedStaffForTask] = useState('');
  const [allTasks, setAllTasks] = useState(adminData.allTasks);

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

  const getStatusBadge = (status) => {
    const styles = {
      'in-progress': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
    },
    {
      key: 'assignedGM',
      label: 'General Manager',
      render: (value) => value || 'Unassigned'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedProperty(row);
              setViewMode('property-detail');
            }}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            View Details
          </button>
          <button
            onClick={() => {
              setSelectedProperty(row);
              setShowStaffAssignment(true);
            }}
            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
          >
            Send Staff
          </button>
        </div>
      )
    }
  ];

  const taskColumns = [
    {
      key: 'title',
      label: 'Task'
    },
    {
      key: 'property',
      label: 'Property'
    },
    {
      key: 'department',
      label: 'Department'
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
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      render: (value) => value || 'Unassigned'
    },
    {
      key: 'dueDate',
      label: 'Due Date'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <button
          onClick={() => {
            setSelectedTask(row);
            setShowTaskAssignment(true);
          }}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Assign Staff
        </button>
      )
    }
  ];

  const staffColumns = [
    {
      key: 'name',
      label: 'Staff Member'
    },
    {
      key: 'department',
      label: 'Department'
    },
    {
      key: 'position',
      label: 'Position'
    },
    {
      key: 'currentProperty',
      label: 'Current Property'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'efficiency',
      label: 'Efficiency',
      render: (value) => getEfficiencyBadge(value)
    }
  ];

  const renderOverview = () => (
    <>
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
    </>
  );

  const renderTasksView = () => (
    <div className="bg-[#101828] rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">All Tasks Across Properties</h2>
      <Table 
        data={allTasks}
        columns={taskColumns}
      />
    </div>
  );

  const renderPropertyDetail = () => {
    const propertyTasks = allTasks.filter(task => task.propertyId === selectedProperty.id);
    const propertyStaff = adminData.availableStaff.filter(staff => staff.currentPropertyId === selectedProperty.id);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{selectedProperty.name}</h2>
            <p className="text-gray-100">Property Management Dashboard</p>
          </div>
          <div className="flex space-x-2">
            <button
              // onClick={() => setShowGMAssignment(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Assign New Manager
            </button>
            <button
              onClick={() => setViewMode('overview')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back to Overview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card 
            title="Total Staff" 
            value={selectedProperty.staff}
            subtitle="Assigned to Property"
          />
          <Card 
            title="Occupancy" 
            value={selectedProperty.occupancy}
            subtitle="Current Rate"
          />
          <Card 
            title="Efficiency" 
            value={`${selectedProperty.efficiency}%`}
            subtitle="Property Average"
          />
          <Card 
            title="Revenue" 
            value={selectedProperty.revenue}
            subtitle="This Month"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#101828] rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Assigned Staff</h3>
            <Table 
              data={propertyStaff}
              columns={staffColumns}
            />
          </div>

          <div className="bg-[#101828] rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Property Tasks</h3>
            <Table 
              data={propertyTasks}
              columns={taskColumns}
            />
          </div>
        </div>
      </div>
    );
  };

  const handleTaskAssignment = () => {
    if (selectedTask && selectedStaffForTask) {
      const selectedStaff = adminData.availableStaff.find(staff => staff.id === selectedStaffForTask);
      
      // Update the task with assignment
      setAllTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? { ...task, assignedTo: selectedStaff.name, status: 'in-progress' }
          : task
      ));
      
      // Update adminData for consistency
      adminData.allTasks = adminData.allTasks.map(task => 
        task.id === selectedTask.id 
          ? { ...task, assignedTo: selectedStaff.name, status: 'in-progress' }
          : task
      );
      
      setShowTaskAssignment(false);
      setSelectedTask(null);
      setSelectedStaffForTask('');
      alert('Staff assigned to task successfully!');
    }
  };

  const handleStaffAssignment = () => {
    if (selectedProperty && selectedStaffForTask) {
      const selectedStaff = adminData.availableStaff.find(staff => staff.id === selectedStaffForTask);
      
      // Update staff's current property
      adminData.availableStaff = adminData.availableStaff.map(staff => 
        staff.id === selectedStaffForTask 
          ? { ...staff, currentProperty: selectedProperty.name, currentPropertyId: selectedProperty.id }
          : staff
      );
      
      setShowStaffAssignment(false);
      setSelectedProperty(null);
      setSelectedStaffForTask('');
      alert('Staff sent to property successfully!');
    }
  };

  const handleGMAssignment = () => {
    if (selectedProperty && selectedStaffForTask) {
      const selectedGM = adminData.availableGMs.find(gm => gm.id === selectedStaffForTask);
      
      // Update GM's current property
      adminData.availableGMs = adminData.availableGMs.map(gm => 
        gm.id === selectedStaffForTask 
          ? { ...gm, currentProperty: selectedProperty.name, currentPropertyId: selectedProperty.id, status: 'assigned' }
          : gm
      );
      
      // Update property's assigned GM
      adminData.properties = adminData.properties.map(prop => 
        prop.id === selectedProperty.id 
          ? { ...prop, assignedGM: selectedGM.name }
          : prop
      );
      
      setShowGMAssignment(false);
      setSelectedProperty(null);
      setSelectedStaffForTask('');
      alert('General Manager assigned to property successfully!');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-4 py-2 rounded ${viewMode === 'overview' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode('tasks')}
            className={`px-4 py-2 rounded ${viewMode === 'tasks' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All Tasks
          </button>
        </div>
      </div>

      {viewMode === 'overview' && renderOverview()}
      {viewMode === 'tasks' && renderTasksView()}
      {viewMode === 'property-detail' && renderPropertyDetail()}

      {/* Task Assignment Modal */}
      {showTaskAssignment && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#101828] rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Assign Staff to Task</h3>
            <p className="mb-4"><strong>Task:</strong> {selectedTask.title}</p>
            <p className="mb-4"><strong>Property:</strong> {selectedTask.property}</p>
            
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">Select Staff Member:</label>
              <select 
                className="w-full bg-[#101828] border rounded px-3 py-2"
                value={selectedStaffForTask}
                onChange={(e) => setSelectedStaffForTask(e.target.value)}
              >
                <option value="">Choose staff member...</option>
                {adminData.availableStaff
                  .filter(staff => staff.currentPropertyId === selectedTask.propertyId && staff.status === 'available')
                  .map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name} - {staff.position}</option>
                  ))
                }
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowTaskAssignment(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleTaskAssignment}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Assignment Modal */}
      {showStaffAssignment && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#101828] rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Send Staff to Property</h3>
            <p className="mb-4"><strong>Property:</strong> {selectedProperty.name}</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Staff Member:</label>
              <select 
                className="w-full bg-[#101828] border rounded px-3 py-2"
                value={selectedStaffForTask}
                onChange={(e) => setSelectedStaffForTask(e.target.value)}
              >
                <option value="">Choose staff member...</option>
                {adminData.availableStaff
                  .filter(staff => staff.status === 'available')
                  .map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name} - {staff.position}</option>
                  ))
                }
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowStaffAssignment(false)}
                className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleStaffAssignment}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Send Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GM Assignment Modal */}
      {showGMAssignment && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Assign General Manager</h3>
            <p className="mb-4"><strong>Property:</strong> {selectedProperty.name}</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select General Manager:</label>
              <select 
                className="w-full border rounded px-3 py-2"
                value={selectedStaffForTask}
                onChange={(e) => setSelectedStaffForTask(e.target.value)}
              >
                <option value="">Choose GM...</option>
                {adminData.availableGMs
                  .filter(gm => gm.status === 'available')
                  .map(gm => (
                    <option key={gm.id} value={gm.id}>{gm.name} - {gm.experience} experience</option>
                  ))
                }
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowGMAssignment(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleGMAssignment}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Assign GM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}