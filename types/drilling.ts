import { SensorData } from './index';

export interface DrillingSensor extends SensorData {
  trend?: number[]; // Array of recent values for trending
}

export interface DirectionalData {
  inclination: number; // in degrees
  azimuth: number; // in degrees
  toolFace: number; // in degrees
  northSouth: number; // in meters
  eastWest: number; // in meters
}

export interface FormationData {
  lithology: string;
  porosity: number; // percentage
  permeability: number; // in millidarcies
  resistivity: number; // in ohm-meters
  gammaRay: number; // in API units
  density: number; // in g/cm³
}

// Modified to handle mixed types properly
export interface ParameterLog<T extends number> {
  depth: number[];
  timestamp: string[];
  [key: string]: T[] | number[] | string[];
}

export interface WellDrillingData {
  wellId: string;
  wellName: string;
  status: 'drilling' | 'tripping' | 'casing' | 'cementing' | 'standby' | 'complete';
  currentDepth: number; // in meters
  targetDepth: number; // in meters
  startDate: string;
  estimatedCompletionDate: string;
  elapsedTime: number; // in hours
  remainingTime: number; // in hours
  
  // Drilling parameters
  rop: DrillingSensor; // Rate of Penetration (m/hr)
  wob: DrillingSensor; // Weight on Bit (tons)
  torque: DrillingSensor; // in kN·m
  rpm: DrillingSensor; // Rotary Speed (revolutions per minute)
  
  // Mud system
  mudFlowRate: DrillingSensor; // in liters per minute
  mudDensity: DrillingSensor; // in kg/m³
  mudTemperature: DrillingSensor; // in °C
  mudViscosity: DrillingSensor; // in seconds
  
  // Pressure data
  downholePressure: DrillingSensor; // in psi
  annularPressure: DrillingSensor; // in psi
  standpipePressure: DrillingSensor; // in psi
  casingPressure: DrillingSensor; // in psi
  
  // Mechanical data
  hookLoad: DrillingSensor; // in tons
  blockPosition: DrillingSensor; // in meters
  pumpRate: DrillingSensor; // in strokes per minute
  
  // Vibration data
  axialVibration: DrillingSensor; // in g
  lateralVibration: DrillingSensor; // in g
  torsionalVibration: DrillingSensor; // in g
  
  // Directional drilling
  directionalData: DirectionalData;
  
  // Formation evaluation
  formationData: FormationData;
  
  // Bit data
  bitType: string;
  bitSize: number; // in inches
  bitTotalFootage: number; // in meters
  bitHours: number; // in hours
  
  // Drilling fluid properties
  fluidType: string;
  fluidPH: number;
  fluidSolidsContent: number; // percentage
  
  // Gas readings
  methaneLevel: DrillingSensor; // in ppm
  hydrogenSulfideLevel: DrillingSensor; // in ppm
  
  // Historical data for charts
  depthLog: {
    depth: number[];
    timestamp: string[];
  };
  ropLog: ParameterLog<number>;
  wobLog: ParameterLog<number>;
  torqueLog: ParameterLog<number>;
  rpmLog: ParameterLog<number>;
}