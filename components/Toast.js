'use client';

import { useApp } from '@/context/AppContext';

export default function Toast() {
  const { state, dispatch } = useApp();

  const getToastStyles = (type) => {
    const baseStyles = 'mb-2 p-4 rounded-md shadow-md border-l-4 flex items-center justify-between';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 dark:bg-green-900 border-green-400 text-green-800 dark:text-green-200`;
      case 'error':
        return `${baseStyles} bg-red-50 dark:bg-red-900 border-red-400 text-red-800 dark:text-red-200`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 dark:bg-yellow-900 border-yellow-400 text-yellow-800 dark:text-yellow-200`;
      case 'info':
      default:
        return `${baseStyles} bg-blue-50 dark:bg-blue-900 border-blue-400 text-blue-800 dark:text-blue-200`;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  if (state.toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      {state.toasts.map((toast) => (
        <div key={toast.id} className={getToastStyles(toast.type)}>
          <div className="flex items-center">
            <span className="text-lg mr-2">{getIcon(toast.type)}</span>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}
            className="ml-4 text-lg hover:opacity-70"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
