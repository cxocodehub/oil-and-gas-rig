import { WellDrillingData, DrillingSensor, DirectionalData, FormationData, ParameterLog } from '@/types/drilling';
import { ColorValue } from 'react-native';

// Helper function to create a drilling sensor with mock data
const createDrillingSensor = (
  id: string,
  name: string,
  value: number,
  unit: string,
  min: number,
  max: number,
  trend: number[] = []
): DrillingSensor => {
  // Generate random status based on how close to limits
  let status: 'normal' | 'warning' | 'critical' = 'normal';
  const range = max - min;
  const lowerWarningThreshold = min + range * 0.15;
  const upperWarningThreshold = max - range * 0.15;
  const lowerCriticalThreshold = min + range * 0.05;
  const upperCriticalThreshold = max - range * 0.05;
  
  if (value <= lowerCriticalThreshold || value >= upperCriticalThreshold) {
    status = 'critical';
  } else if (value <= lowerWarningThreshold || value >= upperWarningThreshold) {
    status = 'warning';
  }
  
  return {
    id,
    name,
    value,
    unit,
    status,
    timestamp: new Date().toISOString(),
    min,
    max,
    trend: trend.length > 0 ? trend : generateTrendData(value, min, max, 20)
  };
};

// Generate random trend data
const generateTrendData = (currentValue: number, min: number, max: number, points: number): number[] => {
  const result: number[] = [];
  let value = currentValue;
  const range = max - min;
  
  for (let i = 0; i < points; i++) {
    // Add some random fluctuation
    const fluctuation = range * 0.05; // 5% of range
    value += (Math.random() - 0.5) * fluctuation;
    
    // Ensure value stays within min-max range
    value = Math.max(min, Math.min(max, value));
    
    result.unshift(Math.round(value * 100) / 100);
  }
  
  return result;
};

// Generate depth and timestamp logs
const generateDepthLog = (currentDepth: number, points: number): { depth: number[], timestamp: string[] } => {
  const depth: number[] = [];
  const timestamp: string[] = [];
  let depthValue = currentDepth;
  
  // Generate timestamps at 15-minute intervals going backward from now
  const now = new Date();
  
  for (let i = 0; i < points; i++) {
    // Each point represents going back in time and decreasing depth
    const timePoint = new Date(now.getTime() - i * 15 * 60 * 1000);
    timestamp.unshift(timePoint.toISOString());
    
    // Decrease depth as we go back in time (with some randomness)
    const depthDecrease = 0.5 + Math.random() * 1.5; // 0.5 to 2 meters per 15 minutes
    depthValue -= depthDecrease;
    depth.unshift(Math.round(depthValue * 10) / 10);
  }
  
  return { depth, timestamp };
};

// Generate parameter logs with depth correlation
const generateParameterLog = <T extends number>(
  paramName: string,
  values: T[],
  depths: number[],
  timestamps: string[]
): ParameterLog<T> => {
  // Create a properly typed object with the correct structure
  const result = {
    depth: depths,
    timestamp: timestamps,
    [paramName]: values
  } as ParameterLog<T>;
  
  return result;
};

