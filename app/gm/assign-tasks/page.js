'use client';

import { useState } from 'react';
import Card from '@/components/Card';

// Mock data for task assignment
const taskData = {
  property: {
    id: 'property2',
    name: 'Resort & Spa'
  },
  employees: [
    {
      id: 'emp-1',
      name: 'Alex Johnson',
      department: 'housekeeping',
      position: 'Senior Housekeeper',
      status: 'active',
      currentTask: 'Room 301 Cleaning',
      skills: ['Room Cleaning', 'Deep Clean', 'Laundry'],
      efficiency: 98
    },
    {
      id: 'emp-2',
      name: 'Jamie Smith',
      department: 'housekeeping',
      position: 'Housekeeper',
      status: 'active',
      currentTask: 'Restocking Supplies',
      skills: ['Deep Clean', 'Inventory'],
      efficiency: 95
    },
    {
      id: 'emp-3',
      name: 'Taylor Brown',
      department: 'housekeeping',
      position: 'Housekeeper',
      status: 'busy',
      currentTask: 'Deep Cleaning Room 105',
      skills: ['Room Cleaning', 'Maintenance'],
      efficiency: 94
    },
    {
      id: 'emp-4',
      name: 'Riley Wilson',
      department: 'maintenance',
      position: 'Maintenance Technician',
      status: 'active',
      currentTask: 'AC Maintenance',
      skills: ['HVAC', 'Electrical'],
      efficiency: 97
    },
    {
      id: 'emp-5',
      name: 'Sam Davis',
      department: 'maintenance',
      position: 'Plumber',
      status: 'busy',
      currentTask: 'Fixing Shower in 402',
      skills: ['Plumbing', 'General Repairs'],
      efficiency: 96
    },
    {
      id: 'emp-6',
      name: 'Casey Lee',
      department: 'front-desk',
      position: 'Front Desk Manager',
      status: 'active',
      currentTask: 'Guest Check-in',
      skills: ['Customer Service', 'Reservations'],
      efficiency: 99
    }
  ],
  taskTemplates: [
    {
      id: 'task-1',
      title: 'Room Cleaning',
      description: 'Standard room cleaning and preparation',
      department: 'housekeeping',
      priority: 'medium',
      estimatedTime: '30 min',
      skills: ['Room Cleaning']
    },
    {
      id: 'task-2',
      title: 'Deep Cleaning',
      description: 'Thorough deep cleaning of rooms',
      department: 'housekeeping',
      priority: 'high',
      estimatedTime: '2 hours',
      skills: ['Deep Clean']
    },
    {
      id: 'task-3',
      title: 'HVAC Maintenance',
      description: 'Air conditioning system maintenance',
      department: 'maintenance',
      priority: 'high',
      estimatedTime: '1 hour',
      skills: ['HVAC']
    },
    {
      id: 'task-4',
      title: 'Plumbing Repair',
      description: 'Fix plumbing issues in guest rooms',
      department: 'maintenance',
      priority: 'high',
      estimatedTime: '45 min',
      skills: ['Plumbing']
    },
    {
      id: 'task-5',
      title: 'Guest Check-in',
      description: 'Assist with guest check-in process',
      department: 'front-desk',
      priority: 'medium',
      estimatedTime: '15 min',
      skills: ['Customer Service']
    },
    {
      id: 'task-6',
      title: 'Inventory Management',
      description: 'Restock and organize supplies',
      department: 'housekeeping',
      priority: 'low',
      estimatedTime: '1 hour',
      skills: ['Inventory']
    }
  ],
  pendingTasks: [
    {
      id: 'pending-1',
      title: 'Room 205 Cleaning',
      description: 'Standard cleaning for checkout',
      department: 'housekeeping',
      priority: 'medium',
      assignedTo: null,
      dueTime: '2:00 PM',
      status: 'pending'
    },
    {
      id: 'pending-2',
      title: 'Fix Leaking Faucet - Room 312',
      description: 'Guest reported leaking bathroom faucet',
      department: 'maintenance',
      priority: 'high',
      assignedTo: null,
      dueTime: '1:30 PM',
      status: 'pending'
    },
    {
      id: 'pending-3',
      title: 'Deep Clean Suite 401',
      description: 'VIP guest suite preparation',
      department: 'housekeeping',
      priority: 'high',
      assignedTo: null,
      dueTime: '3:00 PM',
      status: 'pending'
    }
  ]
};

