
import React, { useState } from 'react';
import { Card, Button, Modal, Label, Input } from './Common';
import { useStore } from '../store';
import { FeedRecord } from '../types';

export const FeedModule: React.FC = () => {
  const { data, addFeed, updateFeed } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<FeedRecord | null>(null);

  const [form, setForm] = useState<Partial<FeedRecord>>({
    name: '', type: '精料', inQuantity: 0, inDate: new Date().toISOString().split('T')[0], usageRecords: []
  });

  const [usageForm, setUsageForm] = useState({ quantity: 0, date: new Date().toISOString().split('T')[0], target: '全部羊只' });

  const handleAddUsage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeed) return;
    const updated = {
      ...selectedFeed,
      usageRecords: [...selectedFeed.usageRecords, { ...usageForm }]
    };
    updateFeed(updated);
    setIsUsageModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsAddModalOpen(true)}><i className="fas fa-plus mr-2"></i>入库新饲料</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.feed.map(feed => {
          const used = feed.usageRecords.reduce((acc, curr) => acc + curr.quantity, 0);
          const remaining = feed.inQuantity - used;
          const percent = Math.round((remaining / feed.inQuantity) * 100);

          return (
            <Card key={feed.id}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-xl font-bold">{feed.name}</h4>
                  <span className="text-xs text-gray-400">{feed.type} | 入库: {feed.inDate}</span>
                </div>
                <div className="text-right">
                   <div className="text-2xl font-bold text-green-600">{remaining}</div>
                   <div className="text-xs text-gray-400">剩余 (斤/kg)</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>消耗进度</span>
                  <span>{percent}% 剩余</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="secondary" className="w-full text-sm" onClick={() => { setSelectedFeed(feed); setIsUsageModalOpen(true); }}>
                  <i className="fas fa-utensils mr-2"></i>记录领用
                </Button>
              </div>
            </Card>
          );
        })}
        {data.feed.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border-2 border-dashed border-gray-200">
            暂无库存饲料，请先点击右上角入库。
          </div>
        )}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="饲料入库登记">
        <form onSubmit={e => {
          e.preventDefault();
          addFeed({...form, id: `FD${Date.now()}`, usageRecords: []} as FeedRecord);
          setIsAddModalOpen(false);
        }} className="space-y-4">
          <Label>饲料名称</Label>
          <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="如：精配合饲料、苜蓿干草" />
          <Label>饲料类型</Label>
          <Input value={form.type} onChange={e => setForm({...form, type: e.target.value})} required placeholder="精料、青贮、草料..." />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>入库数量 (斤/kg)</Label>
              <Input type="number" value={form.inQuantity} onChange={e => setForm({...form, inQuantity: parseFloat(e.target.value)})} required />
            </div>
            <div>
              <Label>入库日期</Label>
              <Input type="date" value={form.inDate} onChange={e => setForm({...form, inDate: e.target.value})} />
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>取消</Button>
            <Button type="submit">确认入库</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isUsageModalOpen} onClose={() => setIsUsageModalOpen(false)} title={`饲料消耗登记 - ${selectedFeed?.name}`}>
        <form onSubmit={handleAddUsage} className="space-y-4">
          <Label>领用数量 (斤/kg)</Label>
          <Input type="number" value={usageForm.quantity} onChange={e => setUsageForm({...usageForm, quantity: parseFloat(e.target.value)})} required />
          <Label>领用日期</Label>
          <Input type="date" value={usageForm.date} onChange={e => setUsageForm({...usageForm, date: e.target.value})} />
          <Label>领用目标</Label>
          <Input value={usageForm.target} onChange={e => setUsageForm({...usageForm, target: e.target.value})} placeholder="如：1号圈舍、全部羊只" />
          <div className="pt-4 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsUsageModalOpen(false)}>取消</Button>
            <Button type="submit">保存记录</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
