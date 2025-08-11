'use client';

import { useApp } from '@/context/AppContext';
import { clearStorage } from '@/lib/storage';
import Card from '@/components/Card';

export default function SettingsPage() {
  const { state, dispatch } = useApp();

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all demo data? This will clear all changes and restore the original state.')) {
      clearStorage();
      dispatch({ type: 'RESET_DATA' });
      dispatch({
        type: 'ADD_TOAST',
        payload: {
          message: 'Demo data has been reset successfully',
          type: 'success'
        }
      });
    }
  };

  const handleSettingChange = (key, value) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { [key]: value }
    });
  };

  const handleAlertSettingChange = (key, value) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        alerts: {
          ...state.settings.alerts,
          [key]: value
        }
      }
    });
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !state.settings.darkMode;
    handleSettingChange('darkMode', newDarkMode);
    
    // Apply dark mode to document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure dashboard preferences and demo controls
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appearance Settings */}
        <Card title="Appearance" subtitle="Customize the dashboard appearance">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Dark Mode
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Toggle between light and dark themes
                </p>
              </div>
              <button
                onClick={handleDarkModeToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  state.settings.darkMode
                    ? 'bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    state.settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Alert Settings */}
        <Card title="Alert Thresholds" subtitle="Configure when to receive notifications">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Occupancy Rate Alert Threshold
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={state.settings.alerts.occupancyThreshold}
                  onChange={(e) => handleAlertSettingChange('occupancyThreshold', parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[4rem]">
                  {(state.settings.alerts.occupancyThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Alert when occupancy falls below this threshold
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Guest Satisfaction Alert Threshold
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="3.0"
                  max="5.0"
                  step="0.1"
                  value={state.settings.alerts.satisfactionThreshold}
                  onChange={(e) => handleAlertSettingChange('satisfactionThreshold', parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[3rem]">
                  {state.settings.alerts.satisfactionThreshold.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Alert when satisfaction score falls below this threshold
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Maintenance Reminders
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Daily reminders for pending maintenance issues
                </p>
              </div>
              <button
                onClick={() => handleAlertSettingChange('maintenanceReminders', !state.settings.alerts.maintenanceReminders)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  state.settings.alerts.maintenanceReminders
                    ? 'bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    state.settings.alerts.maintenanceReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Demo Controls */}
        <Card title="Demo Controls" subtitle="Reset and manage demo data">
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Demo Environment
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <p>
                      This is a demonstration environment. All data changes are stored locally 
                      and will be lost when you clear your browser data.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleResetData}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Reset Demo Data
            </button>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p className="mb-2"><strong>This will reset:</strong></p>
              <ul className="space-y-1 ml-4">
                <li>• All room statuses</li>
                <li>• All maintenance requests</li>
                <li>• Task assignments</li>
                <li>• Custom settings (except appearance)</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* System Information */}
        <Card title="System Information" subtitle="Dashboard details and status">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Version:</span>
                <span className="ml-2 font-medium">1.0.0</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Environment:</span>
                <span className="ml-2 font-medium">Demo</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Properties:</span>
                <span className="ml-2 font-medium">{state.properties.length}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Total Rooms:</span>
                <span className="ml-2 font-medium">
                  {state.properties.reduce((sum, prop) => sum + prop.roomsTotal, 0)}
                </span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Current Status
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Active Tasks:</span>
                  <span className="font-medium">
                    {state.metrics.housekeeping.pending + state.metrics.maintenance.open}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Staff Available:</span>
                  <span className="font-medium">
                    {state.staff.housekeeping.people.filter(p => p.available).length + 
                     state.staff.maintenance.people.filter(p => p.available).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
