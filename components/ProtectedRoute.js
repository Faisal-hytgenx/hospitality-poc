'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

// Define route access by role
const routeAccess = {
  '/': ['admin'],
  '/housekeeping': ['admin', 'gm'],
  '/maintenance': ['admin', 'gm'],
  '/revenue': ['admin', 'gm'],
  '/chat': ['admin', 'gm'],
  '/tasks': ['admin', 'gm'],
  '/settings': ['admin', 'gm'],
  '/gm': ['gm'],
  '/gm/assign-tasks': ['gm'],
  '/owner-dashboard': ['owner'],
  '/owner-dashboard/staff': ['owner'],
  '/staff-dashboard': ['staff'],
  '/staff-dashboard/tasks': ['staff']
};

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/login');
      } else {
        // Check if user has access to current route
        const allowedRoles = routeAccess[pathname] || [];
        if (!allowedRoles.includes(user.role)) {
          // Redirect to appropriate dashboard based on role
          switch (user.role) {
            case 'admin':
              router.push('/');
              break;
            case 'gm':
              router.push('/gm');
              break;
            case 'owner':
              router.push('/owner-dashboard');
              break;
            case 'staff':
              router.push('/staff-dashboard');
              break;
            default:
              router.push('/login');
          }
        }
      }
    }
  }, [user, loading, pathname, router]);

  // Show nothing while checking auth
  if (loading) return null;

  // If we're at login page, always render
  if (pathname === '/login') return children;

  // If no user, don't render anything (will redirect)
  if (!user) return null;

  // If user doesn't have access to this route, don't render
  const allowedRoles = routeAccess[pathname] || [];
  if (!allowedRoles.includes(user.role)) return null;

  // User has access, render the page
  return children;
}
