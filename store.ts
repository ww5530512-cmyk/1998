
import { useState, useEffect } from 'react';
import { 
  FarmInfo, Sheep, Pen, BreedingRecord, PreventionRecord, 
  FeedRecord, DiseaseRecord, SaleRecord, SheepStatus, PenType 
} from './types';

const STORAGE_KEY = 'SHEEP_FARM_DATA';

interface AppData {
  farmInfo: FarmInfo;
  sheep: Sheep[];
  pens: Pen[];
  breeding: BreedingRecord[];
  prevention: PreventionRecord[];
  feed: FeedRecord[];
  disease: DiseaseRecord[];
  sales: SaleRecord[];
}

const initialData: AppData = {
  farmInfo: {
    id: 'F001',
    name: '我的幸福羊场',
    owner: '张三',
    contact: '13800138000',
    address: '内蒙古呼和浩特市',
    establishedDate: new Date().toISOString().split('T')[0],
    notes: '欢迎使用系统'
  },
  sheep: [],
  pens: [
    { id: 'P001', name: '1号育肥舍', type: PenType.FATTENING, maxCapacity: 50, notes: '' },
    { id: 'P002', name: '2号母羊舍', type: PenType.BREEDING, maxCapacity: 30, notes: '' }
  ],
  breeding: [],
  prevention: [],
  feed: [],
  disease: [],
  sales: []
};

export const useStore = () => {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateFarmInfo = (info: FarmInfo) => setData(prev => ({ ...prev, farmInfo: info }));

  const addSheep = (s: Sheep) => setData(prev => ({ ...prev, sheep: [...prev.sheep, s] }));
  const updateSheep = (s: Sheep) => setData(prev => ({ ...prev, sheep: prev.sheep.map(item => item.id === s.id ? s : item) }));
  const deleteSheep = (id: string) => setData(prev => ({ ...prev, sheep: prev.sheep.filter(s => s.id !== id) }));

  const addPen = (p: Pen) => setData(prev => ({ ...prev, pens: [...prev.pens, p] }));
  const updatePen = (p: Pen) => setData(prev => ({ ...prev, pens: prev.pens.map(item => item.id === p.id ? p : item) }));

  const addBreeding = (r: BreedingRecord) => setData(prev => ({ ...prev, breeding: [...prev.breeding, r] }));
  const addPrevention = (r: PreventionRecord) => setData(prev => ({ ...prev, prevention: [...prev.prevention, r] }));
  
  const addFeed = (f: FeedRecord) => setData(prev => ({ ...prev, feed: [...prev.feed, f] }));
  const updateFeed = (f: FeedRecord) => setData(prev => ({ ...prev, feed: prev.feed.map(item => item.id === f.id ? f : item) }));

  const addDisease = (d: DiseaseRecord) => {
    setData(prev => {
      const newDisease = [...prev.disease, d];
      let newSheep = prev.sheep;
      if (d.outcome === '死亡') {
         newSheep = prev.sheep.map(s => s.id === d.sheepId ? { ...s, status: SheepStatus.DECEASED } : s);
      }
      return { ...prev, disease: newDisease, sheep: newSheep };
    });
  };

  const addSale = (s: SaleRecord) => {
    setData(prev => ({
      ...prev,
      sales: [...prev.sales, s],
      sheep: prev.sheep.map(item => item.id === s.sheepId ? { ...item, status: SheepStatus.SOLD } : item)
    }));
  };

  return {
    data,
    updateFarmInfo,
    addSheep,
    updateSheep,
    deleteSheep,
    addPen,
    updatePen,
    addBreeding,
    addPrevention,
    addFeed,
    updateFeed,
    addDisease,
    addSale
  };
};
