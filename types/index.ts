export interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  timestamp: string;
  min: number;
  max: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'operational' | 'maintenance' | 'offline' | 'warning' | 'critical';
  lastMaintenance: string;
  nextMaintenance: string;
  healthScore: number;
  location: string;
  sensors: SensorData[];
}

export interface RigStation {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  status: 'operational' | 'maintenance' | 'offline' | 'warning' | 'critical';
  equipment: Equipment[];
  environmentalData: {
    windSpeed: number;
    humidity: number;
    temperature: number;
    pressure: number;
    seismicActivity: number;
  };
  safetyStatus: {
    gasLeakDetection: boolean;
    fireDetection: boolean;
    emergencySystemsActive: boolean;
    complianceScore: number;
    lastInspection: string;
    nextInspection: string;
  };
  productionData: {
    oilProduction: number;
    gasProduction: number;
    waterProduction: number;
    efficiency: number;
  };
  crew: {
    onsite: number;
    capacity: number;
    shifts: {
      current: string;
      next: string;
    };
  };
}

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'critical';
  timestamp: string;
  read: boolean;
  relatedEquipment?: string;
}

export interface MaintenanceTask {
  id: string;
  equipmentId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'in-progress' | 'completed' | 'delayed';
  scheduledDate: string;
  assignedTo: string[];
  estimatedDuration: number; // in hours
}

export interface AnalyticsData {
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly';
  productionTrend: {
    labels: string[];
    data: number[];
  };
  efficiencyTrend: {
    labels: string[];
    data: number[];
  };
  maintenanceCosts: {
    labels: string[];
    data: number[];
  };
  energyConsumption: {
    labels: string[];
    data: number[];
  };
  emissionData: {
    labels: string[];
    data: number[];
  };
}