'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/Card';
import Table from '@/components/Table';
import { mockTasks, mockPerformance } from '@/data/mockData';

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, in-progress, completed

  useEffect(() => {
    // Load tasks based on department
    const departmentTasks = mockTasks[user?.department] || [];
    setTasks(departmentTasks);
  }, [user]);

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
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
      'room-cleaning': 'bg-purple-100 text-purple-800',
      'restocking': 'bg-blue-100 text-blue-800',
      'common-area': 'bg-indigo-100 text-indigo-800',
      'repair': 'bg-orange-100 text-orange-800',
      'inspection': 'bg-teal-100 text-teal-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type] || 'bg-gray-100 text-gray-800'}`}>
        {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    );
  };

  const columns = [
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
      key: 'type',
      label: 'Type',
      render: (value) => getTypeBadge(value)
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
      key: 'dueTime',
      label: 'Due',
      render: (value, row) => (
        <div>
          <div>{value}</div>
          <div className="text-xs text-gray-500">
            Est. {row.estimatedDuration}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'pending'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'in-progress'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'completed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card 
          title="Total Tasks" 
          value={tasks.length} 
          subtitle="Assigned to You"
        />
        <Card 
          title="Pending" 
          value={tasks.filter(t => t.status === 'pending').length}
          subtitle="Need Attention"
        />
        <Card 
          title="In Progress" 
          value={tasks.filter(t => t.status === 'in-progress').length}
          subtitle="Currently Working"
        />
        <Card 
          title="Completed" 
          value={tasks.filter(t => t.status === 'completed').length}
          subtitle="Today&apos;s Finished Tasks"
        />
      </div>

      <div className="bg-[#101828] rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Task List</h2>
        <Table 
          data={filteredTasks}
          columns={columns}
        />
      </div>
    </div>
  );
}