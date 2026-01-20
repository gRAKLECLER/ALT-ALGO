// types.ts

export type Priority = "STAT" | "URGENT" | "ROUTINE";
export type Speciality = "BLOOD" | "URINE" | "GENERAL";


export interface Sample {
  id: string;
  type: Speciality;
  priority: Priority;
  analysisTime: number; // minutes
  arrivalTime: string; // "HH:MM"
  patientId: string;
}

export interface Technician {
  id: string;
  name?: string;
  speciality: Speciality;
  startTime: string;
  endTime: string;
}

export interface Equipment {
  id: string;
  name?: string;
  type: Speciality;
  available: boolean;
}

export interface ScheduleItem {
  sampleId: string;
  technicianId: string;
  equipmentId: string;
  startTime: string;
  endTime: string;
  priority: Priority;
}

export interface Metrics {
  totalTime: number;
  efficiency: number;
  conflicts: number;
}

export interface LabData {
  samples: Sample[];
  technicians: Technician[];
  equipment: Equipment[];
}

export interface PlanifyResult {
  schedule: ScheduleItem[];
  metrics: Metrics;
}
