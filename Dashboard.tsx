
import React from 'react';
import { Card } from './Common';
import { useStore } from '../store';
import { SheepStatus } from '../types';

const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({ title, value, icon, color }) => (
  <Card className="flex flex-col">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-500 font-medium">{title}</span>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color} text-white`}>
        <i className={`fas ${icon}`}></i>
      </div>
    </div>
    <div className="text-3xl font-bold text-gray-800">{value}</div>
  </Card>
);

export const Dashboard: React.FC = () => {
  const { data } = useStore();
  
  const inPenSheep = data.sheep.filter(s => s.status === SheepStatus.IN_PEN);
  const totalSales = data.sales.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const pensOccupancy = data.pens.reduce((acc, pen) => {
    const count = data.sheep.filter(s => s.penId === pen.id && s.status === SheepStatus.IN_PEN).length;
    return acc + count;
  }, 0);

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="总存栏量" value={inPenSheep.length} icon="fa-sheep" color="bg-green-500" />
        <StatCard title="圈舍总数" value={data.pens.length} icon="fa-warehouse" color="bg-blue-500" />
        <StatCard title="累计销售额" value={`¥${totalSales.toLocaleString()}`} icon="fa-coins" color="bg-yellow-500" />
        <StatCard title="繁殖记录" value={data.breeding.length} icon="fa-baby" color="bg-pink-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card title="活跃圈舍概览">
          <div className="space-y-4">
            {data.pens.map(pen => {
              const current = data.sheep.filter(s => s.penId === pen.id && s.status === SheepStatus.IN_PEN).length;
              const percent = Math.min(Math.round((current / pen.maxCapacity) * 100), 100);
              return (
                <div key={pen.id} className="space-y-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{pen.name} ({pen.type})</span>
                    <span className="text-gray-500">{current} / {pen.maxCapacity}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${percent > 90 ? 'bg-red-500' : percent > 70 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick Links / Info */}
        <Card title="近期提醒">
          <div className="space-y-3">
             {data.breeding.filter(b => !b.actualDate).slice(0, 5).map(b => (
               <div key={b.id} className="flex items-center p-3 bg-blue-50 border border-blue-100 rounded-lg">
                 <i className="fas fa-calendar-alt text-blue-500 mr-3"></i>
                 <div className="text-sm">
                   <span className="font-bold">母羊 {b.eweId}</span> 预计于 <span className="text-blue-700 font-bold">{b.expectedDate}</span> 产羔
                 </div>
               </div>
             ))}
             {data.breeding.filter(b => !b.actualDate).length === 0 && (
               <div className="text-gray-400 text-center py-8">暂无近期产羔提醒</div>
             )}
          </div>
        </Card>
      </div>
    </div>
  );
};
