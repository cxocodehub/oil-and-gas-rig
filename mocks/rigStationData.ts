import { RigStation, AlertNotification, MaintenanceTask, AnalyticsData } from '@/types';

// Helper function to generate random values within a range
const randomValue = (min: number, max: number) => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
};

// Helper function to generate random status
const randomStatus = () => {
  const statuses = ['normal', 'warning', 'critical'];
  const weights = [0.7, 0.2, 0.1]; // 70% normal, 20% warning, 10% critical
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) return statuses[i] as 'normal' | 'warning' | 'critical';
  }
  return 'normal' as 'normal';
};

// Helper function to generate random equipment status
const randomEquipmentStatus = () => {
  const statuses = ['operational', 'maintenance', 'offline', 'warning', 'critical'];
  const weights = [0.6, 0.15, 0.05, 0.15, 0.05];
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) return statuses[i] as 'operational' | 'maintenance' | 'offline' | 'warning' | 'critical';
  }
  return 'operational' as 'operational';
};

// Generate a date string in the past or future
const generateDate = (daysOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

// Generate mock rig stations data
export const mockRigStations: RigStation[] = [
  {
    id: 'rig-001',
    name: 'North Sea Platform Alpha',
    location: {
      latitude: 57.8,
      longitude: 1.2,
      name: 'North Sea, UK Continental Shelf',
    },
    status: 'operational',
    equipment: [
      {
        id: 'eq-001',
        name: 'Main Drilling Unit',
        type: 'Drilling Equipment',
        status: 'operational',
        lastMaintenance: generateDate(-30),
        nextMaintenance: generateDate(15),
        healthScore: 87,
        location: 'Deck 3, Section A',
        sensors: [
          {
            id: 'sensor-001',
            name: 'Pressure Sensor',
            value: randomValue(800, 1200),
            unit: 'PSI',
            status: randomStatus(),
            timestamp: new Date().toISOString(),
            min: 800,
            max: 1200,
          },
          {
            id: 'sensor-002',
            name: 'Temperature Sensor',
            value: randomValue(50, 90),
            unit: '°C',
            status: randomStatus(),
            timestamp: new Date().toISOString(),
            min: 50,
            max: 90,
          },
          {
            id: 'sensor-003',
            name: 'Vibration Sensor',
            value: randomValue(0, 5),
            unit: 'mm/s',
            status: randomStatus(),
            timestamp: new Date().toISOString(),
            min: 0,
            max: 5,
          },
        ],
      },
      {
        id: 'eq-002',
        name: 'Mud Pump System',
        type: 'Fluid Management',
        status: 'warning',
        lastMaintenance: generateDate(-45),
        nextMaintenance: generateDate(5),
        healthScore: 72,
        location: 'Deck 2, Section B',
        sensors: [
          {
            id: 'sensor-004',
            name: 'Flow Rate',
            value: randomValue(400, 600),
            unit: 'GPM',
            status: 'warning',
            timestamp: new Date().toISOString(),
            min: 400,
            max: 600,
          },
          {
            id: 'sensor-005',
            name: 'Pressure Sensor',
            value: randomValue(300, 500),
            unit: 'PSI',
            status: randomStatus(),
            timestamp: new Date().toISOString(),
            min: 300,
            max: 500,
          },
        ],
      },
      {
        id: 'eq-003',
        name: 'Power Generator',
        type: 'Power Systems',
        status: 'operational',
        lastMaintenance: generateDate(-15),
        nextMaintenance: generateDate(45),
        healthScore: 94,
        location: 'Deck 1, Section C',
        sensors: [
          {
            id: 'sensor-006',
            name: 'Output Voltage',
            value: randomValue(440, 460),
            unit: 'V',
            status: randomStatus(),
            timestamp: new Date().toISOString(),
            min: 440,
            max: 460,
          },
          {
            id: 'sensor-007',
            name: 'Frequency',
            value: randomValue(59, 61),
            unit: 'Hz',
            status: randomStatus(),
            timestamp: new Date().toISOString(),
            min: 59,
            max: 61,
          },
          {
            id: 'sensor-008',
            name: 'Temperature',
            value: randomValue(70, 90),
            unit: '°C',
            status: randomStatus(),
            timestamp: new Date().toISOString(),
            min: 70,
            max: 90,
          },
        ],
      },
    ],
    environmentalData: {
      windSpeed: randomValue(5, 25),
      humidity: randomValue(60, 90),
      temperature: randomValue(5, 25),
      pressure: randomValue(990, 1020),
      seismicActivity: randomValue(0, 2),
    },
    safetyStatus: {
      gasLeakDetection: Math.random() > 0.95,
      fireDetection: Math.random() > 0.98,
      emergencySystemsActive: false,
      complianceScore: randomValue(85, 100),
      lastInspection: generateDate(-60),
      nextInspection: generateDate(30),
    },
    productionData: {
      oilProduction: randomValue(8000, 12000),
      gasProduction: randomValue(15000, 25000),
      waterProduction: randomValue(2000, 5000),
      efficiency: randomValue(75, 95),
    },
    crew: {
      onsite: Math.floor(randomValue(80, 120)),
      capacity: 150,
      shifts: {
        current: 'Day Shift',
        next: 'Night Shift',
      },
    },
  },
  {
    id: 'rig-002',
    name: 'Gulf of Mexico Platform Beta',
    location: {
      latitude: 28.5,
      longitude: -89.2,
      name: 'Gulf of Mexico, US Waters',
    },
    status: 'maintenance',
    equipment: [
      {
        id: 'eq-004',
        name: 'BOP Stack',
        type: 'Safety Equipment',
        status: 'maintenance',
        lastMaintenance: generateDate(-90),
        nextMaintenance: generateDate(0),
        healthScore: 65,
        location: 'Subsea',
        sensors: [
          {
            id: 'sensor-009',
            name: 'Hydraulic Pressure',
            value: randomValue(2800, 3200),
            unit: 'PSI',
            status: 'warning',
            timestamp: new Date().toISOString(),
            min: 2800,
            max: 3200,
          },
          {
            id: 'sensor-010',
            name: 'Accumulator Pressure',
            value: randomValue(2900, 3100),
            unit: 'PSI',
            status: randomStatus(),
            timestamp: new Date().toISOString(),
            min: 2900,
            max: 3100,
          },
        ],
      },
      {
        id: 'eq-005',
        name: 'Riser System',
        type: 'Drilling Equipment',
        status: 'operational',
        lastMaintenance: generateDate(-20),
        nextMaintenance: generateDate(40),
        healthScore: 88,
        location: 'Deck to Seabed',
        sensors: [
          {
            id: 'sensor-011',
            name: 'Tension',
            value: randomValue(900, 1100),
            unit: 'kN',
            status: randomStatus(),
            timestamp: new Date().toISOString(),
            min: 900,
            max: 1100,
          },
          {
            id: 'sensor-012',
            name: 'Angle',
            value: randomValue(0, 3),
            unit: '°',
            status: randomStatus(),
            timestamp: new Date().toISOString(),
            min: 0,
            max: 3,
          },
        ],
      },
    ],
    environmentalData: {
      windSpeed: randomValue(10, 30),
      humidity: randomValue(70, 95),
      temperature: randomValue(20, 35),
      pressure: randomValue(1000, 1015),
      seismicActivity: randomValue(0, 1),
    },
    safetyStatus: {
      gasLeakDetection: Math.random() > 0.9,
      fireDetection: false,
      emergencySystemsActive: true,
      complianceScore: randomValue(80, 95),
      lastInspection: generateDate(-45),
      nextInspection: generateDate(15),
    },
    productionData: {
      oilProduction: randomValue(5000, 9000),
      gasProduction: randomValue(10000, 18000),
      waterProduction: randomValue(3000, 6000),
      efficiency: randomValue(65, 85),
    },
    crew: {
      onsite: Math.floor(randomValue(60, 100)),
      capacity: 120,
      shifts: {
        current: 'Night Shift',
        next: 'Day Shift',
      },
    },
  },
  {
    id: 'rig-003',
    name: 'Caspian Sea Platform Gamma',
    location: {
      latitude: 40.1,
      longitude: 51.5,
      name: 'Caspian Sea, Azerbaijan',
    },
    status: 'warning',
    equipment: [
      {
        id: 'eq-006',
        name: 'Topside Processing Unit',
        type: 'Processing Equipment',
        status: 'warning',
        lastMaintenance: generateDate(-60),
        nextMaintenance: generateDate(10),
        healthScore: 68,
        location: 'Deck 4, Section A',
        sensors: [
          {
            id: 'sensor-013',
            name: 'Separator Pressure',
            value: randomValue(180, 220),
            unit: 'PSI',
            status: 'warning',
            timestamp: new Date().toISOString(),
            min: 180,
            max: 220,
          },
          {
            id: 'sensor-014',
            name: 'Oil Temperature',
            value: randomValue(60, 80),
            unit: '°C',
            status: randomStatus(),
            timestamp: new Date().toISOString(),
            min: 60,
            max: 80,
          },
        ],
      },
      {
        id: 'eq-007',
        name: 'Compressor System',
        type: 'Gas Management',
        status: 'critical',
        lastMaintenance: generateDate(-75),
        nextMaintenance: generateDate(5),
        healthScore: 52,
        location: 'Deck 3, Section B',
        sensors: [
          {
            id: 'sensor-015',
            name: 'Discharge Pressure',
            value: randomValue(1800, 2200),
            unit: 'PSI',
            status: 'critical',
            timestamp: new Date().toISOString(),
            min: 1800,
            max: 2200,
          },
          {
            id: 'sensor-016',
            name: 'Vibration',
            value: randomValue(4, 8),
            unit: 'mm/s',
            status: 'warning',
            timestamp: new Date().toISOString(),
            min: 0,
            max: 5,
          },
          {
            id: 'sensor-017',
            name: 'Bearing Temperature',
            value: randomValue(85, 105),
            unit: '°C',
            status: 'warning',
            timestamp: new Date().toISOString(),
            min: 70,
            max: 90,
          },
        ],
      },
    ],
    environmentalData: {
      windSpeed: randomValue(15, 35),
      humidity: randomValue(50, 80),
      temperature: randomValue(10, 30),
      pressure: randomValue(995, 1010),
      seismicActivity: randomValue(0, 3),
    },
    safetyStatus: {
      gasLeakDetection: true,
      fireDetection: false,
      emergencySystemsActive: true,
      complianceScore: randomValue(70, 85),
      lastInspection: generateDate(-90),
      nextInspection: generateDate(0),
    },
    productionData: {
      oilProduction: randomValue(7000, 11000),
      gasProduction: randomValue(12000, 20000),
      waterProduction: randomValue(4000, 7000),
      efficiency: randomValue(60, 80),
    },
    crew: {
      onsite: Math.floor(randomValue(70, 110)),
      capacity: 130,
      shifts: {
        current: 'Day Shift',
        next: 'Night Shift',
      },
    },
  },
];

// Generate mock alerts
export const mockAlerts: AlertNotification[] = [
  {
    id: 'alert-001',
    title: 'High Pressure Warning',
    message: 'Pressure exceeding normal operating range in Main Drilling Unit.',
    type: 'warning',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    read: false,
    relatedEquipment: 'eq-001',
  },
  {
    id: 'alert-002',
    title: 'Critical Compressor Vibration',
    message: 'Excessive vibration detected in Compressor System. Immediate inspection required.',
    type: 'critical',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    read: true,
    relatedEquipment: 'eq-007',
  },
  {
    id: 'alert-003',
    title: 'Gas Leak Detected',
    message: 'Potential gas leak detected on Caspian Sea Platform Gamma. Safety protocols activated.',
    type: 'critical',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    read: false,
  },
  {
    id: 'alert-004',
    title: 'Maintenance Due',
    message: 'Scheduled maintenance for Mud Pump System is due in 5 days.',
    type: 'info',
    timestamp: new Date(Date.now() - 360 * 60000).toISOString(),
    read: true,
    relatedEquipment: 'eq-002',
  },
  {
    id: 'alert-005',
    title: 'Weather Advisory',
    message: 'Strong winds expected in North Sea region. Prepare for potential operational adjustments.',
    type: 'warning',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    read: false,
  },
];

// Generate mock maintenance tasks
export const mockMaintenanceTasks: MaintenanceTask[] = [
  {
    id: 'task-001',
    equipmentId: 'eq-002',
    title: 'Mud Pump Inspection',
    description: 'Perform comprehensive inspection and maintenance of mud pump system components.',
    priority: 'high',
    status: 'scheduled',
    scheduledDate: generateDate(5),
    assignedTo: ['John Smith', 'Maria Rodriguez'],
    estimatedDuration: 8,
  },
  {
    id: 'task-002',
    equipmentId: 'eq-007',
    title: 'Compressor Overhaul',
    description: 'Complete overhaul of compressor system due to critical vibration issues.',
    priority: 'critical',
    status: 'in-progress',
    scheduledDate: generateDate(0),
    assignedTo: ['Robert Johnson', 'Ahmed Hassan', 'Sarah Williams'],
    estimatedDuration: 24,
  },
  {
    id: 'task-003',
    equipmentId: 'eq-004',
    title: 'BOP Testing',
    description: 'Conduct pressure and function testing of BOP stack as per regulatory requirements.',
    priority: 'high',
    status: 'scheduled',
    scheduledDate: generateDate(2),
    assignedTo: ['Michael Chen', 'David Wilson'],
    estimatedDuration: 12,
  },
  {
    id: 'task-004',
    equipmentId: 'eq-001',
    title: 'Drilling Unit Routine Maintenance',
    description: 'Perform routine maintenance checks and lubrication of main drilling unit components.',
    priority: 'medium',
    status: 'scheduled',
    scheduledDate: generateDate(15),
    assignedTo: ['Lisa Brown'],
    estimatedDuration: 6,
  },
  {
    id: 'task-005',
    equipmentId: 'eq-006',
    title: 'Separator Inspection',
    description: 'Inspect and clean topside processing unit separators.',
    priority: 'medium',
    status: 'scheduled',
    scheduledDate: generateDate(10),
    assignedTo: ['James Taylor', 'Emma Davis'],
    estimatedDuration: 10,
  },
];

// Generate mock analytics data
export const mockAnalyticsData: AnalyticsData = {
  timeframe: 'monthly',
  productionTrend: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [9500, 10200, 9800, 10500, 11000, 10800],
  },
  efficiencyTrend: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [82, 85, 83, 87, 89, 86],
  },
  maintenanceCosts: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [120000, 95000, 150000, 110000, 130000, 105000],
  },
  energyConsumption: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [450000, 470000, 460000, 480000, 500000, 490000],
  },
  emissionData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [28000, 27500, 28500, 29000, 29500, 28800],
  },
};

