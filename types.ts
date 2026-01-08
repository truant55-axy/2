
export interface ChartData {
  name: string;
  value: number; // For Pie/Bar charts (quantity or percentage)
  color?: string;
  // Enhanced fields for Product List
  progress?: number; // 0-100
  statusLabel?: string; // e.g. "生产中"
  isLagging?: boolean; // Highlight for delayed items
  // Enhanced fields for Status Pie
  count?: number;
  avgTime?: string; // e.g. "3.5h"
  projectList?: string[]; // List of projects in this status
  // Enhanced fields for Workload
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
  // Visual position for Mock/Artistic map (0-100%)
  x: number;
  y: number;
  // Real coordinates for GPS/AMap/Google Map
  lng?: number; 
  lat?: number;
  label: string;
  type: 'transport' | 'clinic';
  status: 'normal' | 'busy' | 'offline';
}

export interface DashboardMetrics {
  totalOrders: number;
  avgWorkload: number; // Kept for backward compatibility or total rate
  workloadRate: number; // 0-100 for ring chart
  workloadBreakdown: { role: string; time: number; unit: string }[];
  productDistribution: ChartData[];
  statusDistribution: ChartData[];
  mapLocations: MapLocation[];
  hospitals: Hospital[];
  patients: Patient[];
}

// New interfaces for Workload interactivity
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
