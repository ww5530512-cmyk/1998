
import React, { useState } from 'react';
import { Card, Button, Modal, Label, Input, Select } from './Common';
import { useStore } from '../store';
import { Sheep, SheepStatus } from '../types';

export const SheepModule: React.FC = () => {
  const { data, addSheep, updateSheep, deleteSheep } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSheep, setEditingSheep] = useState<Sheep | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState<Partial<Sheep>>({
    id: '',
    breed: '小尾寒羊',
    gender: '母',
    birthDate: new Date().toISOString().split('T')[0],
    status: SheepStatus.IN_PEN,
    penId: data.pens[0]?.id || '',
    source: '自繁'
  });

  const handleOpenAdd = () => {
    setEditingSheep(null);
    setForm({
      id: '',
      breed: '小尾寒羊',
      gender: '母',
      birthDate: new Date().toISOString().split('T')[0],
      status: SheepStatus.IN_PEN,
      penId: data.pens[0]?.id || '',
      source: '自繁',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Sheep) => {
    setEditingSheep(s);
    setForm(s);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.penId) return alert('请完善信息');

    if (editingSheep) {
      updateSheep(form as Sheep);
    } else {
      if (data.sheep.some(s => s.id === form.id)) return alert('耳标号已存在');
      addSheep({ ...form as Sheep, farmId: data.farmInfo.id });
    }
    setIsModalOpen(false);
  };

  const filteredSheep = data.sheep.filter(s => 
    s.id.includes(searchTerm) || s.breed.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <Input 
            placeholder="搜索耳标号或品种..." 
            className="pl-10" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleOpenAdd}><i className="fas fa-plus mr-2"></i>录入新羊只</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">耳标号</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">品种</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">性别</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">圈舍</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">当前状态</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">出生日期</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSheep.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-bold text-green-700">{s.id}</td>
                  <td className="px-4 py-4">{s.breed}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${s.gender === '公' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                      {s.gender}
                    </span>
                  </td>
                  <td className="px-4 py-4">{data.pens.find(p => p.id === s.penId)?.name || '未知'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      s.status === SheepStatus.IN_PEN ? 'bg-green-100 text-green-700' : 
                      s.status === SheepStatus.SOLD ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{s.birthDate}</td>
                  <td className="px-4 py-4">
                    <button onClick={() => handleOpenEdit(s)} className="text-blue-500 hover:text-blue-700 mr-3">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button onClick={() => {if(confirm('确定删除吗?')) deleteSheep(s.id)}} className="text-red-400 hover:text-red-600">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSheep.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <i className="fas fa-inbox text-4xl mb-2 opacity-20"></i>
                      <p>暂无相关记录</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSheep ? '修改信息' : '录入信息'}>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <Label>羊只耳标号 (唯一)</Label>
            <Input 
              value={form.id} 
              onChange={e => setForm({...form, id: e.target.value})} 
              disabled={!!editingSheep} 
              placeholder="请输入或扫描耳标"
              required
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <Label>品种</Label>
            <Input value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} />
          </div>
          <div>
            <Label>性别</Label>
            <Select 
              value={form.gender} 
              onChange={e => setForm({...form, gender: e.target.value as '公' | '母'})} 
              options={[{label: '母羊', value: '母'}, {label: '公羊', value: '公'}]}
            />
          </div>
          <div>
            <Label>来源</Label>
            <Select 
              value={form.source} 
              onChange={e => setForm({...form, source: e.target.value as '自繁' | '外购'})} 
              options={[{label: '自繁', value: '自繁'}, {label: '外购', value: '外购'}]}
            />
          </div>
          <div>
            <Label>出生日期</Label>
            <Input type="date" value={form.birthDate} onChange={e => setForm({...form, birthDate: e.target.value})} />
          </div>
          <div>
            <Label>所属圈舍</Label>
            <Select 
              value={form.penId} 
              onChange={e => setForm({...form, penId: e.target.value})} 
              options={data.pens.map(p => ({ label: p.name, value: p.id }))}
            />
          </div>
          <div className="col-span-2">
            <Label>状态</Label>
            <Select 
              value={form.status} 
              onChange={e => setForm({...form, status: e.target.value as SheepStatus})} 
              options={Object.values(SheepStatus).map(v => ({label: v, value: v}))}
            />
          </div>
          <div className="col-span-2">
            <Label>备注</Label>
            <Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="选填..." />
          </div>
          <div className="col-span-2 mt-4 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button type="submit">保存存档</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
