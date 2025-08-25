'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { filterDataByProperty } from '@/lib/calc';
import Card from '@/components/Card';
import Table from '@/components/Table';
import Filters from '@/components/Filters';

export default function TasksPage() {
  const { state, dispatch } = useApp();
  const [filters, setFilters] = useState({});
  const [adminTasks, setAdminTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'housekeeping',
    propertyId: 'hyatt-san-antonio-nw',
    priority: 'medium',
    assignNow: true
  });

  const getDepartmentBadge = (department) => {
    if (!department) return null;
    const styles = {
      housekeeping: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      maintenance: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[department] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
        {String(department).charAt(0).toUpperCase() + String(department).slice(1)}
      </span>
    );
  };

  // Assign modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [taskToAssign, setTaskToAssign] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const getAvailableStaffForTask = (task) => {
    // For Admin, allow any available staff across all properties and departments
    const hk = state.staff.housekeeping.people || [];
    const mt = state.staff.maintenance.people || [];
    return [...hk, ...mt].filter(person => person.available);
  };

  const openAssignModal = (task) => {
    setTaskToAssign(task);
    const avail = getAvailableStaffForTask(task);
    setSelectedStaffId(avail[0]?.id || '');
    setShowAssignModal(true);
  };

  const confirmAssign = () => {
    if (!taskToAssign || !selectedStaffId) return;

    const staffList = taskToAssign.type === 'housekeeping' ? state.staff.housekeeping.people : state.staff.maintenance.people;
    const staff = staffList.find(p => p.id === selectedStaffId);
    if (!staff) return;

    if (taskToAssign.source === 'admin' || String(taskToAssign.id).startsWith('adm-')) {
      setAdminTasks(prev => prev.map(t => t.id === taskToAssign.id ? { ...t, assignedTo: staff.id, status: 'in-progress' } : t));
      dispatch({ type: 'ADD_TOAST', payload: { message: `Assigned ${staff.name} to "${taskToAssign.title}"`, type: 'success' } });
      setShowAssignModal(false);
      setTaskToAssign(null);
      setSelectedStaffId('');
      return;
    }

    if (taskToAssign.type === 'housekeeping') {
      dispatch({ type: 'ASSIGN_ROOM', payload: { room: taskToAssign.room, staffId: staff.id, staffName: staff.name } });
    } else {
      dispatch({ type: 'ASSIGN_MAINTENANCE', payload: { id: taskToAssign.id, staffId: staff.id, staffName: staff.name } });
    }

    setShowAssignModal(false);
    setTaskToAssign(null);
    setSelectedStaffId('');
  };

  // Combine housekeeping and maintenance tasks
  const housekeepingTasks = filterDataByProperty(state.rooms, state.selectedProperty)
    .filter(room => room.status !== 'cleaned')
    .map(room => ({
      id: `room-${room.room}-${room.propertyId}`,
      type: 'housekeeping',
      title: `Clean Room ${room.room}`,
      description: room.note || 'Standard cleaning',
      property: state.properties.find(p => p.id === room.propertyId)?.name,
      propertyId: room.propertyId,
      status: room.status === 'maintenance-required' ? 'blocked' : (room.assignedTo ? 'in-progress' : 'pending'),
      priority: room.status === 'maintenance-required' ? 'high' : 'medium',
      assignedTo: room.assignedTo,
      createdAt: new Date().toISOString(),
      room: room.room
    }));

  const maintenanceTasks = filterDataByProperty(state.maintenance, state.selectedProperty)
    .map(item => ({
      id: item.id,
      type: 'maintenance',
      title: item.issue,
      description: item.issue,
      property: state.properties.find(p => p.id === item.propertyId)?.name,
      propertyId: item.propertyId,
      status: item.status === 'open' ? 'pending' : item.status,
      priority: item.priority,
      assignedTo: item.assignedTo,
      createdAt: item.createdAt
    }));

  let allTasks = [...housekeepingTasks, ...maintenanceTasks, ...adminTasks];

  // Apply filters
  if (filters.type) {
    allTasks = allTasks.filter(task => task.type === filters.type);
  }
  if (filters.status) {
    allTasks = allTasks.filter(task => task.status === filters.status);
  }
  if (filters.priority) {
    allTasks = allTasks.filter(task => task.priority === filters.priority);
  }
  if (filters.assignedTo) {
    if (filters.assignedTo === 'unassigned') {
      allTasks = allTasks.filter(task => !task.assignedTo);
    } else {
      allTasks = allTasks.filter(task => task.assignedTo === filters.assignedTo);
    }
  }

  // After filtering/sorting, ensure we don't hide admin seeded tasks unintentionally
  const filteredAdminTasks = adminTasks.filter(t => {
    if (filters.type && t.type !== filters.type) return false;
    if (filters.status && t.status !== filters.status) return false;
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.assignedTo) {
      if (filters.assignedTo === 'unassigned') return !t.assignedTo;
      return t.assignedTo === filters.assignedTo;
    }
    return true;
  });

  // Merge filtered admin tasks last so they are always visible candidates
  allTasks = [...housekeepingTasks, ...maintenanceTasks, ...filteredAdminTasks];

  // Sort by priority and creation date
  allTasks.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const handleAssignTask = (task) => {
    let availableStaff = [];

    if (task.type === 'housekeeping') {
      availableStaff = state.staff.housekeeping.people.filter(person => 
        person.available && person.skills.includes('cleaning')
      );
    } else {
      availableStaff = state.staff.maintenance.people.filter(person => {
        if (!person.available) return false;
        const issueType = (task.description || '').toLowerCase();
        if (issueType.includes('hvac') && person.skills.includes('HVAC')) return true;
        if (issueType.includes('plumbing') && person.skills.includes('plumbing')) return true;
        if (issueType.includes('electrical') && person.skills.includes('electrical')) return true;
        return true;
      });
    }

    if (availableStaff.length === 0) {
      dispatch({
        type: 'ADD_TOAST',
        payload: { message: `No ${task.type} staff currently available`, type: 'warning' }
      });
      return;
    }

    const assignedStaff = availableStaff[0];

    // If it's an admin dummy task, update local state only
    if (task.source === 'admin' || String(task.id).startsWith('adm-')) {
      setAdminTasks(prev => prev.map(t => 
        t.id === task.id ? { ...t, assignedTo: assignedStaff.id, status: 'pending' } : t
      ));
      dispatch({
        type: 'ADD_TOAST',
        payload: { message: `Assigned ${assignedStaff.name} to "${task.title}"`, type: 'success' }
      });
      return;
    }

    if (task.type === 'housekeeping') {
      dispatch({
        type: 'ASSIGN_ROOM',
        payload: { room: task.room, staffId: assignedStaff.id, staffName: assignedStaff.name }
      });
    } else {
      dispatch({
        type: 'ASSIGN_MAINTENANCE',
        payload: { id: task.id, staffId: assignedStaff.id, staffName: assignedStaff.name }
      });
    }
  };

  const handleUpdateStatus = (task, newStatus) => {
    // Admin dummy tasks managed locally
    if (task.source === 'admin' || String(task.id).startsWith('adm-')) {
      setAdminTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
      return;
    }

    if (task.type === 'housekeeping') {
      dispatch({
        type: 'UPDATE_ROOM_STATUS',
        payload: { room: task.room, propertyId: task.propertyId, status: newStatus === 'resolved' ? 'cleaned' : newStatus }
      });
    } else {
      dispatch({
        type: 'UPDATE_MAINTENANCE_STATUS',
        payload: { id: task.id, status: newStatus === 'pending' ? 'open' : newStatus }
      });
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      blocked: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority] || styles.medium}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const styles = {
      housekeeping: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      maintenance: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };

    const icons = { housekeeping: '🧹', maintenance: '🔧' };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>
        {icons[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const columns = [
    {
      key: 'type',
      label: 'Type',
      render: (value) => getTypeBadge(value)
    },
    {
      key: 'title',
      label: 'Task',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {row.property}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {row.description}
          </div>
        </div>
      )
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
      render: (value, row) => {
        if (!value) return <span className="text-gray-400">Unassigned</span>;
        const staffList = row.type === 'housekeeping' 
          ? state.staff.housekeeping.people 
          : state.staff.maintenance.people;
        const staff = staffList.find(p => p.id === value);
        return staff ? staff.name : 'Unknown';
      }
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex space-x-2">
          {getActions(row).map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${action.className || 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )
    }
  ];

  const getActions = (task) => {
    const actions = [];

    if (!task.assignedTo) {
      actions.push({
        label: 'Assign',
        onClick: () => openAssignModal(task),
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
      });
    }

    if (task.status === 'pending' && task.assignedTo) {
      actions.push({
        label: 'Start',
        onClick: () => handleUpdateStatus(task, 'in-progress'),
        className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800'
      });
    }

    if (task.status === 'in-progress') {
      actions.push({
        label: 'Complete',
        onClick: () => handleUpdateStatus(task, 'resolved'),
        className: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
      });
    }

    return actions;
  };

  // Get all staff for assignment filter
  const allStaff = [
    ...state.staff.housekeeping.people.map(p => ({ ...p, department: 'housekeeping' })),
    ...state.staff.maintenance.people.map(p => ({ ...p, department: 'maintenance' }))
  ];

  const filterOptions = [
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      options: [
        { value: 'housekeeping', label: 'Housekeeping' },
        { value: 'maintenance', label: 'Maintenance' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'resolved', label: 'Completed' },
        { value: 'blocked', label: 'Blocked' }
      ]
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
      ]
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      type: 'select',
      options: [
        { value: 'unassigned', label: 'Unassigned' },
        ...allStaff.map(staff => ({ value: staff.id, label: `${staff.name} (${staff.department})` }))
      ]
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Unified Task Board
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage all housekeeping and maintenance tasks in one place
        </p>
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setShowNewTaskModal(true)}
          >
            + New Task
          </button>
        </div>
      </div>

      {/* Stats Overview */}
    

      {/* Filters */}
      <Filters
        filters={filterOptions}
        onFilterChange={setFilters}
        onReset={() => setFilters({})}
      />

      {/* Available Staff (Admin-wide) */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Available Staff (All Properties)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(() => {
            const assignedStaffIds = new Set(
              adminTasks
                .filter(t => t.assignedTo && t.status === 'in-progress')
                .map(t => t.assignedTo)
            );
            return [...(state.staff.housekeeping.people || []), ...(state.staff.maintenance.people || [])]
              .filter(p => p.available && !assignedStaffIds.has(p.id));
          })()
            
            .map(person => (
              <div
                key={person.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedStaffId === person.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                onClick={() => setSelectedStaffId(person.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{person.name}</div>
                    <div className="text-sm text-gray-500">{person.propertyName || person.propertyId}</div>
                    <div className="flex items-center space-x-2 mt-2">
                      {getDepartmentBadge(person.skills?.includes('HVAC') || person.skills?.includes('plumbing') || person.skills?.includes('electrical') ? 'maintenance' : 'housekeeping')}
                      <span className="text-xs text-gray-500">{(person.skills || []).join(', ')}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Available</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Tasks Table */}
      {/* <Card title="All Tasks" subtitle={`${allTasks.length} tasks`}>
        {allTasks.length === 0 ? (
          <div className="text-sm text-gray-600 dark:text-gray-400">No tasks match the current filters.</div>
        ) : (
          <Table
            columns={columns}
            data={allTasks}
          />
        )}
      </Card> */}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Assign Task</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Task</div>
                <div className="font-medium">{taskToAssign?.title}</div>
                <div className="text-xs text-gray-400">{taskToAssign?.property}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Staff Member</label>
                <select
                  className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                >
                  <option value="">Select staff...</option>
                  {getAvailableStaffForTask(taskToAssign).map(person => (
                    <option key={person.id} value={person.id}>
                      {person.name} ({person.skills.join(', ')})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 border rounded" onClick={() => { setShowAssignModal(false); setTaskToAssign(null); setSelectedStaffId(''); }}>Cancel</button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={!selectedStaffId} onClick={confirmAssign}>Assign</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                  placeholder="e.g., Deep Clean Suite 305"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                  value={newTask.type}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                >
                  <option value="housekeeping">Housekeeping</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Property</label>
                <select
                  className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                  value={newTask.propertyId}
                  onChange={(e) => setNewTask({ ...newTask, propertyId: e.target.value })}
                >
                  {state.properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                  rows={3}
                  placeholder="Describe the task"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assign To (optional)</label>
                <select
                  className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                >
                  <option value="">Select staff...</option>
                  {getAvailableStaffForTask({ type: newTask.type }).map(person => (
                    <option key={person.id} value={person.id}>
                      {person.name} ({(person.skills || []).join(', ')})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <button
                className="flex-1 px-4 py-2 border rounded"
                onClick={() => { setShowNewTaskModal(false); setSelectedStaffId(''); }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => {
                  if (!newTask.title) return;
                  const propName = state.properties.find(p => p.id === newTask.propertyId)?.name;
                  const staffList = newTask.type === 'housekeeping' ? state.staff.housekeeping.people : state.staff.maintenance.people;
                  const staff = staffList.find(p => p.id === selectedStaffId);
                  const task = {
                    id: `adm-${Date.now()}`,
                    source: 'admin',
                    type: newTask.type,
                    title: newTask.title,
                    description: newTask.description || (newTask.type === 'housekeeping' ? 'Standard cleaning' : 'Maintenance task'),
                    property: propName,
                    propertyId: newTask.propertyId,
                    status: staff ? 'in-progress' : 'pending',
                    priority: newTask.priority,
                    assignedTo: staff ? staff.id : null,
                    createdAt: new Date().toISOString()
                  };
                  setAdminTasks(prev => [task, ...prev]);
                  dispatch({ type: 'ADD_TOAST', payload: { message: staff ? `Created and assigned to ${staff.name}` : 'Task created - pick a staff below to assign', type: 'success' } });
                  setShowNewTaskModal(false);
                  // Set this new task as the current task to assign and preselect first available staff
                  setTaskToAssign(task);
                  const avail = getAvailableStaffForTask(task);
                  setSelectedStaffId(staff ? staff.id : (avail[0]?.id || ''));
                  setNewTask({ ...newTask, title: '', description: '' });
                }}
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline assign bar when a task is selected to assign */}
      {taskToAssign && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-3 md:mb-0">
            <div className="text-sm text-gray-600 dark:text-gray-300">Assigning</div>
            <div className="font-medium">{taskToAssign.title}</div>
            <div className="text-xs text-gray-500">{taskToAssign.property} • {taskToAssign.type}</div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              className="px-3 py-2 border rounded dark:bg-gray-800"
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
            >
              <option value="">Select staff...</option>
              {getAvailableStaffForTask(taskToAssign).map(person => (
                <option key={person.id} value={person.id}>
                  {person.name} ({(person.skills || []).join(', ')})
                </option>
              ))}
            </select>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={!selectedStaffId}
              onClick={confirmAssign}
            >
              Assign
            </button>
            <button
              className="px-3 py-2 border rounded"
              onClick={() => { setTaskToAssign(null); setSelectedStaffId(''); }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
