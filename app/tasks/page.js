'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { filterDataByProperty } from '@/lib/calc';
import Card from '@/components/Card';
import Table from '@/components/Table';
import Filters from '@/components/Filters';

export default function TasksPage() {
  const { state, dispatch } = useApp();
  const [filters, setFilters] = useState({});

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

  let allTasks = [...housekeepingTasks, ...maintenanceTasks];

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
        
        const issueType = task.description.toLowerCase();
        if (issueType.includes('hvac') && person.skills.includes('HVAC')) return true;
        if (issueType.includes('plumbing') && person.skills.includes('plumbing')) return true;
        if (issueType.includes('electrical') && person.skills.includes('electrical')) return true;
        
        return true;
      });
    }
    
    if (availableStaff.length === 0) {
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          message: `No ${task.type} staff currently available`,
          type: 'warning'
        }
      });
      return;
    }

    const assignedStaff = availableStaff[0];
    
    if (task.type === 'housekeeping') {
      dispatch({
        type: 'ASSIGN_ROOM',
        payload: {
          room: task.room,
          staffId: assignedStaff.id,
          staffName: assignedStaff.name
        }
      });
    } else {
      dispatch({
        type: 'ASSIGN_MAINTENANCE',
        payload: {
          id: task.id,
          staffId: assignedStaff.id,
          staffName: assignedStaff.name
        }
      });
    }
  };

  const handleUpdateStatus = (task, newStatus) => {
    if (task.type === 'housekeeping') {
      dispatch({
        type: 'UPDATE_ROOM_STATUS',
        payload: {
          room: task.room,
          propertyId: task.propertyId,
          status: newStatus === 'resolved' ? 'cleaned' : newStatus
        }
      });
    } else {
      dispatch({
        type: 'UPDATE_MAINTENANCE_STATUS',
        payload: {
          id: task.id,
          status: newStatus === 'pending' ? 'open' : newStatus
        }
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

    const icons = {
      housekeeping: '🧹',
      maintenance: '🔧'
    };

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
    }
  ];

  const getActions = (task) => {
    const actions = [];

    if (!task.assignedTo) {
      actions.push({
        label: 'Assign',
        onClick: () => handleAssignTask(task),
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
        ...allStaff.map(staff => ({
          value: staff.id,
          label: `${staff.name} (${staff.department})`
        }))
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
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {allTasks.filter(t => t.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Pending
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {allTasks.filter(t => t.status === 'in-progress').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            In Progress
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {allTasks.filter(t => t.status === 'resolved').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Completed
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {allTasks.filter(t => t.status === 'blocked').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Blocked
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {allTasks.filter(t => !t.assignedTo).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Unassigned
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Filters
        filters={filterOptions}
        onFilterChange={setFilters}
        onReset={() => setFilters({})}
      />

      {/* Tasks Table */}
      <Card title="All Tasks" subtitle={`${allTasks.length} tasks`}>
        <Table
          columns={columns}
          data={allTasks}
          actions={allTasks.map(task => getActions(task))}
        />
      </Card>
    </div>
  );
}
