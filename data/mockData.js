// Mock data for all roles and views

export const mockStaff = {
  housekeeping: [
    { 
      id: 'hk-1', 
      name: 'Alex Johnson', 
      skills: ['Room Cleaning', 'Deep Clean', 'Laundry'],
      available: true, 
      property: 'hyatt-san-antonio-nw',
      propertyName: 'Hyatt Place San Antonio NW Medical Center',
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
      property: 'holiday-inn-san-antonio-nw',
      propertyName: 'Holiday Inn San Antonio NW',
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
      property: 'hyatt-san-antonio-nw',
      propertyName: 'Hyatt Place San Antonio NW Medical Center',
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
      property: 'holiday-inn-san-antonio-nw',
      propertyName: 'Holiday Inn San Antonio NW',
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
      property: 'hyatt-san-antonio-nw',
      propertyName: 'Hyatt Place San Antonio NW Medical Center',
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
      property: 'hyatt-san-antonio-nw',
      propertyName: 'Hyatt Place San Antonio NW Medical Center',
      description: 'Full room cleaning and sanitization',
      assignedAt: '2024-01-20T10:00:00',
      estimatedDuration: '45 mins',
      notes: 'VIP guest arriving today',
      type: 'room-cleaning',
      location: 'Floor 3',
      assignedTo: null,
      assignedToId: null
    },
    {
      id: 2,
      title: 'Restock Supplies',
      status: 'in-progress',
      priority: 'medium',
      dueTime: '3:30 PM',
      property: 'hyatt-san-antonio-nw',
      propertyName: 'Hyatt Place San Antonio NW Medical Center',
      description: 'Restock cleaning supplies in storage',
      assignedAt: '2024-01-20T09:00:00',
      estimatedDuration: '30 mins',
      type: 'restocking',
      location: 'Storage Room',
      assignedTo: 'Alex Johnson',
      assignedToId: 'hk-1'
    },
    {
      id: 3,
      title: 'Deep Clean Room 205',
      status: 'completed',
      priority: 'high',
      dueTime: '12:00 PM',
      property: 'holiday-inn-san-antonio-nw',
      propertyName: 'Holiday Inn San Antonio NW',
      description: 'Deep cleaning after guest checkout',
      assignedAt: '2024-01-20T08:00:00',
      completedAt: '2024-01-20T11:45:00',
      type: 'deep-clean',
      location: 'Floor 2',
      assignedTo: 'Jamie Smith',
      assignedToId: 'hk-2'
    }
  ],
  maintenance: [
    {
      id: 1,
      title: 'Fix AC in Room 205',
      status: 'pending',
      priority: 'high',
      dueTime: '1:00 PM',
      property: 'holiday-inn-san-antonio-nw',
      propertyName: 'Holiday Inn San Antonio NW',
      description: 'AC not cooling properly',
      assignedAt: '2024-01-20T10:30:00',
      estimatedDuration: '60 mins',
      type: 'repair',
      equipment: ['toolbox', 'ladder'],
      location: 'Floor 2',
      assignedTo: null,
      assignedToId: null
    },
    {
      id: 2,
      title: 'Check Plumbing',
      status: 'in-progress',
      priority: 'medium',
      dueTime: '4:30 PM',
      property: 'holiday-inn-san-antonio-nw',
      propertyName: 'Holiday Inn San Antonio NW',
      description: 'Routine plumbing inspection',
      assignedAt: '2024-01-20T09:30:00',
      estimatedDuration: '90 mins',
      type: 'inspection',
      location: 'All Floors',
      assignedTo: 'Riley Wilson',
      assignedToId: 'mt-1'
    },
    {
      id: 3,
      title: 'Replace Light Fixtures',
      status: 'completed',
      priority: 'low',
      dueTime: '11:00 AM',
      property: 'hyatt-san-antonio-nw',
      propertyName: 'Hyatt Place San Antonio NW Medical Center',
      description: 'Replace old light fixtures in hallway',
      assignedAt: '2024-01-20T09:00:00',
      completedAt: '2024-01-20T10:30:00',
      type: 'replacement',
      location: 'Floor 1 Hallway',
      assignedTo: 'Sam Davis',
      assignedToId: 'mt-2'
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
  'hyatt-san-antonio-nw': {
    name: 'Hyatt Place San Antonio NW Medical Center',
    rooms: 120,
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
  'holiday-inn-san-antonio-nw': {
    name: 'Holiday Inn San Antonio NW',
    rooms: 100,
    staff: 20,
    occupancyRate: '92%',
    revenue: '$98,300',
    guestSatisfaction: 4.9,
    taskCompletion: '98%',
    departments: {
      housekeeping: {
        staff: 12,
        tasksToday: 35,
        completionRate: '95%'
      },
      maintenance: {
        staff: 8,
        tasksToday: 8,
        completionRate: '96%'
      }
    }
  },
  'holiday-inn-stone-oak': {
    name: 'Holiday Inn San Antonio Stone Oak Area',
    rooms: 110,
    staff: 22,
    occupancyRate: '85%',
    revenue: '$156,800',
    guestSatisfaction: 4.7,
    taskCompletion: '94%',
    departments: {
      housekeeping: {
        staff: 13,
        tasksToday: 40,
        completionRate: '93%'
      },
      maintenance: {
        staff: 9,
        tasksToday: 10,
        completionRate: '91%'
      }
    }
  }
};
