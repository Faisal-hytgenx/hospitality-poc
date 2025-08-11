'use client';

import { useApp } from '@/context/AppContext';
import KPI from '@/components/KPI';
import Card from '@/components/Card';

export default function Dashboard() {
  const { state } = useApp();
  const { metrics, guestMetrics } = state;

  // Get recent alerts (mock for now)
  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Room 202 HVAC needs attention',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'info',
      message: '5 rooms pending housekeeping',
      timestamp: '30 minutes ago'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Executive Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Real-time operational overview for {state.selectedProperty === 'all' ? 'all properties' : state.properties.find(p => p.id === state.selectedProperty)?.name}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPI
          title="Occupancy Rate"
          value={metrics.aggregate.occupancyRate}
          type="percentage"
          icon="🏨"
          trend={2.5}
        />
        <KPI
          title="Average Daily Rate"
          value={metrics.aggregate.adr}
          type="currency"
          icon="💵"
          trend={1.2}
        />
        <KPI
          title="Revenue per Available Room"
          value={metrics.aggregate.revpar}
          type="currency"
          icon="📈"
          trend={3.8}
        />
        <KPI
          title="Guest Satisfaction"
          value={guestMetrics.satisfaction}
          subtitle="out of 5.0"
          icon="⭐"
          trend={0.5}
        />
      </div>

      {/* Operational Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card title="Housekeeping Status" subtitle="Current room status">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Cleaned</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {metrics.housekeeping.cleaned}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                {metrics.housekeeping.pending}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Maintenance Required</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {metrics.housekeeping.maintenanceRequired}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Maintenance Requests" subtitle="Current status overview">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Open</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {metrics.maintenance.open}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                {metrics.maintenance.inProgress}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Resolved</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {metrics.maintenance.resolved}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Guest Services" subtitle="Response metrics">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {guestMetrics.avgResponseMins} min
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Score</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {guestMetrics.satisfaction}/5.0
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Alerts" subtitle="System notifications">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-md border-l-4 ${
                  alert.type === 'warning'
                    ? 'bg-yellow-50 dark:bg-yellow-900 border-yellow-400'
                    : 'bg-blue-50 dark:bg-blue-900 border-blue-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {alert.message}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {alert.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick Actions" subtitle="Common tasks">
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 text-left rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="text-lg mb-1">🧹</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Assign Housekeeping
              </div>
            </button>
            <button className="p-3 text-left rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="text-lg mb-1">🔧</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Create Maintenance
              </div>
            </button>
            <button className="p-3 text-left rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="text-lg mb-1">📊</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                View Reports
              </div>
            </button>
            <button className="p-3 text-left rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="text-lg mb-1">💬</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Open Chat
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}