import { planifyLab } from '../src/planifyLab';
import type { LabData } from '../src/types';

describe('planifyLab', () => {
  it('exemple 2 → efficiency = 71.4%', () => {
    const data: LabData = {
      samples: [
        {
          id: 'S001',
          type: 'BLOOD',
          priority: 'URGENT',
          analysisTime: 45,
          arrivalTime: '09:00',
          patientId: 'P001'
        },
        {
          id: 'S002',
          type: 'BLOOD',
          priority: 'STAT',
          analysisTime: 30,
          arrivalTime: '09:30',
          patientId: 'P002'
        }
      ],
      technicians: [
        {
          id: 'T001',
          specialty: 'BLOOD',
          startTime: '08:00',
          endTime: '17:00'
        }
      ],
      equipment: [
        {
          id: 'E001',
          type: 'BLOOD',
          available: true
        }
      ]
    };

    const result = planifyLab(data);

    expect(result.metrics.totalTime).toBe(105);
    expect(result.metrics.efficiency).toBeCloseTo(71.4, 1);
    expect(result.metrics.conflicts).toBe(0);
  });
});
