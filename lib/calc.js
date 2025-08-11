// Utility functions for calculating KPIs and metrics

export const calculateAggregateMetrics = (properties, rooms, maintenance) => {
  const totalRooms = properties.reduce((sum, prop) => sum + prop.roomsTotal, 0);
  const totalOccupied = properties.reduce((sum, prop) => sum + Math.floor(prop.roomsTotal * prop.occupancyRate), 0);
  const avgOccupancyRate = totalOccupied / totalRooms;
  
  const weightedADR = properties.reduce((sum, prop) => sum + (prop.adr * prop.occupancyRate * prop.roomsTotal), 0) / totalOccupied;
  const avgRevPAR = properties.reduce((sum, prop) => sum + prop.revpar, 0) / properties.length;

  return {
    occupancyRate: avgOccupancyRate,
    adr: weightedADR,
    revpar: avgRevPAR,
    totalRooms
  };
};

export const calculateHousekeepingMetrics = (rooms) => {
  const cleaned = rooms.filter(room => room.status === 'cleaned').length;
  const pending = rooms.filter(room => room.status === 'pending').length;
  const maintenanceRequired = rooms.filter(room => room.status === 'maintenance-required').length;
  
  return { cleaned, pending, maintenanceRequired };
};

export const calculateMaintenanceMetrics = (maintenance) => {
  const open = maintenance.filter(item => item.status === 'open').length;
  const inProgress = maintenance.filter(item => item.status === 'in-progress').length;
  const resolved = maintenance.filter(item => item.status === 'resolved').length;
  
  return { open, inProgress, resolved };
};

export const filterDataByProperty = (data, propertyId) => {
  if (!propertyId || propertyId === 'all') return data;
  return data.filter(item => item.propertyId === propertyId);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatPercentage = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value);
};
