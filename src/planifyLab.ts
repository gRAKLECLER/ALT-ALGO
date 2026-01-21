import type {
  LabData,
  Metrics,
  PlanifyResult,
  Priority
} from "./types";

import { timeToMinutes, minutesToTime } from "./utils";

const priorityOrder: Record<Priority, number> = {
  STAT: 1,
  URGENT: 2,
  ROUTINE: 3
};

export const planifyLab = (data: LabData): PlanifyResult => {
  const schedule = [];

  const sortedSamples = [...data.samples].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  const techBusy: Record<string, [number, number][]> = {};
  const equipBusy: Record<string, [number, number][]> = {};

  for (const t of data.technicians) techBusy[t.id] = [];
  for (const e of data.equipment) equipBusy[e.id] = [];

  for (const sample of sortedSamples) {
    const technician = data.technicians.find(t =>
      t.speciality.includes(sample.type) || t.speciality === "GENERAL"
    );

    const equipment = data.equipment.find(
      (e) => e.type === sample.type && e.available
    );

    if (!technician || !equipment) {
      throw new Error(`Ressource indisponible pour ${sample.id}`);
    }

    const isFree = (busySlots: [number, number][], start: number, duration: number) =>
      !busySlots.some(([s, e]) => start < e && start + duration > s);

    // Cherche le prochain créneau libre
    let start = timeToMinutes(sample.arrivalTime);
    const duration = sample.analysisTime;

    while (!isFree(techBusy[technician.id], start, duration) ||
          !isFree(equipBusy[equipment.id], start, duration)) {
      start += 1;
    }
    const end = start + duration;

    techBusy[technician.id].push([start, end]);
    equipBusy[equipment.id].push([start, end]);

    schedule.push({
      sampleId: sample.id,
      technicianId: technician.id,
      equipmentId: equipment.id,
      startTime: minutesToTime(start),
      endTime: minutesToTime(end),
      priority: sample.priority
    });
  }

  if (schedule.length === 0) {
    return { schedule: [], metrics: { totalTime: 0, efficiency: 0, conflicts: 0 } };
  }

  const firstArrival = Math.min(...sortedSamples.map(s => timeToMinutes(s.arrivalTime)));
  const lastEnd = Math.max(...schedule.map(s => timeToMinutes(s.endTime)));

  const totalUsed = schedule.reduce(
    (acc, s) =>
      acc + (timeToMinutes(s.endTime) - timeToMinutes(s.startTime)),
    0
  );

  const metrics: Metrics = {
    totalTime: lastEnd - firstArrival,
    efficiency: Math.round((totalUsed / (lastEnd - firstArrival)) * 1000)/ 10,
    conflicts: 0
  };

  console.log(totalUsed, lastEnd , firstArrival)
  

  return {
    schedule: schedule.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)),
    metrics
  };
};
