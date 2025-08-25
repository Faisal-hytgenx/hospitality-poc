'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Table from '@/components/Table';

// Mock tasks data
const mockTasks = {
  housekeeping: [
    {
      id: 1,
      title: "Clean Room 301",
      status: "pending",
      priority: "high",
      dueTime: "2:00 PM",
      property: "Hyatt Place San Antonio NW Medical Center",
      description: "Full room cleaning and sanitization",
      location: "Floor 3"
    },
    {
      id: 2,
      title: "Restock Supplies",
      status: "in-progress",
      priority: "medium",
      dueTime: "3:30 PM",
      property: "Hyatt Place San Antonio NW Medical Center",
      description: "Restock cleaning supplies in storage",
      location: "Storage Room"
    },
    {
      id: 3,
      title: "Deep Clean Room 205",
      status: "completed",
      priority: "high",
      dueTime: "12:00 PM",
      property: "Holiday Inn San Antonio NW",
      description: "Deep cleaning after guest checkout",
      location: "Floor 2"
    }
  ],
  maintenance: [
    {
      id: 1,
      title: "Fix AC in Room 205",
      status: "pending",
      priority: "high",
      dueTime: "1:00 PM",
      property: "Holiday Inn San Antonio NW",
      description: "AC not cooling properly",
      location: "Floor 2"
    },
    {
      id: 2,
      title: "Check Plumbing",
      status: "in-progress",
      priority: "medium",
      dueTime: "4:30 PM",
      property: "Holiday Inn San Antonio NW",
      description: "Routine plumbing inspection",
      location: "All Floors"
    }
  ]
};

// Mock performance data
const mockPerformance = {
  housekeeping: {
    tasksCompleted: 145,
    rating: 4.8,
    efficiency: 98,
    attendance: 100,
    currentStreak: 15,
    monthlyTarget: 150,
    customerFeedback: 28,
    positiveReviews: 26,
    metrics: {
      roomsCleaned: 890,
      suppliesUsed: "92%",
      avgCleaningTime: "42 mins",
      qualityScore: "96%"
    }
  },
  maintenance: {
    tasksCompleted: 89,
    rating: 4.9,
    efficiency: 97,
    attendance: 100,
    currentStreak: 12,
    monthlyTarget: 90,
    customerFeedback: 22,
    positiveReviews: 21,
    metrics: {
      repairsCompleted: 245,
      partsUsed: "85%",
      avgRepairTime: "55 mins",
      firstTimeFixed: "94%"
    }
  }
};

export default function StaffDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    // Load tasks based on department
    const departmentTasks = mockTasks[user?.department] || [];
    setTasks(departmentTasks);

    // Load performance data
    const performanceData = mockPerformance[user?.department];
    setPerformance(performanceData);
  }, [user]);

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority] || styles.medium}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const columns = [
    {
      key: "title",
      label: "Task",
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {row.location}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {row.description}
          </div>
        </div>
      )
    },
    {
      key: "priority",
      label: "Priority",
      render: (value) => getPriorityBadge(value)
    },
    {
      key: "status",
      label: "Status",
      render: (value) => getStatusBadge(value)
    },
    {
      key: "dueTime",
      label: "Due Time"
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <h1 className="text-lg "><span className="font-bold">Property:</span> Luxury Hotel Downtown</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card 
          title="Performance Score" 
          value={`${performance?.efficiency || 0}%`}
          subtitle="Overall Efficiency"
          trend="+2.5%"
          trendUp={true}
        />
        <Card 
          title="Task Completion" 
          value={`${((performance?.tasksCompleted / performance?.monthlyTarget) * 100).toFixed(0)}%`}
          subtitle={`${performance?.tasksCompleted || 0} of ${performance?.monthlyTarget || 0} Tasks`}
          trend="+5.8%"
          trendUp={true}
        />
        <Card 
          title="Customer Rating" 
          value={`${performance?.rating || 0} ★`}
          subtitle={`${performance?.positiveReviews || 0} Positive Reviews`}
          trend="+0.2"
          trendUp={true}
        />
        <Card 
          title="Attendance Streak" 
          value={`${performance?.currentStreak || 0} Days`}
          subtitle="Perfect Attendance"
          trend="+3 days"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card 
          title="Tasks Today" 
          value={tasks.length}
          subtitle="Assigned Tasks"
        />
        <Card 
          title="Completed" 
          value={performance?.tasksCompleted || 0}
          subtitle="This Month"
        />
        <Card 
          title="Feedback" 
          value={performance?.customerFeedback || 0}
          subtitle="Customer Reviews"
        />
        <Card 
          title="Quality Score" 
          value={performance?.metrics?.qualityScore || performance?.metrics?.firstTimeFixed || "0%"}
          subtitle="Service Quality"
        />
      </div>

      <div className="bg-[#101828] rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Tasks Overview</h2>
        <Table 
          data={tasks}
          columns={columns}
        />
      </div>
    </div>
  );
}