'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { filterDataByProperty } from '@/lib/calc';
import Card from '@/components/Card';
import Table from '@/components/Table';
import Filters from '@/components/Filters';

export default function HousekeepingPage() {
  const { state, dispatch } = useApp();
  const [filters, setFilters] = useState({});

  // Filter rooms based on selected property and additional filters
  let filteredRooms = filterDataByProperty(state.rooms, state.selectedProperty);
  
  if (filters.status) {
    filteredRooms = filteredRooms.filter(room => room.status === filters.status);
  }
  if (filters.room) {
    filteredRooms = filteredRooms.filter(room => 
      room.room.toLowerCase().includes(filters.room.toLowerCase())
    );
  }

  const handleAssignRoom = (room) => {
    // Find available housekeeping staff
    const availableStaff = state.staff.housekeeping.people.filter(person => 
      person.available && person.skills.includes('cleaning')
    );
    
    if (availableStaff.length === 0) {
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          message: 'No housekeeping staff currently available',
          type: 'warning'
        }
      });
      return;
    }

    const assignedStaff = availableStaff[0];
    
    dispatch({
      type: 'ASSIGN_ROOM',
      payload: {
        room: room.room,
        staffId: assignedStaff.id,
        staffName: assignedStaff.name
      }
    });
  };

  const handleMarkCleaned = (room) => {
    dispatch({
      type: 'UPDATE_ROOM_STATUS',
      payload: {
        room: room.room,
        propertyId: room.propertyId,
        status: 'cleaned'
      }
    });
  };

  const handleFlagMaintenance = (room) => {
    dispatch({
      type: 'UPDATE_ROOM_STATUS',
      payload: {
        room: room.room,
        propertyId: room.propertyId,
        status: 'maintenance-required'
      }
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      cleaned: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'maintenance-required': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  const columns = [
    {
      key: 'room',
      label: 'Room',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {state.properties.find(p => p.id === row.propertyId)?.name}
          </div>
        </div>
      )
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
        const staff = state.staff.housekeeping.people.find(p => p.id === value);
        return staff ? staff.name : 'Unknown';
      }
    },
    {
      key: 'note',
      label: 'Notes',
      render: (value) => value || '-'
    }
  ];

  const actions = [
    {
      label: 'Assign',
      onClick: handleAssignRoom,
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
    },
    {
      label: 'Mark Cleaned',
      onClick: handleMarkCleaned,
      className: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
    },
    {
      label: 'Flag Maintenance',
      onClick: handleFlagMaintenance,
      className: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
    }
  ];

  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'cleaned', label: 'Cleaned' },
        { value: 'pending', label: 'Pending' },
        { value: 'maintenance-required', label: 'Maintenance Required' },
        { value: 'in-progress', label: 'In Progress' }
      ]
    },
    {
      key: 'room',
      label: 'Room',
      type: 'text',
      placeholder: 'Search room number...'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Housekeeping Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage room status and housekeeping assignments
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {state.metrics.housekeeping.cleaned}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Cleaned
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {state.metrics.housekeeping.pending}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Pending
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {state.metrics.housekeeping.maintenanceRequired}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Maintenance Required
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {state.staff.housekeeping.people.filter(p => p.available).length}
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

      {/* Rooms Table */}
      <Card title="Rooms" subtitle={`${filteredRooms.length} rooms`}>
        <Table
          columns={columns}
          data={filteredRooms}
          actions={actions}
        />
      </Card>
    </div>
  );
}
