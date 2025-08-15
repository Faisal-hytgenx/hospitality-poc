'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LogoutButton from './LogoutButton';

const adminNavItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/housekeeping', label: 'Housekeeping' },
  { href: '/maintenance', label: 'Maintenance' },
  { href: '/revenue', label: 'Revenue' },
  { href: '/chat', label: 'Chat' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/settings', label: 'Settings' }
];

const ownerNavItems = [
  { href: '/owner-dashboard', label: 'Dashboard' },
  { href: '/owner-dashboard/staff', label: 'Staff Overview' }
];

const staffNavItems = [
  { href: '/staff-dashboard', label: 'Dashboard' },
  { href: '/staff-dashboard/tasks', label: 'My Tasks' }
];

// Mock properties data
const properties = [
  { id: 'property1', name: 'Luxury Hotel Downtown', staff: 25 },
  { id: 'property2', name: 'Resort & Spa', staff: 35 },
  { id: 'property3', name: 'Business Hotel Central', staff: 20 }
];

export default function Navigation() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [selectedProperty, setSelectedProperty] = useState(properties[0].id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get navigation items based on user role
  const navItems = user?.role === 'admin' 
    ? adminNavItems 
    : user?.role === 'owner'
    ? ownerNavItems
    : staffNavItems;

  return (
    <nav className="w-64 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {user?.role === 'admin' ? 'Admin Panel' :
             user?.role === 'owner' ? 'Owner Panel' : 'Staff Panel'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome, {user?.name}
          </p>
        </div>

        {user?.role === 'admin' && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Property
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-left focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {properties.find(p => p.id === selectedProperty)?.name}
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                  {properties.map((property) => (
                    <button
                      key={property.id}
                      onClick={() => {
                        setSelectedProperty(property.id);
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <div>{property.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {property.staff} Staff Members
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}