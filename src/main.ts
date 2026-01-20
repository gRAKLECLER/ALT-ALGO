// index.ts

import { planifyLab } from "./planifyLab";
import type { LabData } from "./types";

const data1: LabData =  
{
    "samples": [
      {
        "id": "S001",
        "type": "BLOOD", 
        "priority": "URGENT",
        "analysisTime": 30,
        "arrivalTime": "09:00",
        "patientId": "P001"
      }
    ],
    "technicians": [
      {
        "id": "T001", 
        "name": "Alice Martin",
        "speciality": "BLOOD",
        "startTime": "08:00",
        "endTime": "17:00"
      }
    ],
    "equipment": [
      {
        "id": "E001",
        "name": "Analyseur Sang A",
        "type": "BLOOD", 
        "available": true
      }
    ]
  }

const data2: LabData = {
  "samples": [
    {
      "id": "S001",
      "type": "BLOOD",
      "priority": "URGENT", 
      "analysisTime": 45,
      "arrivalTime": "09:00",
      "patientId": "P001"
    },
    {
      "id": "S002", 
      "type": "BLOOD",
      "priority": "STAT",
      "analysisTime": 30,
      "arrivalTime": "09:30",
      "patientId": "P002"
    }
  ],
  "technicians": [
    {
      "id": "T001",
      "speciality": "BLOOD", 
      "startTime": "08:00",
      "endTime": "17:00"
    }
  ],
  "equipment": [
    {
      "id": "E001",
      "type": "BLOOD",
      "available": true
    }
  ]
}

const data3: LabData = {
  "samples": [
    {
      "id": "S001", 
      "type": "BLOOD",
      "priority": "URGENT",
      "analysisTime": 60,
      "arrivalTime": "09:00", 
      "patientId": "P001"
    },
    {
      "id": "S002",
      "type": "URINE", 
      "priority": "URGENT",
      "analysisTime": 30,
      "arrivalTime": "09:15",
      "patientId": "P002" 
    },
    {
      "id": "S003",
      "type": "BLOOD",
      "priority": "ROUTINE", 
      "analysisTime": 45,
      "arrivalTime": "09:00",
      "patientId": "P003"
    }
  ],
  "technicians": [
    {
      "id": "T001",
      "speciality": "BLOOD",
      "startTime": "08:00", 
      "endTime": "17:00"
    },
    {
      "id": "T002", 
      "speciality": "GENERAL",
      "startTime": "08:00",
      "endTime": "17:00"
    }
  ],
  "equipment": [
    {
      "id": "E001",
      "type": "BLOOD",
      "available": true
    },
    {
      "id": "E002", 
      "type": "URINE",
      "available": true
    }
  ]
}



// 👉 Calcul du planning
const result = planifyLab(data1);
const result2 = planifyLab(data2);
const result3 = planifyLab(data3);

// 👉 Injection dans la page
const app = document.querySelector("#app");
const app2 = document.querySelector("#app2");
const app3 = document.querySelector("#app3");

if (app) {
  app.innerHTML = `
    <h1>🧪 Planning du laboratoire1</h1>
    <pre style="
      background: #0d1117;
      color: #c9d1d9;
      padding: 16px;
      border-radius: 8px;
      font-family: monospace;
      white-space: pre-wrap;
    ">
${JSON.stringify(result, null, 2)}
    </pre>
  `;
}

if(app2) {
  app2.innerHTML = `
    <h1>🧪 Planning du laboratoire2</h1>
    <pre style="
      background: #0d1117;
      color: #c9d1d9;
      padding: 16px;
      border-radius: 8px;
      font-family: monospace;
      white-space: pre-wrap;
    ">
${JSON.stringify(result2, null, 2)}
  </pre>
`;
}

if(app3) {
  app3.innerHTML = `
    <h1>🧪 Planning du laboratoire3</h1>
    <pre style="
      background: #0d1117;
      color: #c9d1d9;
      padding: 16px;
      border-radius: 8px;
      font-family: monospace;
      white-space: pre-wrap;
    ">
${JSON.stringify(result3, null, 2)}
  </pre>
`;
}