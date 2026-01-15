
export enum SheepStatus {
  IN_PEN = '在栏',
  SOLD = '已售',
  DECEASED = '死亡'
}

export enum PenType {
  FATTENING = '育肥',
  BREEDING = '繁殖',
  ISOLATION = '隔离'
}

export interface FarmInfo {
  id: string;
  name: string;
  owner: string;
  contact: string;
  address: string;
  establishedDate: string;
  notes: string;
}

export interface Sheep {
  id: string; // 耳标号
  farmId: string;
  breed: string;
  gender: '公' | '母';
  birthDate: string;
  status: SheepStatus;
  penId: string;
  source: '自繁' | '外购';
  notes: string;
}

export interface Pen {
  id: string;
  name: string;
  type: PenType;
  maxCapacity: number;
  notes: string;
}

export interface BreedingRecord {
  id: string;
  eweId: string;
  ramId: string;
  matingDate: string;
  matingType: '自然' | '人工';
  expectedDate: string;
  actualDate?: string;
  lambCount?: number;
  survivalCount?: number;
  notes: string;
}

export interface PreventionRecord {
  id: string;
  sheepId: string;
  project: string;
  date: string;
  nextDate: string;
  operator: string;
  notes: string;
}

export interface FeedRecord {
  id: string;
  name: string;
  type: string;
  inDate: string;
  inQuantity: number;
  usageRecords: {
    date: string;
    quantity: number;
    target: string; // 圈舍或羊群
  }[];
  notes: string;
}

export interface DiseaseRecord {
  id: string;
  sheepId: string;
  onsetDate: string;
  diseaseName: string;
  symptoms: string;
  treatment: string;
  medicine: string;
  recoveryDate?: string;
  outcome: '痊愈' | '死亡';
  notes: string;
}

export interface SaleRecord {
  id: string;
  sheepId: string;
  saleDate: string;
  customer: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentMethod: string;
  notes: string;
}

export type ViewType = 'dashboard' | 'sheep' | 'pens' | 'breeding' | 'health' | 'feed' | 'sales' | 'settings';
