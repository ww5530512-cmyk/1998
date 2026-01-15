
import React, { useState } from 'react';
import { Card, Button, Label, Input } from './Common';
import { useStore } from '../store';
import { FarmInfo } from '../types';

export const SettingsModule: React.FC = () => {
  const { data, updateFarmInfo } = useStore();
  const [form, setForm] = useState<FarmInfo>(data.farmInfo);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFarmInfo(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sheep_farm_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="max-w-4xl space-y-8">
      <Card title="羊场基础信息配置">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <Label>羊场编号</Label>
               <Input value={form.id} disabled />
             </div>
             <div>
               <Label>羊场名称</Label>
               <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
             </div>
             <div>
               <Label>场主姓名</Label>
               <Input value={form.owner} onChange={e => setForm({...form, owner: e.target.value})} />
             </div>
             <div>
               <Label>联系方式</Label>
               <Input value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} />
             </div>
             <div className="md:col-span-2">
               <Label>详细地址</Label>
               <Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
             </div>
             <div className="md:col-span-2">
               <Label>备注</Label>
               <Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
             </div>
          </div>
          <div className="flex justify-between items-center pt-6">
            <p className={`text-sm text-green-600 font-bold transition-opacity ${isSaved ? 'opacity-100' : 'opacity-0'}`}>
              <i className="fas fa-check-circle mr-2"></i>已成功保存设置
            </p>
            <Button type="submit">保存基本信息</Button>
          </div>
        </form>
      </Card>

      <Card title="数据维护">
        <div className="space-y-6">
           <div>
             <h4 className="font-bold text-gray-800 mb-2">备份与恢复</h4>
             <p className="text-sm text-gray-500 mb-4">建议定期导出数据保存至本地硬盘或云盘，防止浏览器清理导致数据丢失。</p>
             <div className="flex space-x-4">
               <Button variant="secondary" onClick={handleExportData}>
                 <i className="fas fa-file-export mr-2"></i>备份数据 (JSON)
               </Button>
               <Button variant="ghost" onClick={() => alert('暂未开放 CSV 导出，请使用 JSON 备份')}>
                 导出 Excel
               </Button>
             </div>
           </div>
           
           <div className="pt-6 border-t border-gray-100">
             <h4 className="font-bold text-red-600 mb-2">清空数据</h4>
             <p className="text-sm text-gray-500 mb-4">此操作将永久删除当前所有记录，无法撤销。请谨慎操作。</p>
             <Button variant="danger" onClick={() => { if(confirm('确定要清空所有数据吗？')) { localStorage.clear(); window.location.reload(); } }}>
               <i className="fas fa-exclamation-triangle mr-2"></i>重置系统
             </Button>
           </div>
        </div>
      </Card>
    </div>
  );
};
