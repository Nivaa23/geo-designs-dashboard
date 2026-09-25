import type { DetailedProjectTrackingItem } from '../types/projectTracking';

export const MOCK_DETAILED_PROJECTS: DetailedProjectTrackingItem[] = [
  {
    id: 'proj-101',
    code: 'GEO-PRJ-2026-089',
    name: 'Metro Line Extension Phase 3 — Geotechnical Sub-surface Survey',
    client: 'Urban Transit Infrastructure Corporation',
    sector: 'Geotechnical',
    progressPercentage: 82,
    status: 'In Progress',
    deadline: '28 Oct 2026',
    totalValuation: '₹85,00,000',
    allocationDivision: 'Division 1 — Geotechnical & Soil Investigation',
    assignedTeam: [
      { id: 'tm-1', name: 'Dr. V. Raman', role: 'Chief Geotechnical Consultant', department: 'Research & Lab' },
      { id: 'tm-2', name: 'Er. A. Sharma', role: 'Senior Field Site Engineer', department: 'Field Operations' },
      { id: 'tm-3', name: 'K. Verma', role: 'Borehole Log Analyst', department: 'Soil Testing Lab' }
    ],
    timelineUpdates: [
      { date: '24 Sep 2026', note: 'Completed 28 out of 35 deep boreholes along elevated rail corridor.' },
      { date: '18 Sep 2026', note: 'Triaxial shear testing initiated at HQ Engineering Lab.' },
      { date: '10 Sep 2026', note: 'Field site clearance & utility radar scan approved.' }
    ],
    momRecords: [
      { id: 'mom-1', date: '22 Sep 2026', subject: 'Site Access & Underground Utility Clearance Review', summary: 'Aligned with Municipal Transit Engineers on borehole locations near Pier 14.', attendees: 'Dr. V. Raman, Er. A. Sharma, Urban Transit Team' },
      { id: 'mom-2', date: '12 Sep 2026', subject: 'Triaxial Shear Testing Parameters & Core Sample Sign-off', summary: 'Approved lab testing matrix for high-pressure soil strata.', attendees: 'Dr. V. Raman, K. Verma' }
    ],
    sopReferences: [
      { id: 'sop-1', code: 'SOP-GEO-012', title: 'Deep Sub-surface Borehole Sampling Standard', category: 'Geotechnical Procedures' },
      { id: 'sop-2', code: 'SOP-LAB-008', title: 'Triaxial Shear & Core Load Test Protocol', category: 'Laboratory QA' }
    ],
    financeInfo: {
      totalValuation: '₹85,00,000',
      numericalValuation: 8500000,
      billedAmount: '₹65,00,000',
      receivedAmount: '₹50,00,000',
      pendingValuation: '₹20,00,000',
      status: 'Healthy'
    }
  },
  {
    id: 'proj-102',
    code: 'GEO-PRJ-2026-074',
    name: 'National Expressway Corridor — Topographic & UAV Aerial Mapping',
    client: 'National Highways Authority of India (NHAI)',
    sector: 'Surveying',
    progressPercentage: 94,
    status: 'Milestone Review',
    deadline: '15 Oct 2026',
    totalValuation: '₹1,20,00,000',
    allocationDivision: 'Division 2 — Topographic & UAV Aerial Surveying',
    assignedTeam: [
      { id: 'tm-4', name: 'Er. A. Sharma', role: 'Lead Survey Engineer', department: 'Topographic Survey' },
      { id: 'tm-5', name: 'M. Singh', role: 'UAV Drone Flight Specialist', department: 'Aerial Mapping' },
      { id: 'tm-6', name: 'R. Kulkarni', role: 'GIS & DGPS Data Processor', department: 'Spatial Analytics' }
    ],
    timelineUpdates: [
      { date: '23 Sep 2026', note: 'Final 3D DTM & orthomosaic map generation completed for 65 km stretch.' },
      { date: '15 Sep 2026', note: 'DGPS bench mark calibration verified with NHAI regional officers.' }
    ],
    momRecords: [
      { id: 'mom-3', date: '20 Sep 2026', subject: 'Orthomosaic Map Accuracy Verification Meeting', summary: 'Presented high-density point cloud models to NHAI Superintending Engineer.', attendees: 'Er. A. Sharma, M. Singh, NHAI Officers' }
    ],
    sopReferences: [
      { id: 'sop-3', code: 'SOP-SUR-004', title: 'UAV Aerial Drone Survey Flight & Safety Standard', category: 'Aerial Surveying' },
      { id: 'sop-4', code: 'SOP-GIS-002', title: 'DGPS Bench Marking & Coordinate Reference Guide', category: 'GIS Standards' }
    ],
    financeInfo: {
      totalValuation: '₹1,20,00,000',
      numericalValuation: 12000000,
      billedAmount: '₹1,10,00,000',
      receivedAmount: '₹95,00,000',
      pendingValuation: '₹25,00,000',
      status: 'Healthy'
    }
  },
  {
    id: 'proj-103',
    code: 'GEO-PRJ-2026-092',
    name: 'Cyber IT Park Tower B — Structural Load & Soil Capacity Audit',
    client: 'Apex Realty & Developers Ltd.',
    sector: 'Structural',
    progressPercentage: 45,
    status: 'On Schedule',
    deadline: '12 Nov 2026',
    totalValuation: '₹48,50,000',
    allocationDivision: 'Division 3 — Structural Audit & NDT Testing',
    assignedTeam: [
      { id: 'tm-7', name: 'S. Patel', role: 'Senior Structural Audit Lead', department: 'Structural Division' },
      { id: 'tm-8', name: 'Dr. V. Raman', role: 'Geotechnical Advisory Expert', department: 'Research & Advisory' }
    ],
    timelineUpdates: [
      { date: '21 Sep 2026', note: 'Rebar scanning and ultrasonic pulse velocity tests completed for basement columns.' },
      { date: '11 Sep 2026', note: 'Core drilling samples extracted from foundation raft.' }
    ],
    momRecords: [
      { id: 'mom-4', date: '19 Sep 2026', subject: 'Tower B Foundation Raft Structural Integrity Review', summary: 'Reviewed NDT test results for foundation raft concrete grade.', attendees: 'S. Patel, Apex Developers Project Director' }
    ],
    sopReferences: [
      { id: 'sop-5', code: 'SOP-STR-009', title: 'Non-Destructive Testing (NDT) & Rebar Scanning Protocol', category: 'Structural Audit' }
    ],
    financeInfo: {
      totalValuation: '₹48,50,000',
      numericalValuation: 4850000,
      billedAmount: '₹24,00,000',
      receivedAmount: '₹20,00,000',
      pendingValuation: '₹28,50,000',
      status: 'In Progress'
    }
  },
  {
    id: 'proj-104',
    code: 'GEO-PRJ-2026-068',
    name: 'Industrial Corridor Water Supply Reservoir — Hydrological Study',
    client: 'State Infrastructure Corporation',
    sector: 'Infrastructure',
    progressPercentage: 98,
    status: 'Pending Sign-off',
    deadline: '30 Sep 2026',
    totalValuation: '₹62,00,000',
    allocationDivision: 'Division 4 — Hydrology & Environmental Engineering',
    assignedTeam: [
      { id: 'tm-9', name: 'R. Kulkarni', role: 'Hydrological Lead Engineer', department: 'Hydrology Division' },
      { id: 'tm-10', name: 'Dr. V. Raman', role: 'Chief Environmental Consultant', department: 'Research & Lab' }
    ],
    timelineUpdates: [
      { date: '25 Sep 2026', note: 'Final hydrological catchment report compiled and submitted for executive sign-off.' },
      { date: '17 Sep 2026', note: 'Soil permeability and reservoir seepage tests concluded.' }
    ],
    momRecords: [
      { id: 'mom-5', date: '24 Sep 2026', subject: 'Hydrological Final Report & Seepage Mitigation Review', summary: 'Conducted final technical presentation with State Infrastructure Board.', attendees: 'R. Kulkarni, Dr. V. Raman, State Board Committee' }
    ],
    sopReferences: [
      { id: 'sop-6', code: 'SOP-HYD-003', title: 'Reservoir Catchment Hydrology & Permeability Audit', category: 'Hydrology Standards' }
    ],
    financeInfo: {
      totalValuation: '₹62,00,000',
      numericalValuation: 6200000,
      billedAmount: '₹62,00,000',
      receivedAmount: '₹55,00,000',
      pendingValuation: '₹7,00,000',
      status: 'Healthy'
    }
  },
  {
    id: 'proj-105',
    code: 'GEO-PRJ-2026-055',
    name: 'Smart City Regional Flyover — Seismic & Sub-surface Investigation',
    client: 'Municipal Urban Development Agency',
    sector: 'Infrastructure',
    progressPercentage: 60,
    status: 'In Progress',
    deadline: '20 Nov 2026',
    totalValuation: '₹3,40,00,000',
    allocationDivision: 'Division 1 — Geotechnical & Soil Investigation',
    assignedTeam: [
      { id: 'tm-11', name: 'Dr. V. Raman', role: 'Principal Investigator', department: 'Research & Lab' },
      { id: 'tm-12', name: 'Er. A. Sharma', role: 'Field Operations Manager', department: 'Field Operations' }
    ],
    timelineUpdates: [
      { date: '22 Sep 2026', note: 'Seismic refraction survey completed across 14 flyover pier locations.' }
    ],
    momRecords: [
      { id: 'mom-6', date: '18 Sep 2026', subject: 'Seismic Wave Velocity & Liquefaction Analysis Meeting', summary: 'Discussed bedrock depth estimations with Municipal Chief Engineer.', attendees: 'Dr. V. Raman, Municipal Engineering Team' }
    ],
    sopReferences: [
      { id: 'sop-7', code: 'SOP-SEI-001', title: 'Sub-surface Seismic Refraction & Liquefaction Testing', category: 'Seismic Standards' }
    ],
    financeInfo: {
      totalValuation: '₹3,40,00,000',
      numericalValuation: 34000000,
      billedAmount: '₹1,80,00,000',
      receivedAmount: '₹1,50,00,000',
      pendingValuation: '₹1,90,00,000',
      status: 'In Progress'
    }
  },
  {
    id: 'proj-106',
    code: 'GEO-PRJ-2026-042',
    name: 'State Hydroelectric Dam Reservoir — Deep Core Drilling & Geotechnical Survey',
    client: 'State Hydro Electric Power Generation Board',
    sector: 'Geotechnical',
    progressPercentage: 35,
    status: 'In Progress',
    deadline: '15 Dec 2026',
    totalValuation: '₹12,50,00,000',
    allocationDivision: 'Division 1 — Geotechnical & Soil Investigation',
    assignedTeam: [
      { id: 'tm-13', name: 'Dr. V. Raman', role: 'Chief Geotechnical Consultant', department: 'Research & Advisory' },
      { id: 'tm-14', name: 'S. Patel', role: 'Structural Safety Specialist', department: 'Structural Engineering' },
      { id: 'tm-15', name: 'K. Verma', role: 'Field Operations Lead', department: 'Field Survey' }
    ],
    timelineUpdates: [
      { date: '24 Sep 2026', note: 'Deep core drilling reaching 45m rock depth at spillway dam axis.' }
    ],
    momRecords: [
      { id: 'mom-7', date: '21 Sep 2026', subject: 'Dam Spillway Rock Mass Rating (RMR) Evaluation', summary: 'Reviewed rock core samples RQD values with Power Board Technical Panel.', attendees: 'Dr. V. Raman, S. Patel, Power Board Directors' }
    ],
    sopReferences: [
      { id: 'sop-8', code: 'SOP-GEO-020', title: 'Deep Rock Core Drilling & RQD Logging Protocol', category: 'Geotechnical Standards' }
    ],
    financeInfo: {
      totalValuation: '₹12,50,00,000',
      numericalValuation: 125000000,
      billedAmount: '₹4,50,00,000',
      receivedAmount: '₹4,00,00,000',
      pendingValuation: '₹8,50,00,000',
      status: 'In Progress'
    }
  }
];
