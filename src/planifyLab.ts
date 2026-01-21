import type {
  LabData,
  Metrics,
  PlanifyResult,
  Priority,
  Technician
} from "./types";

import { timeToMinutes, minutesToTime, equipBusy, techBusy } from "./utils";

const priorityOrder: Record<Priority, any> = {
  STAT: 1,
  URGENT: 2,
  ROUTINE: 3
};

export const planifyLab = (data: LabData): PlanifyResult => {

  const schedule: any[] = [];

  const sortedSamples = [...data.samples].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  for (const t of data.technicians) techBusy[t.id] = [];
  for (const e of data.equipment ?? []) equipBusy[e.id ?? ''] = [];

  const isFree = (busy: [number, number][], start: number, duration: number) =>
    !busy.some(([s, e]) => start < e && start + duration > s);

  const isDuringLunch = (technician: Technician, start: number, end: number) => {
    if (!technician.lunchBreak) return false;
    const [ls, le] = technician.lunchBreak.split("-").map(timeToMinutes);
    return start < le && end > ls;
  };

  for (const sample of sortedSamples) {

    const technician = data.technicians.find(t =>
      t.specialty.includes(sample.type) || t.specialty.includes("GENERAL")
    );

    const equipment = data.equipment ? data.equipment.find(e => e.type === sample.type) : [];

    if (!technician || !equipment) {
      throw new Error(`Ressource indisponible pour ${sample.id}`);
    }

    const adjustedDuration =
      Math.round(sample.analysisTime / (technician.efficiency ?? 1));

    let start = timeToMinutes(sample.arrivalTime);

    while (
      !isFree(techBusy[technician.id], start, adjustedDuration) ||
      !isFree(equipBusy[equipment.id], start, adjustedDuration) ||
      isDuringLunch(technician, start, start + adjustedDuration)
    ) {
      start++;
    }

    const end = start + adjustedDuration;

    techBusy[technician.id].push([start, end]);
    equipBusy[equipment.id].push([start, end + (equipment.cleaningTime)]);

    schedule.push({
      sampleId: sample.id,
      priority: sample.priority,
      technicianId: technician.id,
      equipmentId: equipment.id,
      startTime: minutesToTime(start),
      endTime: minutesToTime(end),
      duration: adjustedDuration,
      analysisType: sample.analysisType,
      efficiency: technician.efficiency ?? 1
    });
  }

  if (schedule.length === 0) {
    return { schedule: [], metrics: {
      totalTime: 0, efficiency: 0, conflicts: 0,
      parallelEfficiency: 0
    } };
  }

  const startTimes = schedule.map(s => timeToMinutes(s.startTime));
  const endTimes = schedule.map(s => timeToMinutes(s.endTime));

  const totalTime = Math.max(...endTimes) - Math.min(...startTimes);

  const technicianWork: Record<string, number> = {};
  for (const tech of data.technicians) technicianWork[tech.id] = 0;

  for (const s of schedule) {
    technicianWork[s.technicianId] +=
      timeToMinutes(s.endTime) - timeToMinutes(s.startTime);
  }

  const totalTechnicianUsed =
    Object.values(technicianWork).reduce((a, b) => a + b, 0);

  const efficiency =
    Math.round(
      (totalTechnicianUsed /
        (data.technicians.length * totalTime)) * 1000
    ) / 10;

  const totalWait = schedule.reduce((acc, s) => {
    const sample = data.samples.find(sm => sm.id === s.sampleId)!;
    return acc +
      (timeToMinutes(s.startTime) - timeToMinutes(sample.arrivalTime));
  }, 0);

  const averageWaitTime =
    Math.round((totalWait / schedule.length) * 10) / 10;

  // Respect des priorités
  let respected = 0;
  for (let i = 0; i < schedule.length - 1; i++) {
    if (
      priorityOrder[schedule[i].priority] <=
      priorityOrder[schedule[i + 1].priority]
    ) {
      respected++;
    }
  }

  const priorityRespectRate =
    schedule.length > 1
      ? Math.round((respected / (schedule.length - 1)) * 100)
      : 100;

  // Analyses parallèles max
  let parallelEfficiency = 0;

  for (let i = 0; i < schedule.length; i++) {
    let parallel = 1;
    for (let j = 0; j < schedule.length; j++) {
      if (i === j) continue;
      if (
        timeToMinutes(schedule[i].startTime) <
          timeToMinutes(schedule[j].endTime) &&
        timeToMinutes(schedule[i].endTime) >
          timeToMinutes(schedule[j].startTime)
      ) {
        parallel++;
      }
    }
    parallelEfficiency = Math.max(parallelEfficiency, parallel);
  }

  const metrics: Metrics = {
    totalTime,
    efficiency,
    conflicts: 0,
    averageWaitTime,
    technicianUtilization: efficiency,
    priorityRespectRate,
    parallelEfficiency
  };

  return {
    schedule: schedule.sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    ),
    metrics
  };
};
