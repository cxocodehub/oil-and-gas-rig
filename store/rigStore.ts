import { create } from 'zustand';
import { RigStation, AlertNotification, MaintenanceTask, AnalyticsData } from '@/types';
import { mockRigStations, mockAlerts, mockMaintenanceTasks, mockAnalyticsData, generateUpdatedSensorData } from '@/mocks/rigStationData';

interface RigState {
  stations: RigStation[];
  selectedStationId: string | null;
  alerts: AlertNotification[];
  maintenanceTasks: MaintenanceTask[];
  analyticsData: AnalyticsData;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchStations: () => Promise<void>;
  updateSensorData: () => void;
  selectStation: (stationId: string) => void;
  markAlertAsRead: (alertId: string) => void;
  updateMaintenanceTaskStatus: (taskId: string, status: MaintenanceTask['status']) => void;
}

export const useRigStore = create<RigState>((set, get) => ({
  stations: [],
  selectedStationId: null,
  alerts: [],
  maintenanceTasks: [],
  analyticsData: mockAnalyticsData,
  isLoading: false,
  error: null,
  
  fetchStations: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({
        stations: mockRigStations,
        alerts: mockAlerts,
        maintenanceTasks: mockMaintenanceTasks,
        isLoading: false,
        selectedStationId: mockRigStations[0]?.id || null,
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch rig stations data',
        isLoading: false 
      });
    }
  },
  
  updateSensorData: () => {
    // Generate updated sensor data with random fluctuations
    const updatedStations = generateUpdatedSensorData();
    set({ stations: updatedStations });
  },
  
  selectStation: (stationId: string) => {
    set({ selectedStationId: stationId });
  },
  
  markAlertAsRead: (alertId: string) => {
    set(state => ({
      alerts: state.alerts.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    }));
  },
  
  updateMaintenanceTaskStatus: (taskId: string, status: MaintenanceTask['status']) => {
    set(state => ({
      maintenanceTasks: state.maintenanceTasks.map(task => 
        task.id === taskId ? { ...task, status } : task
      )
    }));
  },
}));