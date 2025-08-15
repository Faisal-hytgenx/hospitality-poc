// Mock data for all roles and views

export const mockStaff = {
  housekeeping: [
    { 
      id: 'hk-1', 
      name: 'Alex Johnson', 
      skills: ['Room Cleaning', 'Deep Clean', 'Laundry'],
      available: true, 
      property: 'property1',
      currentLocation: 'Floor 3',
      tasksCompleted: 145,
      rating: 4.8,
      efficiency: 98,
      attendance: 100,
      currentTask: 'Room 301 Cleaning',
      schedule: '9AM - 5PM',
      department: 'housekeeping'
    },
    { 
      id: 'hk-2', 
      name: 'Jamie Smith', 
      skills: ['Deep Clean', 'Inventory Management'],
      available: true, 
      property: 'property2',
      currentLocation: 'Floor 2',
      tasksCompleted: 132,
      rating: 4.9,
      efficiency: 95,
      attendance: 98,
      currentTask: 'Restocking Supplies',
      schedule: '8AM - 4PM',
      department: 'housekeeping'
    },
    { 
      id: 'hk-3', 
      name: 'Taylor Brown', 
      skills: ['Room Cleaning', 'Maintenance Support'],
      available: false, 
      property: 'property1',
      currentLocation: 'Floor 1',
      tasksCompleted: 128,
      rating: 4.7,
      efficiency: 94,
      attendance: 97,
      currentTask: 'Deep Cleaning Room 105',
      schedule: '10AM - 6PM',
      department: 'housekeeping'
    }
  ],
  maintenance: [
    { 
      id: 'mt-1', 
      name: 'Riley Wilson', 
      skills: ['HVAC', 'Electrical'],
      available: true, 
      property: 'property2',
      currentLocation: 'Basement',
      tasksCompleted: 89,
      rating: 4.9,
      efficiency: 97,
      attendance: 100,
      currentTask: 'AC Maintenance',
      schedule: '7AM - 3PM',
      department: 'maintenance'
    },
    { 
      id: 'mt-2', 
      name: 'Sam Davis', 
      skills: ['Plumbing', 'General Repairs'],
      available: false, 
      property: 'property1',
      currentLocation: 'Floor 4',
      tasksCompleted: 93,
      rating: 4.8,
      efficiency: 96,
      attendance: 99,
      currentTask: 'Fixing Shower in 402',
      schedule: '9AM - 5PM',
      department: 'maintenance'
    }
  ]
};

export const mockTasks = {
  housekeeping: [
    {
      id: 1,
      title: 'Clean Room 301',
      status: 'pending',
      priority: 'high',
      dueTime: '2:00 PM',
      property: 'property1',
      description: 'Full room cleaning and sanitization',
      assignedAt: '2024-01-20T10:00:00',
      estimatedDuration: '45 mins',
      notes: 'VIP guest arriving today',
      type: 'room-cleaning',
      location: 'Floor 3'
    },
    {
      id: 2,
      title: 'Restock Supplies',
      status: 'in-progress',
      priority: 'medium',
      dueTime: '3:30 PM',
      property: 'property1',
      description: 'Restock cleaning supplies in storage',
      assignedAt: '2024-01-20T09:00:00',
      estimatedDuration: '30 mins',
      type: 'restocking',
      location: 'Storage Room'
    },
    {
      id: 3,
      title: 'Deep Clean Room 205',
      status: 'completed',
      priority: 'high',
      dueTime: '12:00 PM',
      property: 'property1',
      description: 'Deep cleaning after guest checkout',
      assignedAt: '2024-01-20T08:00:00',
      completedAt: '2024-01-20T11:45:00',
      type: 'deep-clean',
      location: 'Floor 2'
    }
  ],
  maintenance: [
    {
      id: 1,
      title: 'Fix AC in Room 205',
      status: 'pending',
      priority: 'high',
      dueTime: '1:00 PM',
      property: 'property2',
      description: 'AC not cooling properly',
      assignedAt: '2024-01-20T10:30:00',
      estimatedDuration: '60 mins',
      type: 'repair',
      equipment: ['toolbox', 'ladder'],
      location: 'Floor 2'
    },
    {
      id: 2,
      title: 'Check Plumbing',
      status: 'in-progress',
      priority: 'medium',
      dueTime: '4:30 PM',
      property: 'property2',
      description: 'Routine plumbing inspection',
      assignedAt: '2024-01-20T09:30:00',
      estimatedDuration: '90 mins',
      type: 'inspection',
      location: 'All Floors'
    },
    {
      id: 3,
      title: 'Replace Light Fixtures',
      status: 'completed',
      priority: 'low',
      dueTime: '11:00 AM',
      property: 'property2',
      description: 'Replace old light fixtures in hallway',
      assignedAt: '2024-01-20T09:00:00',
      completedAt: '2024-01-20T10:30:00',
      type: 'replacement',
      location: 'Floor 1 Hallway'
    }
  ]
};

export const mockPerformance = {
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
      suppliesUsed: '92%',
      avgCleaningTime: '42 mins',
      qualityScore: '96%'
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
      partsUsed: '85%',
      avgRepairTime: '55 mins',
      firstTimeFixed: '94%'
    }
  }
};

export const mockProperties = {
  property1: {
    name: 'Luxury Hotel Downtown',
    rooms: 150,
    staff: 25,
    occupancyRate: '87%',
    revenue: '$124,500',
    guestSatisfaction: 4.8,
    taskCompletion: '96%',
    departments: {
      housekeeping: {
        staff: 15,
        tasksToday: 45,
        completionRate: '94%'
      },
      maintenance: {
        staff: 10,
        tasksToday: 12,
        completionRate: '92%'
      }
    }
  },
  property2: {
    name: 'Resort & Spa',
    rooms: 200,
    staff: 35,
    occupancyRate: '92%',
    revenue: '$156,800',
    guestSatisfaction: 4.9,
    taskCompletion: '98%',
    departments: {
      housekeeping: {
        staff: 20,
        tasksToday: 60,
        completionRate: '95%'
      },
      maintenance: {
        staff: 15,
        tasksToday: 18,
        completionRate: '96%'
      }
    }
  }
};
