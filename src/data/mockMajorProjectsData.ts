import type { MajorProjectItem } from '../types/majorProjects';

export const MOCK_MAJOR_PROJECTS: MajorProjectItem[] = [
  {
    id: 'mp-2026-01',
    code: 'GEO-MP-2026-01',
    title: 'Metro Line Extension Phase 3 — Geotechnical Sub-surface Survey & Deep Core Audit',
    client: 'Urban Transit Infrastructure Corporation',
    sector: 'Geotechnical',
    category: 'Mega Infrastructure',
    location: 'Sector 62 to IGI Airport Corridor, New Delhi',
    division: 'Division 1 — Geotechnical & Sub-surface Engineering',
    currentPhase: 'Phase 2: Deep Core Drilling & SPT',
    currentMilestone: '120m Deep Borehole Drilling & Triaxial Soil Shear Testing',
    progressPercentage: 82,
    health: 'On Track',
    startDate: '15 Jun 2026',
    targetCompletionDate: '28 Oct 2026',
    qualityAuditStatus: 'Certified',
    safetyCompliance: '100% Zero-Incident Certified',
    description: 'Comprehensive geotechnical investigation involving 45 deep boreholes, pressuremeter testing, and seismic refraction tomography across a 28 km elevated & underground metro alignment.',
    keyObjectives: [
      'Borehole stratigraphy mapping up to 120 meters depth',
      'Triaxial shear and consolidation laboratory testing on undisturbed soil samples',
      'Foundation load-bearing recommendations for 84 pier locations',
      'Geophysical tomography for cavern & underground cavity detection'
    ],
    finance: {
      totalValuation: '₹8,50,00,000',
      numericalValuation: 85000000,
      billedAmount: '₹6,97,00,000',
      receivedAmount: '₹6,20,00,000',
      pendingValuation: '₹1,53,00,000',
      financialHealth: 'Healthy'
    },
    weeklyPhases: [
      { week: 'W36', label: 'Topography & Alignment Survey', deliverable: 'Topographic contour maps delivered to Chief Engineer', status: 'completed', targetDate: '07 Sep 2026' },
      { week: 'W37', label: 'Borehole Core Drilling', deliverable: '45/45 Boreholes drilled with SPT & rock coring', status: 'completed', targetDate: '14 Sep 2026' },
      { week: 'W38', label: 'Lab Soil & Rock Testing', deliverable: 'Triaxial compression & RQD analysis in HQ Lab', status: 'in-progress', targetDate: '21 Sep 2026' },
      { week: 'W39', label: 'Final Stratigraphy & Report', deliverable: 'Comprehensive geotechnical report sign-off', status: 'scheduled', targetDate: '28 Sep 2026' }
    ],
    risksAndDecisions: [
      { id: 'risk-101', title: 'Pending Right-of-Way clearance for Pier 42-45 site access', type: 'Pending Decision', severity: 'Moderate', actionOwner: 'Er. A. Sharma', dueDate: '02 Oct 2026' },
      { id: 'risk-102', title: 'Laboratory Triaxial Shear Test Report Final Sign-off', type: 'Upcoming Milestone', severity: 'Normal', actionOwner: 'Dr. V. Raman', dueDate: '05 Oct 2026' }
    ],
    team: [
      { id: 'tm-1', name: 'Dr. V. Raman', role: 'Principal Investigator & Chief Consultant', department: 'Geotechnical Research Lab' },
      { id: 'tm-2', name: 'Er. A. Sharma', role: 'Field Operations Director', department: 'Field Operations Division' },
      { id: 'tm-3', name: 'K. S. Verma', role: 'Senior Geologist & Core Analyst', department: 'Geological Investigations' }
    ]
  },
  {
    id: 'mp-2026-02',
    code: 'GEO-MP-2026-02',
    title: 'National Expressway Corridor — Topographic LIDAR & UAV Aerial Mapping',
    client: 'National Highway Development Authority (NHDA)',
    sector: 'Surveying',
    category: 'Highways & Expressways',
    location: 'Km 140 to Km 210 Highway Stretch (70 km)',
    division: 'Division 2 — Topographic & Aerial Surveying Division',
    currentPhase: 'Phase 4: Point Cloud Alignment & DEM Processing',
    currentMilestone: 'UAV Point Cloud Processing & Orthomosaic GIS Layer Alignment',
    progressPercentage: 94,
    health: 'Milestone Review',
    startDate: '01 May 2026',
    targetCompletionDate: '15 Oct 2026',
    qualityAuditStatus: 'Passed',
    safetyCompliance: 'FAA/DGCA Drone Safety Approved',
    description: 'High-density LiDAR aerial scanning, ground control point network tie-in, and 3D terrain modeling for a 70 km 8-lane greenfield expressway corridor.',
    keyObjectives: [
      'RTK-DGPS survey of 120 permanent Ground Control Points (GCPs)',
      'High-resolution LiDAR flight scanning generating 50 pts/sq.m density',
      '3D Digital Elevation Model (DEM) and contour generation at 0.5m interval',
      'CAD alignment design export for highway geometry optimization'
    ],
    finance: {
      totalValuation: '₹12,00,00,000',
      numericalValuation: 120000000,
      billedAmount: '₹11,28,00,000',
      receivedAmount: '₹10,50,00,000',
      pendingValuation: '₹72,00,00',
      financialHealth: 'Healthy'
    },
    weeklyPhases: [
      { week: 'W36', label: 'UAV Flight Missions', deliverable: '70 km flight survey completed without gap', status: 'completed', targetDate: '07 Sep 2026' },
      { week: 'W37', label: 'GCP DGPS Tie-in', deliverable: '120 Ground Control Points tied into National Grid', status: 'completed', targetDate: '14 Sep 2026' },
      { week: 'W38', label: 'DEM & Point Cloud Extraction', deliverable: 'High-density point cloud filtered for vegetation', status: 'completed', targetDate: '21 Sep 2026' },
      { week: 'W39', label: 'CAD Delivery & Sign-off', deliverable: 'Final AutoCAD 3D alignment models submitted', status: 'in-progress', targetDate: '28 Sep 2026' }
    ],
    risksAndDecisions: [
      { id: 'risk-201', title: 'Final DGCA Flight Log Clearance Certificate Upload', type: 'Pending Decision', severity: 'Normal', actionOwner: 'Capt. R. Deshmukh', dueDate: '03 Oct 2026' }
    ],
    team: [
      { id: 'tm-4', name: 'Capt. R. Deshmukh', role: 'Head of Aerial Mapping', department: 'UAV & Drone Operations' },
      { id: 'tm-5', name: 'S. K. Nambiar', role: 'GIS Lead Specialist', department: 'Geospatial Analytics' }
    ]
  },
  {
    id: 'mp-2026-03',
    code: 'GEO-MP-2026-03',
    title: 'Cyber IT Park Tower B & C — Structural Load & Soil Bearing Capacity Audit',
    client: 'Apex Realty & Commercial Developers',
    sector: 'Structural',
    category: 'Structural & Urban IT Parks',
    location: 'Cyber City Hub, Tower B & C Foundation Site',
    division: 'Division 3 — Structural Audit & NDT Testing Division',
    currentPhase: 'Phase 3: Structural Integrity & NDT Testing',
    currentMilestone: 'Ultrasonic Pulse Velocity & Rebound Hammer Testing on Foundation Raft',
    progressPercentage: 45,
    health: 'On Track',
    startDate: '10 Aug 2026',
    targetCompletionDate: '12 Nov 2026',
    qualityAuditStatus: 'Under Review',
    safetyCompliance: 'OSHA Construction Safety Compliant',
    description: 'Non-destructive testing (NDT), pile load capacity verification, and sub-structure settlement audit for a 32-storey commercial IT park twin tower.',
    keyObjectives: [
      'Static pile load test up to 1200 Metric Tons load capacity',
      'Ultrasonic pulse velocity and core sampling on foundation raft',
      'Seismic vulnerability assessment & finite element foundation modeling',
      'Structural safety certificate for municipal high-rise clearance'
    ],
    finance: {
      totalValuation: '₹4,85,00,000',
      numericalValuation: 4850000,
      billedAmount: '₹2,18,00,000',
      receivedAmount: '₹1,80,00,000',
      pendingValuation: '₹2,67,00,000',
      financialHealth: 'Healthy'
    },
    weeklyPhases: [
      { week: 'W36', label: 'Pile Load Setup', deliverable: '1200T hydraulic load test frame installed', status: 'completed', targetDate: '07 Sep 2026' },
      { week: 'W37', label: 'Static Load Testing', deliverable: '72-hour continuous settlement reading recorded', status: 'completed', targetDate: '14 Sep 2026' },
      { week: 'W38', label: 'NDT Ultrasound Audit', deliverable: 'Pulse velocity grid mapping on basement raft', status: 'in-progress', targetDate: '21 Sep 2026' },
      { week: 'W39', label: 'Structural Safety Certificate', deliverable: 'Final engineering clearance for tower superstructure', status: 'scheduled', targetDate: '28 Sep 2026' }
    ],
    risksAndDecisions: [
      { id: 'risk-301', title: 'High-strain dynamic pile testing calibration report required', type: 'Upcoming Milestone', severity: 'Normal', actionOwner: 'Er. N. K. Roy', dueDate: '08 Oct 2026' }
    ],
    team: [
      { id: 'tm-6', name: 'Er. N. K. Roy', role: 'Chief Structural Auditor', department: 'Structural Engineering' },
      { id: 'tm-7', name: 'P. Mehta', role: 'NDT Testing Specialist', department: 'Materials Testing Lab' }
    ]
  },
  {
    id: 'mp-2026-04',
    code: 'GEO-MP-2026-04',
    title: 'Industrial Corridor Water Supply Reservoir — Hydrological & Environmental Study',
    client: 'State Industrial Infrastructure Corporation',
    sector: 'Infrastructure',
    category: 'Hydrology & Energy',
    location: 'Western Industrial Corridor, Catchment Basin Area',
    division: 'Division 4 — Hydrology & Environmental Engineering',
    currentPhase: 'Phase 4: Environmental Clearance & Final Documentation',
    currentMilestone: 'Reservoir Inflow Modeling & Sedimentation Rate Certification',
    progressPercentage: 98,
    health: 'Completed',
    startDate: '12 Feb 2026',
    targetCompletionDate: '30 Sep 2026',
    qualityAuditStatus: 'Certified',
    safetyCompliance: 'Central Water Commission Approved',
    description: 'Comprehensive hydro-geological modeling, catchment runoff simulation, dam spillway rating curves, and environmental impact study for a 50 Million Liters/Day industrial reservoir.',
    keyObjectives: [
      '50-year rainfall & flood frequency statistical analysis',
      'Bathymetric survey of reservoir basin and sediment volume calculation',
      'Seepage analysis and clay liner permeability certification',
      'Environmental Impact Assessment (EIA) for Pollution Control Board'
    ],
    finance: {
      totalValuation: '₹6,20,00,000',
      numericalValuation: 62000000,
      billedAmount: '₹6,07,60,000',
      receivedAmount: '₹5,80,00,000',
      pendingValuation: '₹12,40,000',
      financialHealth: 'Healthy'
    },
    weeklyPhases: [
      { week: 'W36', label: 'Hydro-modeling Simulation', deliverable: 'SWMM catchment flood model verified', status: 'completed', targetDate: '07 Sep 2026' },
      { week: 'W37', label: 'Bathymetric Survey', deliverable: 'Echo-sounder depth contour map generated', status: 'completed', targetDate: '14 Sep 2026' },
      { week: 'W38', label: 'EIA Clearance Submission', deliverable: 'Environmental report filed with State Board', status: 'completed', targetDate: '21 Sep 2026' },
      { week: 'W39', label: 'Final Handover', deliverable: 'Official completion certificate signed', status: 'completed', targetDate: '28 Sep 2026' }
    ],
    risksAndDecisions: [],
    team: [
      { id: 'tm-8', name: 'Dr. Meera Sen', role: 'Chief Hydrologist', department: 'Environmental & Water Resources' },
      { id: 'tm-9', name: 'A. K. Mishra', role: 'Environmental Compliance Officer', department: 'Regulatory Affairs' }
    ]
  },
  {
    id: 'mp-2026-05',
    code: 'GEO-MP-2026-05',
    title: 'River Bridge & Multi-Modal Transit Hub — Sub-bed Geophysical Survey',
    client: 'State Highway & Transport Development Board',
    sector: 'Geotechnical',
    category: 'Mega Infrastructure',
    location: 'Ganges River Crossing Pier Location 1 to 14',
    division: 'Division 1 — Geotechnical & Sub-surface Engineering',
    currentPhase: 'Phase 2: Overwater Jack-up Barge Drilling',
    currentMilestone: 'Riverbed Core Drilling at Pier 6 Deep Channel Location',
    progressPercentage: 68,
    health: 'Attention Required',
    startDate: '01 Jul 2026',
    targetCompletionDate: '18 Nov 2026',
    qualityAuditStatus: 'Under Review',
    safetyCompliance: 'Maritime Marine Safety Certified',
    description: 'Over-water borehole drilling from floating jack-up barges, sub-bottom acoustic profiling, and scour depth analysis for a 2.4 km multi-modal river bridge.',
    keyObjectives: [
      'Over-water drilling up to 85m below riverbed at 14 pier locations',
      'Sub-bottom acoustic profiling for alluvial sand-rock boundary detection',
      'Riverbed scour velocity & liquefaction potential analysis',
      'Caisson foundation depth recommendation report'
    ],
    finance: {
      totalValuation: '₹15,50,00,000',
      numericalValuation: 155000000,
      billedAmount: '₹10,54,00,000',
      receivedAmount: '₹8,90,00,000',
      pendingValuation: '₹4,96,00,000',
      financialHealth: 'Attention Required'
    },
    weeklyPhases: [
      { week: 'W36', label: 'Barge Positioning & Anchor', deliverable: 'Jack-up barge 2 anchored at Pier 6 channel', status: 'completed', targetDate: '07 Sep 2026' },
      { week: 'W37', label: 'Deep Channel Drilling', deliverable: 'Borehole Pier 6 reached 65m depth', status: 'in-progress', targetDate: '14 Sep 2026' },
      { week: 'W38', label: 'Acoustic Profiling', deliverable: 'Sub-bottom profiler survey along bridge axis', status: 'scheduled', targetDate: '21 Sep 2026' },
      { week: 'W39', label: 'Liquefaction Analysis', deliverable: 'Seismic liquefaction report for bridge piers', status: 'scheduled', targetDate: '28 Sep 2026' }
    ],
    risksAndDecisions: [
      { id: 'risk-501', title: 'High river current velocity delaying barge stability at Pier 7', type: 'Risk', severity: 'Critical', actionOwner: 'Capt. S. Gill', dueDate: '30 Sep 2026' },
      { id: 'risk-502', title: 'Billed invoice #INV-2026-904 awaiting State Treasury release', type: 'Pending Decision', severity: 'Moderate', actionOwner: 'Accounts Lead', dueDate: '05 Oct 2026' }
    ],
    team: [
      { id: 'tm-10', name: 'Capt. S. Gill', role: 'Marine Operations Lead', department: 'Offshore & Riverine Unit' },
      { id: 'tm-1', name: 'Dr. V. Raman', role: 'Principal Investigator', department: 'Geotechnical Research Lab' }
    ]
  },
  {
    id: 'mp-2026-06',
    code: 'GEO-MP-2026-06',
    title: 'Deep Sea Port Offshore Platform Foundation Audit — Geotechnical Analysis',
    client: 'Maritime Port & Logistics Authority',
    sector: 'Geotechnical',
    category: 'Mega Infrastructure',
    location: 'Deepwater Berth #4, Coastal Port Terminal',
    division: 'Division 1 — Geotechnical & Sub-surface Engineering',
    currentPhase: 'Phase 1: Offshore Geophysical Tomography',
    currentMilestone: 'Multibeam Bathymetry & Seabed Cone Penetration Testing (CPT)',
    progressPercentage: 35,
    health: 'On Track',
    startDate: '20 Aug 2026',
    targetCompletionDate: '20 Dec 2026',
    qualityAuditStatus: 'Passed',
    safetyCompliance: 'ISO 14001 / OHSAS Marine Approved',
    description: 'Deepwater offshore seabed cone penetration testing (CPT), side-scan sonar mapping, and heavy pile capacity estimation for a 350-meter container vessel berth extension.',
    keyObjectives: [
      'Offshore piezocone penetration testing (CPTu) at 25 marine points',
      'Side-scan sonar & magnetometer survey for seabed debris detection',
      'Marine clay fatigue modeling under cyclic wave loading',
      'Tubular steel pile penetration design report'
    ],
    finance: {
      totalValuation: '₹22,00,00,000',
      numericalValuation: 220000000,
      billedAmount: '₹7,70,00,000',
      receivedAmount: '₹7,00,00,000',
      pendingValuation: '₹14,30,00,000',
      financialHealth: 'Healthy'
    },
    weeklyPhases: [
      { week: 'W36', label: 'Vessel Mobilization', deliverable: 'Research Vessel Geo Explorer mobilized to port', status: 'completed', targetDate: '07 Sep 2026' },
      { week: 'W37', label: 'Seabed CPTu Testing', deliverable: '15/25 Marine CPT tests completed', status: 'in-progress', targetDate: '14 Sep 2026' },
      { week: 'W38', label: 'Side-scan Sonar Audit', deliverable: 'High-frequency sonar sweep of berth area', status: 'scheduled', targetDate: '21 Sep 2026' },
      { week: 'W39', label: 'Pile Capacity Design', deliverable: 'Tubular pile axial & lateral load analysis', status: 'scheduled', targetDate: '28 Sep 2026' }
    ],
    risksAndDecisions: [
      { id: 'risk-601', title: 'Customs clearance for specialized marine CPT sensor probe', type: 'Pending Decision', severity: 'Normal', actionOwner: 'Logistics Desk', dueDate: '04 Oct 2026' }
    ],
    team: [
      { id: 'tm-1', name: 'Dr. V. Raman', role: 'Principal Investigator', department: 'Geotechnical Research Lab' },
      { id: 'tm-10', name: 'Capt. S. Gill', role: 'Marine Operations Lead', department: 'Offshore & Riverine Unit' }
    ]
  },
  {
    id: 'mp-2026-07',
    code: 'GEO-MP-2026-07',
    title: 'Thermal Power Plant Chimney & Structure Health Monitoring',
    client: 'State Electricity Generation Corporation',
    sector: 'Structural',
    category: 'Hydrology & Energy',
    location: 'Unit 3 & 4 Chimney Stack, State Thermal Station',
    division: 'Division 3 — Structural Audit & NDT Testing Division',
    currentPhase: 'Phase 3: Vibration & Concrete Degradation Audit',
    currentMilestone: '275m Reinforced Concrete Chimney Stack Vibration Sensor Calibration',
    progressPercentage: 75,
    health: 'On Track',
    startDate: '10 Jun 2026',
    targetCompletionDate: '25 Oct 2026',
    qualityAuditStatus: 'Certified',
    safetyCompliance: 'High-Altitude Rope Access Certified',
    description: 'High-altitude rope-access NDT audit, thermographic camera inspection, and continuous accelerometer vibration monitoring on a 275m power plant RCC chimney.',
    keyObjectives: [
      'Drone thermography for internal refractory lining crack detection',
      'Concrete core compression & carbonation depth testing at 50m intervals',
      'Wind & seismic dynamic frequency response analysis',
      'Structural retrofit & life extension engineering recommendations'
    ],
    finance: {
      totalValuation: '₹3,90,00,000',
      numericalValuation: 39000000,
      billedAmount: '₹2,92,50,000',
      receivedAmount: '₹2,70,00,000',
      pendingValuation: '₹97,50,000',
      financialHealth: 'Healthy'
    },
    weeklyPhases: [
      { week: 'W36', label: 'Rope Access Rigging', deliverable: 'Safety anchor lines rigged on 275m stack', status: 'completed', targetDate: '07 Sep 2026' },
      { week: 'W37', label: 'Thermographic Survey', deliverable: 'Infrared thermal imaging of stack lining', status: 'completed', targetDate: '14 Sep 2026' },
      { week: 'W38', label: 'Vibration Monitoring', deliverable: 'Continuous triaxial accelerometer recording', status: 'in-progress', targetDate: '21 Sep 2026' },
      { week: 'W39', label: 'Life Extension Report', deliverable: 'Final structural safety & retrofit plan', status: 'scheduled', targetDate: '28 Sep 2026' }
    ],
    risksAndDecisions: [],
    team: [
      { id: 'tm-6', name: 'Er. N. K. Roy', role: 'Chief Structural Auditor', department: 'Structural Engineering' },
      { id: 'tm-7', name: 'P. Mehta', role: 'NDT Testing Specialist', department: 'Materials Testing Lab' }
    ]
  }
];
