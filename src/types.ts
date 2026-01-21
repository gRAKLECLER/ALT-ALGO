// types.ts

export type Priority = "STAT" | "URGENT" | "ROUTINE";
export type Specialty = "BLOOD" | "URINE" | "TISSUE" | "CHEMISTRY" | "MICROBIOLOGY" | "IMMUNOLOGY" | "GENERAL";

// probleme de nomage dans les exemple speciality basic --> specialty inter

// Échantillon
export interface Sample {
  id: string;
  type: Specialty;
  priority: Priority;
  analysisTime: number; // minutes
  arrivalTime: string; // "HH:MM"
  patientId?: string;
  analysisType?: string; // ex: "Numération complète", "Culture bactérienne"
}

// Technicien
export interface Technician {
  id: string;
  specialty: Specialty | Specialty[];
  name?: string;
  startTime?: string;
  endTime?: string;
  efficiency?: number; // coefficient d'efficacité
  lunchBreak?: string; // "HH:MM-HH:MM"
}

// Équipement
export interface Equipment {
  id: string;
  name?: string;
  type?: Specialty;       // attention au S majuscule dans le type
  available?: boolean;
  cleaningTime?: number; // minutes
  capacity?: number;
  maintenance?: string[];
}


// Planification
export interface ScheduleItem {
  sampleId: string;
  technicianId: string;
  equipmentId: string;
  startTime: string;
  endTime: string;
  priority: Priority;
  efficiency?: number;        // coefficient appliqué
  lunchBreak?: string | null; // pause du technicien
  cleaningRequired?: boolean; // si nettoyage appliqué
  status?: string;            // ex: "lunchInterrupted", "pausedForLunch"
  notes?: string;
}

// Metrics
export interface Metrics {
  totalTime: number;                 // durée totale du planning
  efficiency: number;                // % utilisation moyenne techniciens
  conflicts: number;                 // conflits détectés
  averageWaitTime?: number; // en minutes
  technicianUtilization?: number;    // % occupation techniciens
  priorityRespectRate?: number;      // % priorités respectées
  parallelAnalyses?: number;         // nb analyses simultanées max
  lunchInterruptions?: number;
  parallelEfficiency: number;       // nb pauses interrompues
}

// Données du laboratoire
export interface LabData {
  samples: Sample[];
  technicians: Technician[];
  equipment: Equipment[];
}

// Résultat de la planification
export interface PlanifyResult {
  schedule: ScheduleItem[];
  metrics: Metrics;
  metadata?: Record<string, any>; // pour info additionnelle : pauses, nettoyage, contraintes appliquées
}
