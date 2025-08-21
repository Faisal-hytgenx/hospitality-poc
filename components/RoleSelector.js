'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const roles = [
  { id: 'admin', label: 'Admin', description: 'System Administrator' },
  { id: 'gm', label: 'General Manager', description: 'Property Management' },
  { id: 'owner', label: 'Property Owner', description: 'Owner Dashboard' }
];

export default function RoleSelector() {
  const { user, currentRole, setCurrentRole } = useAuth();
  const [activeRole, setActiveRole] = useState(currentRole || user?.role || 'admin');

  const handleRoleChange = (roleId) => {
    setActiveRole(roleId);
    if (setCurrentRole) {
      setCurrentRole(roleId);
    }
  };

  // Sync local state with context state
  useEffect(() => {
    if (currentRole && currentRole !== activeRole) {
      setActiveRole(currentRole);
    }
  }, [currentRole, activeRole]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Role Selection
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Switch between different views
        </span>
      </div>
      
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleChange(role.id)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeRole === role.id
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="text-center">
              <div className="font-medium">{role.label}</div>
              <div className="text-xs opacity-75">{role.description}</div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
        Currently viewing as: <span className="font-medium text-blue-600 dark:text-blue-400">
          {roles.find(r => r.id === activeRole)?.label}
        </span>
      </div>
    </div>
  );
}
