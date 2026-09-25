import type { StrategicActivityItem } from '../types/strategic';

export const MOCK_STRATEGIC_ACTIVITIES: StrategicActivityItem[] = [
  // AREA A: ORGANIZATIONAL BETTERMENT & UPDATES
  {
    id: 'strat-101',
    code: 'STRAT-ORG-L1-01',
    title: 'Level 1 Organizational Update: Executive Engineering Quality Standard Review',
    description: 'High-level organizational update regarding ISO/IEC 17025 laboratory accreditation guidelines and senior management quality policies.',
    area: 'Organizational Betterment & Updates',
    category: 'Level 1 Organizational Updates',
    dateLogged: '24 Sep 2026',
    targetScope: 'All Engineering & Research Divisions',
    notes: 'Level 1 organizational update documentation finalized by quality committee.'
  },
  {
    id: 'strat-102',
    code: 'STRAT-ORG-L1-02',
    title: 'Level 1 Organizational Update: Strategic Infrastructure Resource Allocation Framework',
    description: 'Executive directive establishing annual capital expenditure priorities for field survey sensors, UAV drone fleet, and drill rigs.',
    area: 'Organizational Betterment & Updates',
    category: 'Level 1 Organizational Updates',
    dateLogged: '20 Sep 2026',
    targetScope: 'Executive Leadership & Division Heads',
    notes: 'Approved during board strategic planning session.'
  },
  {
    id: 'strat-103',
    code: 'STRAT-ORG-L2-01',
    title: 'Level 2 Organizational Update: Departmental Technical Protocol Synchronization',
    description: 'Operational update aligning soil laboratory testing workflows between geotechnical testing labs and field investigation teams.',
    area: 'Organizational Betterment & Updates',
    category: 'Level 2 Organizational Updates',
    dateLogged: '22 Sep 2026',
    targetScope: 'Geotechnical & Soil Testing Departments',
    notes: 'Level 2 operational guidelines distributed across laboratory units.'
  },
  {
    id: 'strat-104',
    code: 'STRAT-ORG-L2-02',
    title: 'Level 2 Organizational Update: Field Operations Safety & Equipment Calibration Logs',
    description: 'Standardized field safety protocols and periodic calibration schedules for DGPS and Total Station equipment.',
    area: 'Organizational Betterment & Updates',
    category: 'Level 2 Organizational Updates',
    dateLogged: '18 Sep 2026',
    targetScope: 'Field Survey Crews & Safety Officers',
    notes: 'Level 2 compliance checklist activated.'
  },

  // AREA B: MARKETING VISION & NEW-WORK PLANNING
  {
    id: 'strat-201',
    code: 'STRAT-MKT-L1-01',
    title: 'Level 1 Marketing Vision: Regional Engineering Brand Positioning & Technical Profile Plan',
    description: 'Macro-level marketing vision establishing Geo Designs & Research as the premier geotechnical and structural survey consultancy in the northern region.',
    area: 'Marketing Vision & New-Work Planning',
    category: 'Level 1 Marketing Vision & Planning',
    dateLogged: '23 Sep 2026',
    targetScope: 'Corporate Communications & Marketing',
    notes: 'Level 1 vision charter reviewed by executive director.'
  },
  {
    id: 'strat-202',
    code: 'STRAT-MKT-L1-02',
    title: 'Level 1 Marketing Vision: Infrastructure & Transit Sector Expansion Blueprint',
    description: 'Long-term strategic marketing plan targeting mega-infrastructure tenders across National Highways and Urban Transit Authorities.',
    area: 'Marketing Vision & New-Work Planning',
    category: 'Level 1 Marketing Vision & Planning',
    dateLogged: '15 Sep 2026',
    targetScope: 'Business Development & Strategic Bidding',
    notes: 'Strategic roadmap for 2026-2028 market expansion.'
  },
  {
    id: 'strat-203',
    code: 'STRAT-MKT-L2-01',
    title: 'Level 2 Marketing Vision: Sectoral Technical Capabilities Outreach Portfolio',
    description: 'Detailed collateral and technical capability dossiers highlighting specialized slope stability audit and GPR sub-surface mapping capabilities.',
    area: 'Marketing Vision & New-Work Planning',
    category: 'Level 2 Marketing Vision & Planning',
    dateLogged: '21 Sep 2026',
    targetScope: 'Marketing Collateral & Proposal Team',
    notes: 'Level 2 promotional literature compiled for government agency presentations.'
  },
  {
    id: 'strat-204',
    code: 'STRAT-MKT-L2-02',
    title: 'Level 2 Marketing Vision: Annual Civil Engineering Technical Seminar & Workshop Plan',
    description: 'Planning calendar for hosting industry workshops on soil dynamics, rock mechanics, and modern drone aerial survey applications.',
    area: 'Marketing Vision & New-Work Planning',
    category: 'Level 2 Marketing Vision & Planning',
    dateLogged: '17 Sep 2026',
    targetScope: 'Industry Relations & Corporate Events',
    notes: 'Seminar event itinerary under preparation.'
  },

  // DEDICATED AREA: NEW-WORK PLANNING
  {
    id: 'strat-301',
    code: 'STRAT-NWP-01',
    title: 'New-Work Planning: State Infrastructure Authority Tender Outreach Strategy',
    description: 'Targeted planning for acquiring new contract opportunities across upcoming state highway and bridge inspection tenders.',
    area: 'Marketing Vision & New-Work Planning',
    category: 'New-Work Planning',
    dateLogged: '25 Sep 2026',
    targetScope: 'New Business Acquisition & Tendering Division',
    notes: 'Priority target list compiled for Q4 tender releases.'
  },
  {
    id: 'strat-302',
    code: 'STRAT-NWP-02',
    title: 'New-Work Planning: Commercial High-Rise Developer Foundation Audit Acquisition Plan',
    description: 'Strategic outreach initiative directed at private real estate developers requiring deep foundation soil investigation and structural load testing.',
    area: 'Marketing Vision & New-Work Planning',
    category: 'New-Work Planning',
    dateLogged: '19 Sep 2026',
    targetScope: 'Private Sector Business Development',
    notes: 'Outreach campaign targeting top-tier regional developers.'
  },
  {
    id: 'strat-303',
    code: 'STRAT-NWP-03',
    title: 'New-Work Planning: Transit Corridor Aerial Survey & Utility Mapping Campaign',
    description: 'Dedicated plan to secure new surveying and sub-surface GPR utility mapping assignments for smart city municipal projects.',
    area: 'Marketing Vision & New-Work Planning',
    category: 'New-Work Planning',
    dateLogged: '16 Sep 2026',
    targetScope: 'Surveying & GIS Acquisition Group',
    notes: 'Pre-qualification proposals submitted to municipal corporations.'
  }
];
