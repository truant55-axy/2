
export interface ChartData {
  name: string;
  value: number; // For Pie/Bar charts
  color?: string;
  progress?: number; // 0-100
  statusLabel?: string; 
  isLagging?: boolean; 
  count?: number; 
  avgTime?: string; 
  projectList?: string[]; 
  roleBreakdown?: { role: string; time: number; unit: string }[];
  [key: string]: any;
}

export interface Patient {
  id: string;
  name: string;
  project: string;
  status: 'Completed' | 'Sampling' | 'Processing';
  hospital: string;
}

export interface Hospital {
  id: number;
  name: string;
  description?: string; // Hospital introduction
  location?: string;
}

export interface MapLocation {
  id: number;
  // Visual position for map (0-100%)
  x: number;
  y: number;
  // Real coordinates for AMap/Google Map
  lng?: number; 
  lat?: number;
  label: string;
  type: 'transport' | 'clinic';
  status: 'normal' | 'busy' | 'offline';
}

export interface DashboardMetrics {
  totalOrders: number;
  avgWorkload: number; 
  workloadRate: number; 
  workloadBreakdown: { role: string; time: number; unit: string }[];
  productDistribution: ChartData[];
  statusDistribution: ChartData[];
  mapLocations: MapLocation[];
  hospitals: Hospital[];
  patients: Patient[];
}

export interface WorkloadData {
  rate: number;
  breakdown: { role: string; time: number; unit: string }[];
}

export interface WorkloadDetailRecord {
  id: string;
  employeeName: string;
  role: string;
  projectName: string;
  taskType: string;
  hoursSpent: number;
  date: string;
  status: 'Done' | 'In Progress' | '已完成' | '进行中';
}

export enum ProcessingStatus {
  Design = 'design',
  Mailing = 'mailing',
  Completed = 'completed',
  Production = 'production'
}
