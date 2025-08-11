'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { filterDataByProperty } from '@/lib/calc';
import Card from '@/components/Card';
import Table from '@/components/Table';
import Filters from '@/components/Filters';

export default function MaintenancePage() {
  const { state, dispatch } = useApp();
  const [filters, setFilters] = useState({});

  // Filter maintenance requests based on selected property and additional filters
  let filteredMaintenance = filterDataByProperty(state.maintenance, state.selectedProperty);
  
  if (filters.status) {
    filteredMaintenance = filteredMaintenance.filter(item => item.status === filters.status);
  }
  if (filters.priority) {
    filteredMaintenance = filteredMaintenance.filter(item => item.priority === filters.priority);
  }
  if (filters.issue) {
    filteredMaintenance = filteredMaintenance.filter(item => 
      item.issue.toLowerCase().includes(filters.issue.toLowerCase())
    );
  }

  const handleUpdateStatus = (item, newStatus) => {
    dispatch({
      type: 'UPDATE_MAINTENANCE_STATUS',
      payload: {
        id: item.id,
        status: newStatus
      }
    });
  };

  const handleAssignMaintenance = (item) => {
    // Find available maintenance staff with relevant skills
    const availableStaff = state.staff.maintenance.people.filter(person => {
      if (!person.available) return false;
      
      // Check if staff has relevant skills for the issue
      const issueType = item.issue.toLowerCase();
      if (issueType.includes('hvac') && person.skills.includes('HVAC')) return true;
      if (issueType.includes('plumbing') && person.skills.includes('plumbing')) return true;
      if (issueType.includes('electrical') && person.skills.includes('electrical')) return true;
      
      return true; // Generic assignment if no specific skill match
    });
    
    if (availableStaff.length === 0) {
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          message: 'No maintenance staff currently available',
          type: 'warning'
        }
      });
      return;
    }

    const assignedStaff = availableStaff[0];
    
    dispatch({
      type: 'ASSIGN_MAINTENANCE',
      payload: {
        id: item.id,
        staffId: assignedStaff.id,
        staffName: assignedStaff.name
      }
    });
  };

  const handleRemind = (item) => {
    dispatch({
      type: 'ADD_MAINTENANCE_NOTE',
      payload: {
        id: item.id,
        note: `Reminder sent via maintenance dashboard at ${new Date().toLocaleString()}`
      }
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.open}`}>
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

  const columns = [
    {
      key: 'issue',
      label: 'Issue',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {state.properties.find(p => p.id === row.propertyId)?.name}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Created: {new Date(row.createdAt).toLocaleDateString()}
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
      render: (value) => {
        if (!value) return <span className="text-gray-400">Unassigned</span>;
        const staff = state.staff.maintenance.people.find(p => p.id === value);
        return staff ? staff.name : 'Unknown';
      }
    },
    {
      key: 'notes',
      label: 'Notes',
      render: (value) => value && value.length > 0 ? `${value.length} note(s)` : '-'
    }
  ];

  const getActions = (item) => {
    const actions = [];

    if (item.status === 'open') {
      actions.push({
        label: 'Assign',
        onClick: () => handleAssignMaintenance(item),
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
      });
      actions.push({
        label: 'Start Work',
        onClick: () => handleUpdateStatus(item, 'in-progress'),
        className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800'
      });
    }

    if (item.status === 'in-progress') {
      actions.push({
        label: 'Mark Resolved',
        onClick: () => handleUpdateStatus(item, 'resolved'),
        className: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
      });
    }

    actions.push({
      label: 'Remind',
      onClick: () => handleRemind(item),
      className: 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800'
    });

    return actions;
  };

  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'open', label: 'Open' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' }
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
      key: 'issue',
      label: 'Issue',
      type: 'text',
      placeholder: 'Search issues...'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Maintenance Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track and manage maintenance requests and work orders
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {state.metrics.maintenance.open}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Open Requests
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {state.metrics.maintenance.inProgress}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            In Progress
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {state.metrics.maintenance.resolved}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Resolved
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {state.staff.maintenance.people.filter(p => p.available).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Available Staff
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Filters
        filters={filterOptions}
        onFilterChange={setFilters}
        onReset={() => setFilters({})}
      />

      {/* Maintenance Requests Table */}
      <Card title="Maintenance Requests" subtitle={`${filteredMaintenance.length} requests`}>
        <Table
          columns={columns}
          data={filteredMaintenance}
          actions={filteredMaintenance.map(item => getActions(item))}
        />
      </Card>
    </div>
  );
}
