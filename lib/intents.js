// AI Chatbot intent detection and handlers

export const detectIntent = (message) => {
  const msg = message.toLowerCase();
  
  // Housekeeping intents
  if (msg.includes('housekeeping') && (msg.includes('status') || msg.includes('today'))) {
    return { type: 'housekeeping_status', confidence: 0.9 };
  }
  
  // Maintenance intents
  if (msg.includes('maintenance') && (msg.includes('pending') || msg.includes('requests'))) {
    return { type: 'maintenance_pending', confidence: 0.9 };
  }
  
  // Guest satisfaction
  if (msg.includes('guest') && msg.includes('satisfaction')) {
    return { type: 'guest_satisfaction', confidence: 0.9 };
  }
  
  // Assignment intents
  if (msg.includes('assign') && (msg.includes('cleaning') || msg.includes('room'))) {
    const roomMatch = msg.match(/room\s+(\d+)/i);
    return { 
      type: 'assign_cleaning', 
      confidence: 0.8,
      params: { room: roomMatch ? roomMatch[1] : null }
    };
  }
  
  // Remind intents
  if (msg.includes('remind') && msg.includes('maintenance')) {
    const roomMatch = msg.match(/room\s+(\d+)/i);
    return { 
      type: 'remind_maintenance', 
      confidence: 0.8,
      params: { room: roomMatch ? roomMatch[1] : null }
    };
  }
  
  // Update status intents
  if (msg.includes('update') && msg.includes('status')) {
    const roomMatch = msg.match(/room\s+(\d+)/i);
    return { 
      type: 'update_status', 
      confidence: 0.7,
      params: { room: roomMatch ? roomMatch[1] : null }
    };
  }
  
  // Occupancy intents
  if (msg.includes('occupancy')) {
    if (msg.includes('week')) {
      return { type: 'occupancy_week', confidence: 0.8 };
    }
    return { type: 'occupancy_current', confidence: 0.8 };
  }
  
  // ADR comparison
  if (msg.includes('adr') && msg.includes('compare')) {
    return { type: 'adr_comparison', confidence: 0.8 };
  }
  
  // RevPAR trends
  if (msg.includes('revpar') && msg.includes('trend')) {
    return { type: 'revpar_trends', confidence: 0.8 };
  }
  
  // Alert setup
  if (msg.includes('alert') || msg.includes('notify')) {
    if (msg.includes('occupancy')) {
      return { type: 'setup_occupancy_alert', confidence: 0.7 };
    }
    if (msg.includes('satisfaction')) {
      return { type: 'setup_satisfaction_alert', confidence: 0.7 };
    }
    if (msg.includes('maintenance')) {
      return { type: 'setup_maintenance_alert', confidence: 0.7 };
    }
  }
  
  return { type: 'unknown', confidence: 0.0 };
};

export const executeIntent = (intent, state, dispatch) => {
  switch (intent.type) {
    case 'housekeeping_status':
      return handleHousekeepingStatus(state);
    
    case 'maintenance_pending':
      return handleMaintenancePending(state);
    
    case 'guest_satisfaction':
      return handleGuestSatisfaction(state);
    
    case 'assign_cleaning':
      return handleAssignCleaning(intent.params, state, dispatch);
    
    case 'remind_maintenance':
      return handleRemindMaintenance(intent.params, state, dispatch);
    
    case 'update_status':
      return handleUpdateStatus(intent.params, state, dispatch);
    
    case 'occupancy_current':
      return handleOccupancyCurrent(state);
    
    case 'occupancy_week':
      return handleOccupancyWeek(state);
    
    case 'adr_comparison':
      return handleADRComparison(state);
    
    case 'revpar_trends':
      return handleRevPARTrends(state);
    
    default:
      return {
        response: "I'm not sure how to help with that. I can assist with housekeeping status, maintenance requests, guest satisfaction, task assignments, and revenue analytics.",
        action: null
      };
  }
};