// Create mock well drilling data
export const mockWellDrillingData: WellDrillingData[] = [
  {
    wellId: 'well-001',
    wellName: 'North Sea Well #42',
    status: 'drilling',
    currentDepth: 3245.7, // meters
    targetDepth: 4500, // meters
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    estimatedCompletionDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
    elapsedTime: 336, // 14 days in hours
    remainingTime: 504, // 21 days in hours
    
    // Drilling parameters
    rop: createDrillingSensor('rop-001', 'Rate of Penetration', 12.3, 'm/hr', 5, 25),
    wob: createDrillingSensor('wob-001', 'Weight on Bit', 18.5, 'tons', 10, 25),
    torque: createDrillingSensor('torque-001', 'Torque', 28.7, 'kN·m', 15, 40),
    rpm: createDrillingSensor('rpm-001', 'Rotary Speed', 120, 'RPM', 60, 180),
    
    // Mud system
    mudFlowRate: createDrillingSensor('mud-flow-001', 'Mud Flow Rate', 2800, 'L/min', 1500, 3500),
    mudDensity: createDrillingSensor('mud-density-001', 'Mud Density', 1250, 'kg/m³', 1000, 1500),
    mudTemperature: createDrillingSensor('mud-temp-001', 'Mud Temperature', 65, '°C', 40, 80),
    mudViscosity: createDrillingSensor('mud-visc-001', 'Mud Viscosity', 45, 'sec', 30, 60),
    
    // Pressure data
    downholePressure: createDrillingSensor('downhole-press-001', 'Downhole Pressure', 4200, 'psi', 3000, 5000),
    annularPressure: createDrillingSensor('annular-press-001', 'Annular Pressure', 2800, 'psi', 2000, 3500),
    standpipePressure: createDrillingSensor('standpipe-press-001', 'Standpipe Pressure', 3100, 'psi', 2500, 3800),
    casingPressure: createDrillingSensor('casing-press-001', 'Casing Pressure', 1800, 'psi', 1200, 2200),
    
    // Mechanical data
    hookLoad: createDrillingSensor('hook-load-001', 'Hook Load', 180, 'tons', 150, 220),
    blockPosition: createDrillingSensor('block-pos-001', 'Block Position', 15.2, 'm', 0, 30),
    pumpRate: createDrillingSensor('pump-rate-001', 'Pump Rate', 85, 'SPM', 60, 100),
    
    // Vibration data
    axialVibration: createDrillingSensor('axial-vib-001', 'Axial Vibration', 0.8, 'g', 0, 2),
    lateralVibration: createDrillingSensor('lateral-vib-001', 'Lateral Vibration', 1.2, 'g', 0, 3),
    torsionalVibration: createDrillingSensor('torsional-vib-001', 'Torsional Vibration', 0.5, 'g', 0, 1.5),
    
    // Directional drilling
    directionalData: {
      inclination: 12.5, // degrees
      azimuth: 245.8, // degrees
      toolFace: 78.3, // degrees
      northSouth: -120.5, // meters
      eastWest: 85.2 // meters
    },
    
    // Formation evaluation
    formationData: {
      lithology: 'Sandstone with shale interbeds',
      porosity: 18.5, // percentage
      permeability: 45.2, // millidarcies
      resistivity: 8.7, // ohm-meters
      gammaRay: 65.3, // API units
      density: 2.45 // g/cm³
    },
    
    // Bit data
    bitType: 'PDC - 5 blades',
    bitSize: 12.25, // inches
    bitTotalFootage: 1250, // meters
    bitHours: 120, // hours
    
    // Drilling fluid properties
    fluidType: 'Water-based mud',
    fluidPH: 9.2,
    fluidSolidsContent: 8.5, // percentage
    
    // Gas readings
    methaneLevel: createDrillingSensor('methane-001', 'Methane Level', 35, 'ppm', 0, 100),
    hydrogenSulfideLevel: createDrillingSensor('h2s-001', 'H2S Level', 2, 'ppm', 0, 10),
    
    // Generate historical logs
    depthLog: generateDepthLog(3245.7, 96), // 24 hours of data at 15-minute intervals
    
    // Generate parameter logs using the depth log
    ropLog: (() => {
      const depthLog = generateDepthLog(3245.7, 96);
      const ropValues = depthLog.depth.map((_, i) => {
        if (i === 0) return 0;
        const timeDiff = new Date(depthLog.timestamp[i]).getTime() - new Date(depthLog.timestamp[i-1]).getTime();
        const depthDiff = depthLog.depth[i] - depthLog.depth[i-1];
        // Convert to m/hr
        return Math.round((depthDiff / (timeDiff / 3600000)) * 10) / 10;
      });
      return generateParameterLog('rop', ropValues, depthLog.depth, depthLog.timestamp);
    })(),
    
    wobLog: (() => {
      const depthLog = generateDepthLog(3245.7, 96);
      const wobValues = depthLog.depth.map(() => Math.round((15 + Math.random() * 10) * 10) / 10);
      return generateParameterLog('wob', wobValues, depthLog.depth, depthLog.timestamp);
    })(),
    
    torqueLog: (() => {
      const depthLog = generateDepthLog(3245.7, 96);
      const torqueValues = depthLog.depth.map(() => Math.round((25 + Math.random() * 15) * 10) / 10);
      return generateParameterLog('torque', torqueValues, depthLog.depth, depthLog.timestamp);
    })(),
    
    rpmLog: (() => {
      const depthLog = generateDepthLog(3245.7, 96);
      const rpmValues = depthLog.depth.map(() => Math.round(100 + Math.random() * 60));
      return generateParameterLog('rpm', rpmValues, depthLog.depth, depthLog.timestamp);
    })(),
  },
  {
    wellId: 'well-002',
    wellName: 'Gulf of Mexico Well #17',
    status: 'tripping',
    currentDepth: 2850.3, // meters
    targetDepth: 3800, // meters
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    estimatedCompletionDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    elapsedTime: 240, // 10 days in hours
    remainingTime: 360, // 15 days in hours
    
    // Drilling parameters
    rop: createDrillingSensor('rop-002', 'Rate of Penetration', 0, 'm/hr', 5, 25),
    wob: createDrillingSensor('wob-002', 'Weight on Bit', 0, 'tons', 10, 25),
    torque: createDrillingSensor('torque-002', 'Torque', 0, 'kN·m', 15, 40),
    rpm: createDrillingSensor('rpm-002', 'Rotary Speed', 0, 'RPM', 60, 180),
    
    // Mud system
    mudFlowRate: createDrillingSensor('mud-flow-002', 'Mud Flow Rate', 1500, 'L/min', 1500, 3500),
    mudDensity: createDrillingSensor('mud-density-002', 'Mud Density', 1320, 'kg/m³', 1000, 1500),
    mudTemperature: createDrillingSensor('mud-temp-002', 'Mud Temperature', 58, '°C', 40, 80),
    mudViscosity: createDrillingSensor('mud-visc-002', 'Mud Viscosity', 42, 'sec', 30, 60),
    
    // Pressure data
    downholePressure: createDrillingSensor('downhole-press-002', 'Downhole Pressure', 3800, 'psi', 3000, 5000),
    annularPressure: createDrillingSensor('annular-press-002', 'Annular Pressure', 2500, 'psi', 2000, 3500),
    standpipePressure: createDrillingSensor('standpipe-press-002', 'Standpipe Pressure', 2800, 'psi', 2500, 3800),
    casingPressure: createDrillingSensor('casing-press-002', 'Casing Pressure', 1600, 'psi', 1200, 2200),
    
    // Mechanical data
    hookLoad: createDrillingSensor('hook-load-002', 'Hook Load', 195, 'tons', 150, 220),
    blockPosition: createDrillingSensor('block-pos-002', 'Block Position', 22.8, 'm', 0, 30),
    pumpRate: createDrillingSensor('pump-rate-002', 'Pump Rate', 65, 'SPM', 60, 100),
    
    // Vibration data
    axialVibration: createDrillingSensor('axial-vib-002', 'Axial Vibration', 0.3, 'g', 0, 2),
    lateralVibration: createDrillingSensor('lateral-vib-002', 'Lateral Vibration', 0.5, 'g', 0, 3),
    torsionalVibration: createDrillingSensor('torsional-vib-002', 'Torsional Vibration', 0.2, 'g', 0, 1.5),
    
    // Directional drilling
    directionalData: {
      inclination: 18.2, // degrees
      azimuth: 178.5, // degrees
      toolFace: 92.1, // degrees
      northSouth: -85.3, // meters
      eastWest: 12.8 // meters
    },
    
    // Formation evaluation
    formationData: {
      lithology: 'Limestone with dolomite',
      porosity: 12.8, // percentage
      permeability: 28.5, // millidarcies
      resistivity: 15.2, // ohm-meters
      gammaRay: 42.7, // API units
      density: 2.68 // g/cm³
    },
    
    // Bit data
    bitType: 'Tricone - IADC 517',
    bitSize: 8.5, // inches
    bitTotalFootage: 850, // meters
    bitHours: 85, // hours
    
    // Drilling fluid properties
    fluidType: 'Oil-based mud',
    fluidPH: 8.8,
    fluidSolidsContent: 6.2, // percentage
    
    // Gas readings
    methaneLevel: createDrillingSensor('methane-002', 'Methane Level', 28, 'ppm', 0, 100),
    hydrogenSulfideLevel: createDrillingSensor('h2s-002', 'H2S Level', 0.5, 'ppm', 0, 10),
    
    // Generate historical logs
    depthLog: generateDepthLog(2850.3, 96), // 24 hours of data at 15-minute intervals
    
    // Generate parameter logs using the depth log
    ropLog: (() => {
      const depthLog = generateDepthLog(2850.3, 96);
      const ropValues = depthLog.depth.map((_, i) => {
        if (i === 0) return 0;
        const timeDiff = new Date(depthLog.timestamp[i]).getTime() - new Date(depthLog.timestamp[i-1]).getTime();
        const depthDiff = depthLog.depth[i] - depthLog.depth[i-1];
        // Convert to m/hr
        return Math.round((depthDiff / (timeDiff / 3600000)) * 10) / 10;
      });
      return generateParameterLog('rop', ropValues, depthLog.depth, depthLog.timestamp);
    })(),
    
    wobLog: (() => {
      const depthLog = generateDepthLog(2850.3, 96);
      const wobValues = depthLog.depth.map(() => Math.round((12 + Math.random() * 8) * 10) / 10);
      return generateParameterLog('wob', wobValues, depthLog.depth, depthLog.timestamp);
    })(),
    
    torqueLog: (() => {
      const depthLog = generateDepthLog(2850.3, 96);
      const torqueValues = depthLog.depth.map(() => Math.round((20 + Math.random() * 12) * 10) / 10);
      return generateParameterLog('torque', torqueValues, depthLog.depth, depthLog.timestamp);
    })(),
    
    rpmLog: (() => {
      const depthLog = generateDepthLog(2850.3, 96);
      const rpmValues = depthLog.depth.map(() => Math.round(90 + Math.random() * 50));
      return generateParameterLog('rpm', rpmValues, depthLog.depth, depthLog.timestamp);
    })(),
  }
];

