
import React, { useState } from 'react';
import { Card, Button, Modal, Label, Input, Select } from './Common';
import { useStore } from '../store';
import { BreedingRecord } from '../types';

export const BreedingModule: React.FC = () => {
  const { data, addBreeding } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState<Partial<BreedingRecord>>({
    eweId: '',
    ramId: '',
    matingDate: new Date().toISOString().split('T')[0],
    matingType: '自然',
    expectedDate: '',
    notes: ''
  });

  const calculateExpectedDate = (matingDate: string) => {
    const date = new Date(matingDate);
    date.setDate(date.getDate() + 150); // Sheep pregnancy is roughly 150 days
    return date.toISOString().split('T')[0];
  };

  const handleMatingDateChange = (date: string) => {
    setForm({
      ...form,
      matingDate: date,
      expectedDate: calculateExpectedDate(date)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.eweId || !form.matingDate) return alert('缺少必填项');
    addBreeding({
      ...form,
      id: `BR${Date.now()}`,
      expectedDate: form.expectedDate || calculateExpectedDate(form.matingDate!)
    } as BreedingRecord);
    setIsModalOpen(false);
  };

  const ewes = data.sheep.filter(s => s.gender === '母');
  const rams = data.sheep.filter(s => s.gender === '公');

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsModalOpen(true)}><i className="fas fa-heart mr-2"></i>记录配种情况</Button>
      </div>

      <Card title="繁殖档案列表">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-gray-600 text-sm">
                <th className="px-4 py-3 font-semibold">母羊耳标</th>
                <th className="px-4 py-3 font-semibold">配种公羊</th>
                <th className="px-4 py-3 font-semibold">配种日期</th>
                <th className="px-4 py-3 font-semibold">配种方式</th>
                <th className="px-4 py-3 font-semibold">预计产羔</th>
                <th className="px-4 py-3 font-semibold">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.breeding.map(record => {
                const isLate = new Date(record.expectedDate) < new Date() && !record.actualDate;
                return (
                  <tr key={record.id}>
                    <td className="px-4 py-4 font-bold">{record.eweId}</td>
                    <td className="px-4 py-4 text-gray-500">{record.ramId || '不详'}</td>
                    <td className="px-4 py-4">{record.matingDate}</td>
                    <td className="px-4 py-4">{record.matingType}</td>
                    <td className={`px-4 py-4 font-medium ${isLate ? 'text-red-600' : 'text-blue-600'}`}>
                      {record.expectedDate}
                      {isLate && <span className="ml-2 text-xs bg-red-100 text-red-600 px-1 rounded">逾期</span>}
                    </td>
                    <td className="px-4 py-4">
                      {record.actualDate ? (
                        <span className="text-green-600 font-medium">已产 ({record.lambCount}只)</span>
                      ) : (
                        <span className="text-gray-400 italic">待产中</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {data.breeding.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400">暂无配种记录</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="登记配种信息">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>母羊耳标号</Label>
              <Select 
                value={form.eweId} 
                onChange={e => setForm({...form, eweId: e.target.value})} 
                options={[{label: '请选择母羊', value: ''}, ...ewes.map(e => ({label: e.id, value: e.id}))]}
                required
              />
            </div>
            <div>
              <Label>公羊耳标号 (选填)</Label>
              <Select 
                value={form.ramId} 
                onChange={e => setForm({...form, ramId: e.target.value})} 
                options={[{label: '不详/野配', value: ''}, ...rams.map(e => ({label: e.id, value: e.id}))]}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>配种日期</Label>
              <Input type="date" value={form.matingDate} onChange={e => handleMatingDateChange(e.target.value)} required />
            </div>
            <div>
              <Label>预计产羔日期 (自动计算)</Label>
              <Input type="date" value={form.expectedDate} disabled className="bg-gray-50 font-bold text-blue-600" />
            </div>
          </div>
          <div>
            <Label>配种方式</Label>
            <Select 
              value={form.matingType} 
              onChange={e => setForm({...form, matingType: e.target.value as any})} 
              options={[{label: '自然交配', value: '自然'}, {label: '人工授精', value: '人工'}]}
            />
          </div>
          <div>
            <Label>备注</Label>
            <Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button type="submit">提交档案</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
