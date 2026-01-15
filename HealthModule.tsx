
import React, { useState } from 'react';
import { Card, Button, Modal, Label, Input, Select } from './Common';
import { useStore } from '../store';
import { PreventionRecord, DiseaseRecord, SheepStatus } from '../types';

export const HealthModule: React.FC = () => {
  const { data, addPrevention, addDisease } = useStore();
  const [activeTab, setActiveTab] = useState<'prevention' | 'disease'>('prevention');
  const [isPreventionModalOpen, setIsPreventionModalOpen] = useState(false);
  const [isDiseaseModalOpen, setIsDiseaseModalOpen] = useState(false);

  const [prevForm, setPrevForm] = useState<Partial<PreventionRecord>>({
    sheepId: '', project: '三联四防', date: new Date().toISOString().split('T')[0], nextDate: '', operator: '管理员'
  });

  const [diseaseForm, setDiseaseForm] = useState<Partial<DiseaseRecord>>({
    sheepId: '', onsetDate: new Date().toISOString().split('T')[0], outcome: '痊愈'
  });

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('prevention')}
          className={`px-6 py-2 font-bold transition-all ${activeTab === 'prevention' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-400'}`}
        >
          防疫疫苗
        </button>
        <button 
          onClick={() => setActiveTab('disease')}
          className={`px-6 py-2 font-bold transition-all ${activeTab === 'disease' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-400'}`}
        >
          疾病诊疗
        </button>
      </div>

      {activeTab === 'prevention' ? (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setIsPreventionModalOpen(true)}><i className="fas fa-syringe mr-2"></i>记录接种</Button>
          </div>
          <Card title="防疫接种记录">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50 text-sm text-gray-500">
                  <th className="px-4 py-3 font-semibold">羊耳标</th>
                  <th className="px-4 py-3 font-semibold">疫苗项目</th>
                  <th className="px-4 py-3 font-semibold">接种日期</th>
                  <th className="px-4 py-3 font-semibold">下次接种</th>
                  <th className="px-4 py-3 font-semibold">操作人</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-700">
                {data.prevention.map(r => (
                  <tr key={r.id}>
                    <td className="px-4 py-4 font-bold">{r.sheepId}</td>
                    <td className="px-4 py-4">{r.project}</td>
                    <td className="px-4 py-4">{r.date}</td>
                    <td className="px-4 py-4 text-orange-600 font-medium">{r.nextDate}</td>
                    <td className="px-4 py-4">{r.operator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      ) : (
        <>
          <div className="flex justify-end">
            <Button variant="danger" onClick={() => setIsDiseaseModalOpen(true)}><i className="fas fa-notes-medical mr-2"></i>记录病例</Button>
          </div>
          <Card title="疾病诊断与治疗列表">
             <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50 text-sm text-gray-500">
                  <th className="px-4 py-3 font-semibold">发病羊</th>
                  <th className="px-4 py-3 font-semibold">疾病名称</th>
                  <th className="px-4 py-3 font-semibold">发病日期</th>
                  <th className="px-4 py-3 font-semibold">治疗方案</th>
                  <th className="px-4 py-3 font-semibold">结果</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-700">
                {data.disease.map(r => (
                  <tr key={r.id}>
                    <td className="px-4 py-4 font-bold">{r.sheepId}</td>
                    <td className="px-4 py-4">{r.diseaseName}</td>
                    <td className="px-4 py-4">{r.onsetDate}</td>
                    <td className="px-4 py-4 text-sm max-w-xs truncate">{r.treatment}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${r.outcome === '痊愈' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {r.outcome}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {/* Prevention Modal */}
      <Modal isOpen={isPreventionModalOpen} onClose={() => setIsPreventionModalOpen(false)} title="防疫记录录入">
        <form onSubmit={e => {
          e.preventDefault();
          addPrevention({...prevForm, id: `PV${Date.now()}`} as PreventionRecord);
          setIsPreventionModalOpen(false);
        }} className="space-y-4">
          <Label>羊只耳标号</Label>
          <Select 
            value={prevForm.sheepId} 
            onChange={e => setPrevForm({...prevForm, sheepId: e.target.value})} 
            options={[{label: '选择羊只', value: ''}, ...data.sheep.map(s => ({label: s.id, value: s.id}))]}
            required
          />
          <Label>疫苗名称</Label>
          <Input value={prevForm.project} onChange={e => setPrevForm({...prevForm, project: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>接种日期</Label>
              <Input type="date" value={prevForm.date} onChange={e => setPrevForm({...prevForm, date: e.target.value})} />
            </div>
            <div>
              <Label>下次建议接种</Label>
              <Input type="date" value={prevForm.nextDate} onChange={e => setPrevForm({...prevForm, nextDate: e.target.value})} />
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsPreventionModalOpen(false)}>取消</Button>
            <Button type="submit">保存记录</Button>
          </div>
        </form>
      </Modal>

      {/* Disease Modal */}
      <Modal isOpen={isDiseaseModalOpen} onClose={() => setIsDiseaseModalOpen(false)} title="新增疾病诊疗单">
        <form onSubmit={e => {
          e.preventDefault();
          addDisease({...diseaseForm, id: `DS${Date.now()}`} as DiseaseRecord);
          setIsDiseaseModalOpen(false);
        }} className="space-y-4">
          <Label>羊只耳标号</Label>
          <Select 
            value={diseaseForm.sheepId} 
            onChange={e => setDiseaseForm({...diseaseForm, sheepId: e.target.value})} 
            options={[{label: '选择发病羊只', value: ''}, ...data.sheep.map(s => ({label: s.id, value: s.id}))]}
            required
          />
          <Label>疾病名称</Label>
          <Input value={diseaseForm.diseaseName} onChange={e => setDiseaseForm({...diseaseForm, diseaseName: e.target.value})} required placeholder="如：羊口疮、肠胃炎" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>发病日期</Label>
              <Input type="date" value={diseaseForm.onsetDate} onChange={e => setDiseaseForm({...diseaseForm, onsetDate: e.target.value})} />
            </div>
            <div>
              <Label>治疗结果</Label>
              <Select 
                value={diseaseForm.outcome} 
                onChange={e => setDiseaseForm({...diseaseForm, outcome: e.target.value as any})} 
                options={[{label: '痊愈', value: '痊愈'}, {label: '死亡', value: '死亡'}]}
              />
            </div>
          </div>
          <div>
            <Label>症状与诊治描述</Label>
            <textarea 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              rows={3}
              value={diseaseForm.treatment}
              onChange={e => setDiseaseForm({...diseaseForm, treatment: e.target.value})}
              placeholder="记录主要症状、用药情况及剂量..."
            />
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsDiseaseModalOpen(false)}>取消</Button>
            <Button type="submit" variant="danger">保存病案</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
