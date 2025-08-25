'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import { mockStaff, mockTasks, mockProperties } from '@/data/mockData';

export default function AssignTasks() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [customTask, setCustomTask] = useState({
    title: '',
    description: '',
    department: 'housekeeping',
    priority: 'medium',
    estimatedTime: '',
    dueTime: ''
  });

  // Initialize data on component mount
  useEffect(() => {
    // Get all pending tasks from mock data
    const allTasks = [...mockTasks.housekeeping, ...mockTasks.maintenance];
    const pending = allTasks.filter(task => task.status === 'pending');
    setPendingTasks(pending);

    // Get all available staff
    const allStaff = [...mockStaff.housekeeping, ...mockStaff.maintenance];
    const available = allStaff.filter(staff => staff.available);
    setAvailableStaff(available);
  }, []);

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
      low: 'bg-green-100 text-green-800 dark:bg-red-900 dark:text-green-300'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getDepartmentBadge = (department) => {
    if (!department) return null;
    const styles = {
      housekeeping: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      maintenance: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'front-desk': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[department] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
        {String(department).replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    );
  };

  const handleAssignTask = () => {
    if (selectedTask && selectedEmployee) {
      // Update pending tasks UI state to reflect assignment
      setPendingTasks(prev => prev.map(t => (
        t.id === selectedTask.id
          ? { ...t, assignedTo: selectedEmployee.name, assignedToId: selectedEmployee.id, status: 'in-progress' }
          : t
      )));

      // Update the mock data for consistency
      if (selectedTask.department === 'housekeeping') {
        const taskIndex = mockTasks.housekeeping.findIndex(t => t.id === selectedTask.id);
        if (taskIndex !== -1) {
          mockTasks.housekeeping[taskIndex] = {
            ...mockTasks.housekeeping[taskIndex],
            assignedTo: selectedEmployee.name,
            assignedToId: selectedEmployee.id,
            status: 'in-progress'
          };
        }
      } else if (selectedTask.department === 'maintenance') {
        const taskIndex = mockTasks.maintenance.findIndex(t => t.id === selectedTask.id);
        if (taskIndex !== -1) {
          mockTasks.maintenance[taskIndex] = {
            ...mockTasks.maintenance[taskIndex],
            assignedTo: selectedEmployee.name,
            assignedToId: selectedEmployee.id,
            status: 'in-progress'
          };
        }
      }

      // Update staff availability
      setAvailableStaff(prev => prev.map(staff => 
        staff.id === selectedEmployee.id 
          ? { ...staff, available: false, currentTask: selectedTask.title }
          : staff
      ));

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
      assignedToId: selectedEmployee ? selectedEmployee.id : null,
      dueTime: customTask.dueTime || 'TBD',
      status: selectedEmployee ? 'in-progress' : 'pending',
      property: 'hyatt-san-antonio-nw', // Default property for demo
      propertyName: 'Hyatt Place San Antonio NW Medical Center',
      estimatedDuration: customTask.estimatedTime || 'TBD',
      type: 'custom',
      location: 'TBD'
    };

    setPendingTasks(prev => [newTask, ...prev]);

    // Add to mock data
    if (customTask.department === 'housekeeping') {
      mockTasks.housekeeping.push(newTask);
    } else if (customTask.department === 'maintenance') {
      mockTasks.maintenance.push(newTask);
    }

    // Update staff availability if assigned
    if (selectedEmployee) {
      setAvailableStaff(prev => prev.map(staff => 
        staff.id === selectedEmployee.id 
          ? { ...staff, available: false, currentTask: customTask.title }
          : staff
      ));
    }

    setCustomTask({
      title: '',
      description: '',
      department: 'housekeeping',
      priority: 'medium',
      estimatedTime: '',
      dueTime: ''
    });
  };

  // Get current property (for demo purposes, using the first property)
  const currentProperty = mockProperties['hyatt-san-antonio-nw'];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assign Tasks</h1>
        <div className="text-sm text-gray-500">
          Property: <span className="font-medium text-gray-900">{currentProperty.name}</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card 
          title="Available Staff" 
          value={availableStaff.length}
          subtitle={`${availableStaff.length + (mockStaff.housekeeping.length + mockStaff.maintenance.length - availableStaff.length)} Total Staff`}
        />
        <Card 
          title="Pending Tasks" 
          value={pendingTasks.filter(t => t.status === 'pending').length}
          subtitle="Need Assignment"
        />
        <Card 
          title="Active Tasks" 
          value={pendingTasks.filter(t => t.status === 'in-progress').length}
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
            {availableStaff.map((employee) => (
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">{employee.department}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getDepartmentBadge(employee.department)}
                      <span className="text-sm text-gray-500">Efficiency: {employee.efficiency}%</span>
                    </div>
                  </div>
                  {getStatusBadge(employee.available ? 'active' : 'busy')}
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
            {[
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
              }
            ].map((task) => (
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
            <div key={`${task.id}-${task.department || 'dept'}`} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
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
                {task.status === 'pending' && (
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowAssignmentModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Assign
                  </button>
                )}
                {task.status === 'in-progress' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    In Progress
                  </span>
                )}
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
                    const emp = availableStaff.find(emp => emp.id === e.target.value);
                    setSelectedEmployee(emp);
                  }}
                >
                  <option value="">Select employee...</option>
                  {availableStaff.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.department}
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
                const emp = availableStaff.find(emp => emp.id === e.target.value);
                setSelectedEmployee(emp);
              }}
            >
              <option value="">Choose employee...</option>
              {availableStaff.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.department}
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
