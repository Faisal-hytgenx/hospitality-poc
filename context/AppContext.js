'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import { calculateAggregateMetrics, calculateHousekeepingMetrics, calculateMaintenanceMetrics } from '@/lib/calc';

// Import initial data
import propertiesData from '@/data/properties.json';
import staffData from '@/data/staff.json';
import guestMetricsData from '@/data/guestMetrics.json';
import roomsData from '@/data/rooms.json';
import maintenanceData from '@/data/maintenance.json';
import revenueTimeseriesData from '@/data/revenueTimeseries.json';

const AppContext = createContext();

const initialState = {
  properties: propertiesData,
  staff: staffData,
  guestMetrics: guestMetricsData,
  rooms: roomsData,
  maintenance: maintenanceData,
  revenueTimeseries: revenueTimeseriesData,
  selectedProperty: 'all',
  settings: {
    darkMode: false,
    alerts: {
      occupancyThreshold: 0.7,
      satisfactionThreshold: 4.0,
      maintenanceReminders: true
    }
  },
  toasts: [],
  metrics: {
    aggregate: {},
    housekeeping: {},
    maintenance: {}
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_PERSISTED_STATE':
      return {
        ...state,
        ...action.payload,
        metrics: calculateMetrics({
          ...state,
          ...action.payload
        })
      };

    case 'RESET_DATA':
      const resetState = {
        ...initialState,
        settings: state.settings // Keep settings
      };
      return {
        ...resetState,
        metrics: calculateMetrics(resetState)
      };

    case 'SET_SELECTED_PROPERTY':
      return {
        ...state,
        selectedProperty: action.payload
      };

    case 'UPDATE_ROOM_STATUS':
      const updatedRooms = state.rooms.map(room =>
        room.room === action.payload.room && room.propertyId === action.payload.propertyId
          ? { ...room, status: action.payload.status, assignedTo: action.payload.assignedTo || room.assignedTo }
          : room
      );
      const newStateRooms = {
        ...state,
        rooms: updatedRooms
      };
      return {
        ...newStateRooms,
        metrics: calculateMetrics(newStateRooms)
      };

    case 'ASSIGN_ROOM':
      const assignedRooms = state.rooms.map(room =>
        room.room === action.payload.room
          ? { ...room, assignedTo: action.payload.staffId, status: 'in-progress' }
          : room
      );
      const assignedState = {
        ...state,
        rooms: assignedRooms
      };
      return {
        ...assignedState,
        metrics: calculateMetrics(assignedState),
        toasts: [...state.toasts, {
          id: Date.now(),
          message: `Assigned ${action.payload.staffName} to Room ${action.payload.room}`,
          type: 'success'
        }]
      };

    case 'UPDATE_MAINTENANCE_STATUS':
      const updatedMaintenance = state.maintenance.map(item =>
        item.id === action.payload.id
          ? { ...item, status: action.payload.status, assignedTo: action.payload.assignedTo || item.assignedTo }
          : item
      );
      const maintenanceState = {
        ...state,
        maintenance: updatedMaintenance
      };
      return {
        ...maintenanceState,
        metrics: calculateMetrics(maintenanceState),
        toasts: [...state.toasts, {
          id: Date.now(),
          message: `Updated maintenance request status to ${action.payload.status}`,
          type: 'success'
        }]
      };

    case 'ADD_MAINTENANCE_NOTE':
      const notedMaintenance = state.maintenance.map(item =>
        item.id === action.payload.id
          ? {
              ...item,
              notes: [...item.notes, {
                timestamp: new Date().toISOString(),
                note: action.payload.note
              }]
            }
          : item
      );
      return {
        ...state,
        maintenance: notedMaintenance,
        toasts: [...state.toasts, {
          id: Date.now(),
          message: 'Added reminder note to maintenance request',
          type: 'info'
        }]
      };

    case 'ASSIGN_MAINTENANCE':
      const assignedMaintenance = state.maintenance.map(item =>
        item.id === action.payload.id
          ? { ...item, assignedTo: action.payload.staffId, status: 'in-progress' }
          : item
      );
      return {
        ...state,
        maintenance: assignedMaintenance,
        toasts: [...state.toasts, {
          id: Date.now(),
          message: `Assigned ${action.payload.staffName} to maintenance request`,
          type: 'success'
        }]
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };

    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, {
          id: Date.now(),
          ...action.payload
        }]
      };

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };

    default:
      return state;
  }
}

function calculateMetrics(state) {
  const aggregate = calculateAggregateMetrics(state.properties, state.rooms, state.maintenance);
  const housekeeping = calculateHousekeepingMetrics(state.rooms);
  const maintenance = calculateMaintenanceMetrics(state.maintenance);

  return {
    aggregate,
    housekeeping,
    maintenance
  };
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    metrics: calculateMetrics(initialState)
  });

  // Load persisted state on mount
  useEffect(() => {
    const persistedRooms = loadFromStorage('hospitality_rooms', state.rooms);
    const persistedMaintenance = loadFromStorage('hospitality_maintenance', state.maintenance);
    const persistedSettings = loadFromStorage('hospitality_settings', state.settings);
    const persistedProperty = loadFromStorage('hospitality_selectedProperty', state.selectedProperty);

    if (persistedRooms !== state.rooms || 
        persistedMaintenance !== state.maintenance || 
        persistedSettings !== state.settings ||
        persistedProperty !== state.selectedProperty) {
      dispatch({
        type: 'LOAD_PERSISTED_STATE',
        payload: {
          rooms: persistedRooms,
          maintenance: persistedMaintenance,
          settings: persistedSettings,
          selectedProperty: persistedProperty
        }
      });
    }
  }, []);

  // Persist state changes
  useEffect(() => {
    saveToStorage('hospitality_rooms', state.rooms);
    saveToStorage('hospitality_maintenance', state.maintenance);
    saveToStorage('hospitality_settings', state.settings);
    saveToStorage('hospitality_selectedProperty', state.selectedProperty);
  }, [state.rooms, state.maintenance, state.settings, state.selectedProperty]);

  // Auto-remove toasts after 5 seconds
  useEffect(() => {
    state.toasts.forEach(toast => {
      if (toast.id) {
        setTimeout(() => {
          dispatch({ type: 'REMOVE_TOAST', payload: toast.id });
        }, 5000);
      }
    });
  }, [state.toasts]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