export default function AssignTasks() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [pendingTasks, setPendingTasks] = useState(taskData.pendingTasks);
  const [customTask, setCustomTask] = useState({
    title: '',
    description: '',
    department: 'housekeeping',
    priority: 'medium',
    estimatedTime: '',
    dueTime: ''
  });

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

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
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

  const availableEmployees = taskData.employees.filter(emp => emp.status === 'active');

  const handleAssignTask = () => {
    if (selectedTask && selectedEmployee) {
      // Update pending tasks UI state to reflect assignment
      setPendingTasks(prev => prev.map(t => (
        t.id === selectedTask.id
          ? { ...t, assignedTo: selectedEmployee.name, status: 'in-progress' }
          : t
      )));
      setShowAssignmentModal(false);
      setSelectedTask(null);
      setSelectedEmployee(null);
    }
  };

  const handleCreateCustomTask = () => {
    if (!customTask.title || !customTask.description) return;
    const newTask = {
      id: `pending-${Date.now()}`,
      title: customTask.title,
      description: customTask.description,
      department: customTask.department,
      priority: customTask.priority,
      assignedTo: selectedEmployee ? selectedEmployee.name : null,
      dueTime: customTask.dueTime || 'TBD',
      status: 'pending'
    };
    setPendingTasks(prev => [newTask, ...prev]);
    setCustomTask({
      title: '',
      description: '',
      department: 'housekeeping',
      priority: 'medium',
      estimatedTime: '',
      dueTime: ''
    });
    // Keep selected employee for convenience
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assign Tasks</h1>
        <div className="text-sm text-gray-500">
          Property: <span className="font-medium text-gray-900">{taskData.property.name}</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card 
          title="Available Staff" 
          value={availableEmployees.length}
          subtitle={`${taskData.employees.length} Total Staff`}
        />
        <Card 
          title="Pending Tasks" 
          value={pendingTasks.length}
          subtitle="Need Assignment"
        />
        <Card 
          title="Active Tasks" 
          value={taskData.employees.filter(emp => emp.status === 'busy').length}
          subtitle="Currently Working"
        />
        <Card 
          title="Task Completion" 
          value="95%"
          subtitle="Today's Rate"
          trend="+2.5%"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Staff */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Available Staff</h2>
          <div className="space-y-3">
            {availableEmployees.map((employee) => (
              <div 
                key={employee.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedEmployee?.id === employee.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setSelectedEmployee(employee)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{employee.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{employee.position}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getDepartmentBadge(employee.department)}
                      <span className="text-sm text-gray-500">Efficiency: {employee.efficiency}%</span>
                    </div>
                  </div>
                  {getStatusBadge(employee.status)}
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {employee.currentTask}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {employee.skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Templates */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Task Templates</h2>
          <div className="space-y-3">
            {taskData.taskTemplates.map((task) => (
              <div 
                key={task.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTask?.id === task.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getDepartmentBadge(task.department)}
                      {getPriorityBadge(task.priority)}
                      <span className="text-sm text-gray-500">{task.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Pending Tasks</h2>
        <div className="space-y-3">
          {pendingTasks.map((task) => (
            <div key={task.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {getDepartmentBadge(task.department)}
                    {getPriorityBadge(task.priority)}
                    <span className="text-sm text-gray-500">Due: {task.dueTime}</span>
                    {task.assignedTo && (
                      <span className="text-sm text-gray-500">Assigned to: {task.assignedTo}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setShowAssignmentModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Assign
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Assign Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Task</label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="font-medium">{selectedTask?.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTask?.description}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Assign to</label>
                <select 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  value={selectedEmployee?.id || ''}
                  onChange={(e) => {
                    const emp = availableEmployees.find(emp => emp.id === e.target.value);
                    setSelectedEmployee(emp);
                  }}
                >
                  <option value="">Select employee...</option>
                  {availableEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.position}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTask}
                  disabled={!selectedEmployee}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Assignment Section */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Assignment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Employee</label>
            <select 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              value={selectedEmployee?.id || ''}
              onChange={(e) => {
                const emp = availableEmployees.find(emp => emp.id === e.target.value);
                setSelectedEmployee(emp);
              }}
            >
              <option value="">Choose employee...</option>
              {availableEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.position}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Task Title</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              placeholder="Enter task title..."
              value={customTask.title}
              onChange={(e) => setCustomTask({...customTask, title: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Task Description</label>
            <textarea
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              rows="3"
              placeholder="Enter task description..."
              value={customTask.description}
              onChange={(e) => setCustomTask({...customTask, description: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              value={customTask.priority}
              onChange={(e) => setCustomTask({...customTask, priority: e.target.value})}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Estimated Time</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              placeholder="e.g., 30 min"
              value={customTask.estimatedTime}
              onChange={(e) => setCustomTask({...customTask, estimatedTime: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Due Time</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              placeholder="e.g., 2:30 PM"
              value={customTask.dueTime}
              onChange={(e) => setCustomTask({...customTask, dueTime: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleCreateCustomTask}
              disabled={!selectedEmployee || !customTask.title || !customTask.description}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create & Assign Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
