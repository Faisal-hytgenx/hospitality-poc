'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Housekeeping', href: '/housekeeping', icon: '🧹' },
  { name: 'Maintenance', href: '/maintenance', icon: '🔧' },
  { name: 'Tasks', href: '/tasks', icon: '📋' },
  { name: 'Revenue', href: '/revenue', icon: '💰' },
  { name: 'Chat', href: '/chat', icon: '💬' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { state, dispatch } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handlePropertyChange = (propertyId) => {
    dispatch({ type: 'SET_SELECTED_PROPERTY', payload: propertyId });
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sincere Hospitality
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Dashboard
              </p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      {/* Property Selector */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Property
          </label>
          <select
            value={state.selectedProperty}
            onChange={(e) => handlePropertyChange(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Properties</option>
            {state.properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>Demo Environment</p>
            <p>v1.0.0</p>
          </div>
        </div>
      )}
    </div>
  );
}