// Function to generate updated sensor data
export const generateUpdatedSensorData = () => {
  const updatedStations = mockRigStations.map(station => {
    const updatedEquipment = station.equipment.map(equipment => {
      const updatedSensors = equipment.sensors.map(sensor => {
        // Add some random fluctuation to the sensor value
        const fluctuation = (sensor.max - sensor.min) * 0.05; // 5% of range
        let newValue = sensor.value + randomValue(-fluctuation, fluctuation);
        
        // Ensure value stays within min-max range
        newValue = Math.max(sensor.min, Math.min(sensor.max, newValue));
        
        // Determine status based on how close to limits
        let status: 'normal' | 'warning' | 'critical' = 'normal';
        const range = sensor.max - sensor.min;
        const lowerWarningThreshold = sensor.min + range * 0.15;
        const upperWarningThreshold = sensor.max - range * 0.15;
        const lowerCriticalThreshold = sensor.min + range * 0.05;
        const upperCriticalThreshold = sensor.max - range * 0.05;
        
        if (newValue <= lowerCriticalThreshold || newValue >= upperCriticalThreshold) {
          status = 'critical';
        } else if (newValue <= lowerWarningThreshold || newValue >= upperWarningThreshold) {
          status = 'warning';
        }
        
        return {
          ...sensor,
          value: Math.round(newValue * 100) / 100,
          status,
          timestamp: new Date().toISOString(),
        };
      });
      
      // Update equipment status based on sensors
      let equipmentStatus = equipment.status;
      const hasCritical = updatedSensors.some(s => s.status === 'critical');
      const hasWarning = updatedSensors.some(s => s.status === 'warning');
      
      if (hasCritical) {
        equipmentStatus = 'critical';
      } else if (hasWarning) {
        equipmentStatus = 'warning';
      } else if (equipmentStatus !== 'maintenance' && equipmentStatus !== 'offline') {
        equipmentStatus = 'operational';
      }
      
      return {
        ...equipment,
        sensors: updatedSensors,
        status: equipmentStatus as 'operational' | 'maintenance' | 'offline' | 'warning' | 'critical',
      };
    });
    
    // Update station status based on equipment
    let stationStatus = station.status;
    const hasCriticalEquipment = updatedEquipment.some(e => e.status === 'critical');
    const hasWarningEquipment = updatedEquipment.some(e => e.status === 'warning');
    
    if (hasCriticalEquipment) {
      stationStatus = 'critical';
    } else if (hasWarningEquipment) {
      stationStatus = 'warning';
    } else if (stationStatus !== 'maintenance' && stationStatus !== 'offline') {
      stationStatus = 'operational';
    }
    
    // Update environmental data
    const updatedEnvironmentalData = {
      windSpeed: randomValue(station.environmentalData.windSpeed * 0.9, station.environmentalData.windSpeed * 1.1),
      humidity: randomValue(station.environmentalData.humidity * 0.95, station.environmentalData.humidity * 1.05),
      temperature: randomValue(station.environmentalData.temperature * 0.95, station.environmentalData.temperature * 1.05),
      pressure: randomValue(station.environmentalData.pressure * 0.99, station.environmentalData.pressure * 1.01),
      seismicActivity: randomValue(0, station.environmentalData.seismicActivity * 1.5),
    };
    
    // Update production data
    const updatedProductionData = {
      oilProduction: randomValue(station.productionData.oilProduction * 0.95, station.productionData.oilProduction * 1.05),
      gasProduction: randomValue(station.productionData.gasProduction * 0.95, station.productionData.gasProduction * 1.05),
      waterProduction: randomValue(station.productionData.waterProduction * 0.95, station.productionData.waterProduction * 1.05),
      efficiency: randomValue(station.productionData.efficiency * 0.98, station.productionData.efficiency * 1.02),
    };
    
    return {
      ...station,
      equipment: updatedEquipment,
      status: stationStatus as 'operational' | 'maintenance' | 'offline' | 'warning' | 'critical',
      environmentalData: updatedEnvironmentalData,
      productionData: updatedProductionData,
    };
  });
  
  return updatedStations;
};