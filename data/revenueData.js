export const revenueData = {
  trends: {
    last30Days: {
      total: 281300,
      change: 12.5,
      breakdown: [
        { date: '2024-01-20', revenue: 9500, occupancy: 88 },
        { date: '2024-01-19', revenue: 9800, occupancy: 92 },
        { date: '2024-01-18', revenue: 9200, occupancy: 85 },
        { date: '2024-01-17', revenue: 9600, occupancy: 89 },
        { date: '2024-01-16', revenue: 9400, occupancy: 87 },
        // ... more daily data
      ],
      metrics: {
        avgDailyRate: 189,
        revPAR: 165,
        occupancyRate: 87
      }
    }
  },
  propertyComparison: {
    property1: {
      name: 'Luxury Hotel Downtown',
      currentPeriod: {
        revenue: 124500,
        occupancy: 87,
        avgDailyRate: 195,
        revPAR: 169,
        marketShare: 28
      },
      previousPeriod: {
        revenue: 115800,
        occupancy: 82,
        avgDailyRate: 188,
        revPAR: 154,
        marketShare: 26
      }
    },
    property2: {
      name: 'Resort & Spa',
      currentPeriod: {
        revenue: 156800,
        occupancy: 92,
        avgDailyRate: 210,
        revPAR: 193,
        marketShare: 32
      },
      previousPeriod: {
        revenue: 148500,
        occupancy: 88,
        avgDailyRate: 205,
        revPAR: 180,
        marketShare: 30
      }
    }
  },
  forecast: {
    nextMonth: {
      predictedRevenue: 295000,
      predictedOccupancy: 89,
      confidence: 92,
      factors: [
        { name: 'Seasonal Demand', impact: 'High Positive' },
        { name: 'Local Events', impact: 'Medium Positive' },
        { name: 'Market Trends', impact: 'Positive' }
      ]
    },
    nextQuarter: {
      predictedRevenue: 890000,
      predictedOccupancy: 85,
      confidence: 88
    }
  },
  competitiveAnalysis: {
    marketPosition: 2,
    marketShare: 28,
    competitors: [
      { name: 'Competitor A', marketShare: 32, avgRate: 198 },
      { name: 'Our Properties', marketShare: 28, avgRate: 189 },
      { name: 'Competitor B', marketShare: 25, avgRate: 175 },
      { name: 'Competitor C', marketShare: 15, avgRate: 160 }
    ],
    strengths: ['Location', 'Service Quality', 'Amenities'],
    opportunities: ['Corporate Partnerships', 'Package Deals']
  },
  seasonalTrends: {
    peakSeasons: [
      { name: 'Summer', months: ['Jun', 'Jul', 'Aug'], avgOccupancy: 94 },
      { name: 'Winter Holidays', months: ['Dec'], avgOccupancy: 96 }
    ],
    monthlyData: [
      { month: 'Jan', revenue: 250000, occupancy: 82 },
      { month: 'Feb', revenue: 235000, occupancy: 78 },
      { month: 'Mar', revenue: 275000, occupancy: 85 },
      { month: 'Apr', revenue: 290000, occupancy: 88 },
      { month: 'May', revenue: 310000, occupancy: 90 },
      { month: 'Jun', revenue: 350000, occupancy: 94 },
      { month: 'Jul', revenue: 365000, occupancy: 95 },
      { month: 'Aug', revenue: 355000, occupancy: 93 },
      { month: 'Sep', revenue: 315000, occupancy: 89 },
      { month: 'Oct', revenue: 285000, occupancy: 86 },
      { month: 'Nov', revenue: 270000, occupancy: 84 },
      { month: 'Dec', revenue: 360000, occupancy: 96 }
    ]
  },
  keyInsights: [
    {
      title: 'Revenue Growth',
      insight: 'Current month revenue is up 12.5% YoY',
      recommendation: 'Consider dynamic pricing for peak periods'
    },
    {
      title: 'Occupancy Optimization',
      insight: 'Midweek occupancy shows room for improvement',
      recommendation: 'Launch corporate traveler program'
    },
    {
      title: 'Market Position',
      insight: 'Strong position in luxury segment',
      recommendation: 'Expand premium amenities offering'
    }
  ],
  bookingPatterns: {
    channelDistribution: [
      { channel: 'Direct', percentage: 35, trend: 'increasing' },
      { channel: 'OTAs', percentage: 45, trend: 'stable' },
      { channel: 'Corporate', percentage: 15, trend: 'increasing' },
      { channel: 'Others', percentage: 5, trend: 'decreasing' }
    ],
    leadTime: {
      average: 23, // days
      segments: [
        { type: 'Leisure', avgLeadTime: 45 },
        { type: 'Business', avgLeadTime: 12 },
        { type: 'Groups', avgLeadTime: 60 }
      ]
    },
    guestSegments: [
      { type: 'Leisure', percentage: 55 },
      { type: 'Business', percentage: 30 },
      { type: 'Groups', percentage: 15 }
    ]
  },
  revenueGoals: {
    yearly: {
      target: 3800000,
      current: 2850000,
      progress: 75,
      breakdown: {
        Q1: { target: 800000, achieved: 760000 },
        Q2: { target: 950000, achieved: 920000 },
        Q3: { target: 1100000, achieved: 1070000 },
        Q4: { target: 950000, projected: 910000 }
      }
    },
    keyMetrics: {
      revPAR: { target: 185, current: 169 },
      occupancy: { target: 90, current: 87 },
      avgDailyRate: { target: 205, current: 195 }
    }
  }
};
