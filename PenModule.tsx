
import React, { useState } from 'react';
import { Card, Button, Modal, Label, Input, Select } from './Common';
import { useStore } from '../store';
import { Pen, PenType, SheepStatus } from '../types';

export const PenModule: React.FC = () => {
  const { data, addPen, updatePen } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPen, setEditingPen] = useState<Pen | null>(null);

  const [form, setForm] = useState<Partial<Pen>>({
    id: '',
    name: '',
    type: PenType.FATTENING,
    maxCapacity: 50,
    notes: ''
  });

  const handleOpenAdd = () => {
    setEditingPen(null);
    setForm({
      id: `P00${data.pens.length + 1}`,
      name: '',
      type: PenType.FATTENING,
      maxCapacity: 50,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Pen) => {
    setEditingPen(p);
    setForm(p);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPen) {
      updatePen(form as Pen);
    } else {
      addPen(form as Pen);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleOpenAdd}><i className="fas fa-plus mr-2"></i>建设新圈舍</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.pens.map(pen => {
          const currentCount = data.sheep.filter(s => s.penId === pen.id && s.status === SheepStatus.IN_PEN).length;
          const occupancy = Math.round((currentCount / pen.maxCapacity) * 100);
          
          return (
            <Card key={pen.id} className="relative group hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{pen.name}</h4>
                  <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 rounded border border-green-100">
                    {pen.type}舍
                  </span>
                </div>
                <button onClick={() => handleOpenEdit(pen)} className="text-gray-400 hover:text-green-600 transition-colors">
                  <i className="fas fa-cog"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">存栏密度</span>
                    <span className="font-bold">{currentCount} / {pen.maxCapacity} 只</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-700 ${occupancy > 90 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]'}`} 
                      style={{ width: `${Math.min(occupancy, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 italic">
                  {pen.notes || '暂无详细描述'}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPen ? '圈舍设置' : '新建圈舍'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>圈舍编号</Label>
            <Input value={form.id} onChange={e => setForm({...form, id: e.target.value})} disabled={!!editingPen} />
          </div>
          <div>
            <Label>圈舍名称</Label>
            <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="如：1号繁殖舍" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>圈舍类型</Label>
              <Select 
                value={form.type} 
                onChange={e => setForm({...form, type: e.target.value as PenType})} 
                options={Object.values(PenType).map(v => ({label: v, value: v}))}
              />
            </div>
            <div>
              <Label>最大容量 (只)</Label>
              <Input type="number" value={form.maxCapacity} onChange={e => setForm({...form, maxCapacity: parseInt(e.target.value)})} required />
            </div>
          </div>
          <div>
            <Label>备注信息</Label>
            <Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button type="submit">完成设置</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
