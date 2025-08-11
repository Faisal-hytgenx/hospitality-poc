'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { filterDataByProperty, formatCurrency, formatPercentage } from '@/lib/calc';
import Card from '@/components/Card';
import Chart from '@/components/Chart';
import KPI from '@/components/KPI';

export default function RevenuePage() {
  const { state } = useApp();
  const [timeWindow, setTimeWindow] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState(['occupancy', 'adr', 'revpar']);

  // Dummy forecast data for POC
  const forecastData = [
    { period: 'Next 7 Days', occupancy: 0.87, adr: 155, revpar: 134.9, confidence: 92 },
    { period: 'Next 30 Days', occupancy: 0.84, adr: 152, revpar: 127.7, confidence: 85 },
    { period: 'Next Quarter', occupancy: 0.81, adr: 148, revpar: 119.9, confidence: 78 }
  ];

  // Dummy competitive analysis data
  const competitiveData = [
    { property: 'Our Properties (Avg)', occupancy: 0.83, adr: 145, revpar: 120.4, marketShare: '15.2%' },
    { property: 'Marriott Hotels', occupancy: 0.79, adr: 162, revpar: 128.0, marketShare: '22.1%' },
    { property: 'Hilton Hotels', occupancy: 0.81, adr: 158, revpar: 128.0, marketShare: '18.7%' },
    { property: 'IHG Hotels', occupancy: 0.77, adr: 142, revpar: 109.3, marketShare: '12.8%' },
    { property: 'Independent', occupancy: 0.74, adr: 138, revpar: 102.1, marketShare: '31.2%' }
  ];

  // Dummy seasonal trends
  const seasonalTrends = [
    { month: 'Jan', occupancy: 0.72, adr: 138, revpar: 99.4 },
    { month: 'Feb', occupancy: 0.78, adr: 142, revpar: 110.8 },
    { month: 'Mar', occupancy: 0.85, adr: 158, revpar: 134.3 },
    { month: 'Apr', occupancy: 0.88, adr: 165, revpar: 145.2 },
    { month: 'May', occupancy: 0.82, adr: 152, revpar: 124.6 },
    { month: 'Jun', occupancy: 0.79, adr: 148, revpar: 116.9 },
    { month: 'Jul', occupancy: 0.86, adr: 162, revpar: 139.3 },
    { month: 'Aug', occupancy: 0.84, adr: 159, revpar: 133.6 },
    { month: 'Sep', occupancy: 0.87, adr: 168, revpar: 146.2 },
    { month: 'Oct', occupancy: 0.91, adr: 172, revpar: 156.5 },
    { month: 'Nov', occupancy: 0.89, adr: 165, revpar: 146.9 },
    { month: 'Dec', occupancy: 0.85, adr: 155, revpar: 131.8 }
  ];

  // Filter revenue data based on selected property and time window
  const filteredData = useMemo(() => {
    let data = filterDataByProperty(state.revenueTimeseries, state.selectedProperty);
    
    const days = timeWindow === '7d' ? 7 : 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return data
      .filter(item => new Date(item.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [state.revenueTimeseries, state.selectedProperty, timeWindow]);

  // Calculate aggregated metrics for the time period
  const periodMetrics = useMemo(() => {
    if (filteredData.length === 0) return { occupancy: 0, adr: 0, revpar: 0 };

    const totalOccupancy = filteredData.reduce((sum, item) => sum + item.occupancy, 0);
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.revpar, 0);
    const avgADR = filteredData.reduce((sum, item) => sum + item.adr, 0) / filteredData.length;

    return {
      occupancy: totalOccupancy / filteredData.length,
      adr: avgADR,
      revpar: totalRevenue / filteredData.length
    };
  }, [filteredData]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const labels = filteredData.map(item => 
      new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    );

    const datasets = [];

    if (selectedMetrics.includes('occupancy')) {
      datasets.push({
        label: 'Occupancy Rate (%)',
        data: filteredData.map(item => (item.occupancy * 100).toFixed(1)),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y',
      });
    }

    if (selectedMetrics.includes('adr')) {
      datasets.push({
        label: 'ADR ($)',
        data: filteredData.map(item => item.adr),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        yAxisID: 'y1',
      });
    }

    if (selectedMetrics.includes('revpar')) {
      datasets.push({
        label: 'RevPAR ($)',
        data: filteredData.map(item => item.revpar),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        yAxisID: 'y1',
      });
    }

    return { labels, datasets };
  }, [filteredData, selectedMetrics]);

  const chartOptions = {
    scales: {
      y: {
        type: 'linear',
        display: selectedMetrics.includes('occupancy'),
        position: 'left',
        title: {
          display: true,
          text: 'Occupancy Rate (%)',
        },
        max: 100,
      },
      y1: {
        type: 'linear',
        display: selectedMetrics.includes('adr') || selectedMetrics.includes('revpar'),
        position: 'right',
        title: {
          display: true,
          text: 'Revenue ($)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Calculate trends (mock calculation for demo)
  const getTrend = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const handleMetricToggle = (metric) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Revenue Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track occupancy, ADR, and RevPAR trends across properties
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time Window
            </label>
            <select
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Show:
          </span>
          {[
            { key: 'occupancy', label: 'Occupancy', color: 'blue' },
            { key: 'adr', label: 'ADR', color: 'green' },
            { key: 'revpar', label: 'RevPAR', color: 'yellow' }
          ].map((metric) => (
            <button
              key={metric.key}
              onClick={() => handleMetricToggle(metric.key)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedMetrics.includes(metric.key)
                  ? `bg-${metric.color}-100 text-${metric.color}-800 dark:bg-${metric.color}-900 dark:text-${metric.color}-300`
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPI
          title={`Average Occupancy (${timeWindow})`}
          value={periodMetrics.occupancy}
          type="percentage"
          icon="🏨"
          trend={2.5}
        />
        <KPI
          title={`Average ADR (${timeWindow})`}
          value={periodMetrics.adr}
          type="currency"
          icon="💵"
          trend={1.8}
        />
        <KPI
          title={`Average RevPAR (${timeWindow})`}
          value={periodMetrics.revpar}
          type="currency"
          icon="📈"
          trend={4.2}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8">
        <Card title="Revenue Trends" subtitle={`${timeWindow === '7d' ? '7-day' : '30-day'} performance overview`}>
          <Chart
            data={chartData}
            options={chartOptions}
          />
        </Card>

        {/* Property Comparison */}
        {state.selectedProperty === 'all' && (
          <Card title="Property Comparison" subtitle="Current period performance by property">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {state.properties.map((property) => {
                const propertyData = filteredData.filter(item => item.propertyId === property.id);
                const avgOccupancy = propertyData.reduce((sum, item) => sum + item.occupancy, 0) / propertyData.length;
                const avgADR = propertyData.reduce((sum, item) => sum + item.adr, 0) / propertyData.length;
                const avgRevPAR = propertyData.reduce((sum, item) => sum + item.revpar, 0) / propertyData.length;

                return (
                  <div key={property.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      {property.name}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Occupancy:</span>
                        <span className="font-medium">{formatPercentage(avgOccupancy)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">ADR:</span>
                        <span className="font-medium">{formatCurrency(avgADR)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">RevPAR:</span>
                        <span className="font-medium">{formatCurrency(avgRevPAR)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Revenue Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Revenue Forecast */}
          <Card title="Revenue Forecast" subtitle="AI-powered predictions for upcoming periods">
            <div className="space-y-4">
              {forecastData.map((forecast, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {forecast.period}
                    </h4>
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {forecast.confidence}% confidence
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Occupancy</span>
                      <p className="font-medium">{formatPercentage(forecast.occupancy)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">ADR</span>
                      <p className="font-medium">{formatCurrency(forecast.adr)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">RevPAR</span>
                      <p className="font-medium">{formatCurrency(forecast.revpar)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Competitive Analysis */}
          <Card title="Competitive Analysis" subtitle="Market positioning vs. competitors">
            <div className="space-y-3">
              {competitiveData.map((comp, index) => (
                <div key={index} className={`p-3 rounded-lg ${comp.property.includes('Our') ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-800'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className={`font-medium ${comp.property.includes('Our') ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                      {comp.property}
                    </h4>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {comp.marketShare} market share
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Occ</span>
                      <p className="font-medium">{formatPercentage(comp.occupancy)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">ADR</span>
                      <p className="font-medium">{formatCurrency(comp.adr)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">RevPAR</span>
                      <p className="font-medium">{formatCurrency(comp.revpar)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Seasonal Trends */}
        <Card title="Seasonal Performance Trends" subtitle="12-month historical pattern analysis" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {seasonalTrends.map((month, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {month.month}
                </h4>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Occ: </span>
                    <span className="font-medium">{formatPercentage(month.occupancy)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">ADR: </span>
                    <span className="font-medium">{formatCurrency(month.adr)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">RevPAR: </span>
                    <span className="font-medium">{formatCurrency(month.revpar)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Revenue Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <Card title="Key Insights" subtitle="AI-generated revenue analysis">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <span className="text-green-600 dark:text-green-400 text-lg">📈</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Strong Q4 Performance
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    RevPAR increased 8.2% vs. last quarter
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 dark:text-blue-400 text-lg">🎯</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Pricing Optimization
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    ADR outperforming market by 12%
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-600 dark:text-yellow-400 text-lg">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Weekend Opportunities
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Saturday occupancy 15% below weekdays
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Booking Patterns" subtitle="Guest behavior analysis">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Direct Bookings</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">OTA Bookings</span>
                  <span className="font-medium">35%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Corporate</span>
                  <span className="font-medium">20%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Revenue Goals" subtitle="2025 targets and progress">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Annual RevPAR Target</span>
                  <span className="font-medium">$145.00</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '83%' }}></div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Current: $120.40 (83% of target)
                </p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Occupancy Target</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Current: 83% (98% of target)
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