// Function to update drilling data with random fluctuations
export const updateDrillingData = (drillingData: WellDrillingData[]): WellDrillingData[] => {
  return drillingData.map(well => {
    // Only update if well is in drilling status
    if (well.status !== 'drilling') {
      return well;
    }
    
    // Update current depth
    const depthIncrease = (Math.random() * 0.3) + 0.1; // 0.1 to 0.4 meters
    const newDepth = well.currentDepth + depthIncrease;
    
    // Update elapsed time
    const timeIncrease = 1/60; // 1 minute in hours
    const newElapsedTime = well.elapsedTime + timeIncrease;
    const newRemainingTime = well.remainingTime - timeIncrease;
    
    // Update drilling parameters with random fluctuations
    const updateSensor = (sensor: DrillingSensor): DrillingSensor => {
      const range = sensor.max - sensor.min;
      const fluctuation = range * 0.03; // 3% of range
      let newValue = sensor.value + (Math.random() - 0.5) * fluctuation;
      
      // Ensure value stays within min-max range
      newValue = Math.max(sensor.min, Math.min(sensor.max, newValue));
      
      // Update trend data
      const newTrend = [...sensor.trend || []];
      if (newTrend.length > 20) {
        newTrend.shift(); // Remove oldest value
      }
      newTrend.push(Math.round(newValue * 100) / 100);
      
      // Determine status based on how close to limits
      let status: 'normal' | 'warning' | 'critical' = 'normal';
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
        trend: newTrend
      };
    };
    
    // Update logs
    const newDepthLog = {
      depth: [...well.depthLog.depth, newDepth],
      timestamp: [...well.depthLog.timestamp, new Date().toISOString()]
    };
    
    // Keep only the last 96 points (24 hours at 15-minute intervals)
    if (newDepthLog.depth.length > 96) {
      newDepthLog.depth = newDepthLog.depth.slice(-96);
      newDepthLog.timestamp = newDepthLog.timestamp.slice(-96);
    }
    
    // Calculate new ROP
    const lastDepthIndex = well.depthLog.depth.length - 1;
    const timeDiff = new Date().getTime() - new Date(well.depthLog.timestamp[lastDepthIndex]).getTime();
    const depthDiff = newDepth - well.depthLog.depth[lastDepthIndex];
    const newRopValue = Math.round((depthDiff / (timeDiff / 3600000)) * 10) / 10;
    
    // Update ROP sensor
    const newRop = {
      ...well.rop,
      value: newRopValue,
      timestamp: new Date().toISOString()
    };
    
    // Update ROP log
    const newRopLog = generateParameterLog(
      'rop',
      [...(well.ropLog.rop as number[]), newRopValue],
      [...well.ropLog.depth, newDepth],
      [...well.ropLog.timestamp, new Date().toISOString()]
    );
    
    // Keep only the last 96 points
    if (newRopLog.rop.length > 96) {
      newRopLog.rop = newRopLog.rop.slice(-96);
      newRopLog.depth = newRopLog.depth.slice(-96);
      newRopLog.timestamp = newRopLog.timestamp.slice(-96);
    }
    
    // Update other logs similarly
    const newWobValue = Math.round((well.wob.value + (Math.random() - 0.5) * 2) * 10) / 10;
    const newWobLog = generateParameterLog(
      'wob',
      [...(well.wobLog.wob as number[]), newWobValue],
      [...well.wobLog.depth, newDepth],
      [...well.wobLog.timestamp, new Date().toISOString()]
    );
    
    if (newWobLog.wob.length > 96) {
      newWobLog.wob = newWobLog.wob.slice(-96);
      newWobLog.depth = newWobLog.depth.slice(-96);
      newWobLog.timestamp = newWobLog.timestamp.slice(-96);
    }
    
    const newTorqueValue = Math.round((well.torque.value + (Math.random() - 0.5) * 3) * 10) / 10;
    const newTorqueLog = generateParameterLog(
      'torque',
      [...(well.torqueLog.torque as number[]), newTorqueValue],
      [...well.torqueLog.depth, newDepth],
      [...well.torqueLog.timestamp, new Date().toISOString()]
    );
    
    if (newTorqueLog.torque.length > 96) {
      newTorqueLog.torque = newTorqueLog.torque.slice(-96);
      newTorqueLog.depth = newTorqueLog.depth.slice(-96);
      newTorqueLog.timestamp = newTorqueLog.timestamp.slice(-96);
    }
    
    const newRpmValue = Math.round(well.rpm.value + (Math.random() - 0.5) * 10);
    const newRpmLog = generateParameterLog(
      'rpm',
      [...(well.rpmLog.rpm as number[]), newRpmValue],
      [...well.rpmLog.depth, newDepth],
      [...well.rpmLog.timestamp, new Date().toISOString()]
    );
    
    if (newRpmLog.rpm.length > 96) {
      newRpmLog.rpm = newRpmLog.rpm.slice(-96);
      newRpmLog.depth = newRpmLog.depth.slice(-96);
      newRpmLog.timestamp = newRpmLog.timestamp.slice(-96);
    }
    
    return {
      ...well,
      currentDepth: Math.round(newDepth * 10) / 10,
      elapsedTime: Math.round(newElapsedTime * 100) / 100,
      remainingTime: Math.round(newRemainingTime * 100) / 100,
      rop: newRop,
      wob: updateSensor(well.wob),
      torque: updateSensor(well.torque),
      rpm: updateSensor(well.rpm),
      mudFlowRate: updateSensor(well.mudFlowRate),
      mudTemperature: updateSensor(well.mudTemperature),
      downholePressure: updateSensor(well.downholePressure),
      annularPressure: updateSensor(well.annularPressure),
      standpipePressure: updateSensor(well.standpipePressure),
      hookLoad: updateSensor(well.hookLoad),
      blockPosition: updateSensor(well.blockPosition),
      pumpRate: updateSensor(well.pumpRate),
      axialVibration: updateSensor(well.axialVibration),
      lateralVibration: updateSensor(well.lateralVibration),
      torsionalVibration: updateSensor(well.torsionalVibration),
      methaneLevel: updateSensor(well.methaneLevel),
      hydrogenSulfideLevel: updateSensor(well.hydrogenSulfideLevel),
      depthLog: newDepthLog,
      ropLog: newRopLog,
      wobLog: newWobLog,
      torqueLog: newTorqueLog,
      rpmLog: newRpmLog
    };
  });
};