// Intent handlers
const handleHousekeepingStatus = (state) => {
  const { cleaned, pending, maintenanceRequired } = state.metrics.housekeeping;
  return {
    response: `Current housekeeping status: ${cleaned} rooms cleaned, ${pending} pending, ${maintenanceRequired} requiring maintenance.`,
    action: { type: 'navigate', path: '/housekeeping' }
  };
};

const handleMaintenancePending = (state) => {
  const pendingCount = state.maintenance.filter(item => item.status === 'open').length;
  return {
    response: `There are ${pendingCount} pending maintenance requests.`,
    action: { type: 'navigate', path: '/maintenance' }
  };
};

const handleGuestSatisfaction = (state) => {
  return {
    response: `Current guest satisfaction score is ${state.guestMetrics.satisfaction}/5.0 with an average response time of ${state.guestMetrics.avgResponseMins} minutes.`,
    action: null
  };
};

const handleAssignCleaning = (params, state, dispatch) => {
  if (!params.room) {
    return {
      response: "Please specify which room you'd like to assign cleaning to.",
      action: null
    };
  }
  
  // Find available housekeeping staff
  const availableStaff = state.staff.housekeeping.people.filter(person => 
    person.available && person.skills.includes('cleaning')
  );
  
  if (availableStaff.length === 0) {
    return {
      response: `No housekeeping staff currently available for Room ${params.room}.`,
      action: null
    };
  }
  
  const assignedStaff = availableStaff[0];
  
  // Mock assignment
  dispatch({
    type: 'ASSIGN_ROOM',
    payload: {
      room: params.room,
      staffId: assignedStaff.id,
      staffName: assignedStaff.name
    }
  });
  
  return {
    response: `Assigned ${assignedStaff.name} to clean Room ${params.room}.`,
    action: { type: 'navigate', path: '/tasks' }
  };
};

const handleRemindMaintenance = (params, state, dispatch) => {
  if (!params.room) {
    return {
      response: "Please specify which room needs a maintenance reminder.",
      action: null
    };
  }
  
  const maintenanceItem = state.maintenance.find(item => 
    item.issue.includes(params.room)
  );
  
  if (!maintenanceItem) {
    return {
      response: `No maintenance request found for Room ${params.room}.`,
      action: null
    };
  }
  
  dispatch({
    type: 'ADD_MAINTENANCE_NOTE',
    payload: {
      id: maintenanceItem.id,
      note: `Reminder sent via chatbot at ${new Date().toISOString()}`
    }
  });
  
  return {
    response: `Reminder sent for maintenance issue in Room ${params.room}.`,
    action: { type: 'navigate', path: '/maintenance' }
  };
};

const handleUpdateStatus = (params, state, dispatch) => {
  return {
    response: "Status updates can be made from the Tasks or Maintenance pages.",
    action: { type: 'navigate', path: '/tasks' }
  };
};

const handleOccupancyCurrent = (state) => {
  const occupancy = (state.metrics.aggregate.occupancyRate * 100).toFixed(1);
  return {
    response: `Current overall occupancy rate is ${occupancy}%.`,
    action: { type: 'navigate', path: '/revenue' }
  };
};

const handleOccupancyWeek = (state) => {
  // Calculate weekly average from recent data
  const recentData = state.revenueTimeseries.slice(-7);
  const avgOccupancy = recentData.reduce((sum, day) => sum + day.occupancy, 0) / recentData.length;
  
  return {
    response: `Average occupancy for the past week is ${(avgOccupancy * 100).toFixed(1)}%.`,
    action: { type: 'navigate', path: '/revenue' }
  };
};

const handleADRComparison = (state) => {
  const currentADR = state.metrics.aggregate.adr.toFixed(2);
  return {
    response: `Current average daily rate (ADR) is $${currentADR}. You can view detailed comparisons on the revenue page.`,
    action: { type: 'navigate', path: '/revenue' }
  };
};

const handleRevPARTrends = (state) => {
  const currentRevPAR = state.metrics.aggregate.revpar.toFixed(2);
  return {
    response: `Current RevPAR is $${currentRevPAR}. View 30-day trends on the revenue analytics page.`,
    action: { type: 'navigate', path: '/revenue' }
  };
};
