export type StrategicCategory =
  | 'Level 1 Organizational Updates'
  | 'Level 2 Organizational Updates'
  | 'Level 1 Marketing Vision & Planning'
  | 'Level 2 Marketing Vision & Planning'
  | 'New-Work Planning';

export type StrategicArea =
  | 'Organizational Betterment & Updates'
  | 'Marketing Vision & New-Work Planning';

export interface StrategicActivityItem {
  id: string;
  code: string;
  title: string;
  description: string;
  area: StrategicArea;
  category: StrategicCategory;
  dateLogged: string;
  notes?: string;
  targetScope?: string;
}
