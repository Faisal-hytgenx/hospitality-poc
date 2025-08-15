'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/Card';
import Table from '@/components/Table';
import { revenueData } from '@/data/revenueData';

export default function RevenuePage() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  const getTrendBadge = (trend) => {
    const styles = {
      increasing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      decreasing: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      stable: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[trend]}`}>
        {trend.charAt(0).toUpperCase() + trend.slice(1)}
      </span>
    );
  };

  const getProgressBar = (value, max) => {
    const percentage = (value / max) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  const competitorColumns = [
    {
      key: 'name',
      label: 'Property',
      render: (value) => (
        <div className={value === 'Our Properties' ? 'font-semibold text-blue-600' : ''}>
          {value}
        </div>
      )
    },
    {
      key: 'marketShare',
      label: 'Market Share',
      render: (value) => `${value}%`
    },
    {
      key: 'avgRate',
      label: 'Avg. Daily Rate',
      render: (value) => `$${value}`
    }
  ];

  const channelColumns = [
    {
      key: 'channel',
      label: 'Booking Channel'
    },
    {
      key: 'percentage',
      label: 'Distribution',
      render: (value) => `${value}%`
    },
    {
      key: 'trend',
      label: 'Trend',
      render: (value) => getTrendBadge(value)
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Revenue Analytics</h1>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card 
          title="Monthly Revenue" 
          value={`$${(revenueData.trends.last30Days.total/1000).toFixed(1)}K`}
          trend="+12.5%"
          trendUp={true}
          subtitle="vs Last Month"
        />
        <Card 
          title="Occupancy Rate" 
          value={`${revenueData.trends.last30Days.metrics.occupancyRate}%`}
          trend="+5.2%"
          trendUp={true}
          subtitle="Current Period"
        />
        <Card 
          title="RevPAR" 
          value={`$${revenueData.trends.last30Days.metrics.revPAR}`}
          trend="+8.3%"
          trendUp={true}
          subtitle="Revenue Per Room"
        />
        <Card 
          title="Market Share" 
          value={`${revenueData.competitiveAnalysis.marketShare}%`}
          trend="+2.1%"
          trendUp={true}
          subtitle="In Local Market"
        />
      </div>

      {/* AI Insights and Forecast */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#101828] rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">AI Revenue Forecast</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 mb-1">Next Month Prediction</p>
              <p className="text-2xl font-bold text-white">${(revenueData.forecast.nextMonth.predictedRevenue/1000).toFixed(1)}K</p>
              <p className="text-sm text-gray-400">Confidence: {revenueData.forecast.nextMonth.confidence}%</p>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400 mb-2">Key Factors:</p>
              {revenueData.forecast.nextMonth.factors.map((factor, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">{factor.name}</span>
                  <span className="text-green-400">{factor.impact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#101828] rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Key Insights</h2>
          <div className="space-y-4">
            {revenueData.keyInsights.map((insight, index) => (
              <div key={index} className="border-b border-gray-700 pb-4 last:border-0">
                <h3 className="text-blue-400 font-medium">{insight.title}</h3>
                <p className="text-gray-300 text-sm mt-1">{insight.insight}</p>
                <p className="text-gray-400 text-sm mt-1">→ {insight.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Position */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Competitive Analysis</h2>
          <Table 
            data={revenueData.competitiveAnalysis.competitors}
            columns={competitorColumns}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Booking Channel Distribution</h2>
          <Table 
            data={revenueData.bookingPatterns.channelDistribution}
            columns={channelColumns}
          />
        </div>
      </div>

      {/* Revenue Goals */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">2025 Revenue Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-2">Yearly Target: ${(revenueData.revenueGoals.yearly.target/1000000).toFixed(1)}M</p>
            <div className="mb-4">
              {getProgressBar(
                revenueData.revenueGoals.yearly.current,
                revenueData.revenueGoals.yearly.target
              )}
              <p className="text-sm text-gray-500 mt-1">
                Progress: {revenueData.revenueGoals.yearly.progress}%
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(revenueData.revenueGoals.keyMetrics).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">{key.toUpperCase()}</p>
                <p className="text-xl font-semibold">
                  {key === 'avgDailyRate' ? '$' : ''}{value.current}
                  {key === 'occupancy' ? '%' : ''}
                </p>
                <p className="text-sm text-gray-500">
                  Target: {key === 'avgDailyRate' ? '$' : ''}{value.target}
                  {key === 'occupancy' ? '%' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}