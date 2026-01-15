
import React, { useState } from 'react';
import { Card, Button, Modal, Label, Input, Select } from './Common';
import { useStore } from '../store';
import { SaleRecord, SheepStatus } from '../types';

export const SalesModule: React.FC = () => {
  const { data, addSale } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState<Partial<SaleRecord>>({
    sheepId: '',
    saleDate: new Date().toISOString().split('T')[0],
    customer: '',
    quantity: 1,
    unitPrice: 0,
    totalAmount: 0,
    paymentMethod: '微信'
  });

  const handlePriceChange = (price: number) => {
    setForm(prev => ({ ...prev, unitPrice: price, totalAmount: price * (prev.quantity || 1) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sheepId || !form.totalAmount) return alert('请选择销售羊只并填写金额');
    addSale({ ...form, id: `SL${Date.now()}` } as SaleRecord);
    setIsModalOpen(false);
  };

  const availableSheep = data.sheep.filter(s => s.status === SheepStatus.IN_PEN);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsModalOpen(true)}><i className="fas fa-cart-plus mr-2"></i>新增销售记录</Button>
      </div>

      <Card title="销售记录列表">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50 text-sm text-gray-500">
                <th className="px-4 py-3 font-semibold">销售耳标</th>
                <th className="px-4 py-3 font-semibold">买家客户</th>
                <th className="px-4 py-3 font-semibold">销售日期</th>
                <th className="px-4 py-3 font-semibold">单价/总金额</th>
                <th className="px-4 py-3 font-semibold">支付方式</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {data.sales.map(record => (
                <tr key={record.id}>
                  <td className="px-4 py-4 font-bold">{record.sheepId}</td>
                  <td className="px-4 py-4">{record.customer || '散客'}</td>
                  <td className="px-4 py-4">{record.saleDate}</td>
                  <td className="px-4 py-4">
                    <div className="font-bold text-green-700">¥{record.totalAmount.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">单价: ¥{record.unitPrice}</div>
                  </td>
                  <td className="px-4 py-4 text-sm">{record.paymentMethod}</td>
                </tr>
              ))}
              {data.sales.length === 0 && (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400">暂无销售记录</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="新增羊只销售登记">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label>选择销售羊只</Label>
          <Select 
            value={form.sheepId} 
            onChange={e => setForm({...form, sheepId: e.target.value})} 
            options={[{label: '请选择待售羊只', value: ''}, ...availableSheep.map(s => ({label: `${s.id} (${s.breed} - ${s.gender})`, value: s.id}))]}
            required
          />
          <Label>客户/买家名称</Label>
          <Input value={form.customer} onChange={e => setForm({...form, customer: e.target.value})} placeholder="选填，如：老王、肉联厂" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>销售日期</Label>
              <Input type="date" value={form.saleDate} onChange={e => setForm({...form, saleDate: e.target.value})} />
            </div>
            <div>
              <Label>支付方式</Label>
              <Select 
                value={form.paymentMethod} 
                onChange={e => setForm({...form, paymentMethod: e.target.value})} 
                options={[{label: '微信', value: '微信'}, {label: '支付宝', value: '支付宝'}, {label: '银行卡', value: '银行卡'}, {label: '现金', value: '现金'}]}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>单价 (元)</Label>
              <Input type="number" value={form.unitPrice} onChange={e => handlePriceChange(parseFloat(e.target.value))} required />
            </div>
            <div>
              <Label>总成交额 (元)</Label>
              <Input type="number" value={form.totalAmount} disabled className="bg-gray-50 font-bold text-green-700" />
            </div>
          </div>
          <div>
            <Label>备注</Label>
            <Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </div>
          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">提示：确认销售后，该羊只状态将自动变更为“已售”，不再计入存栏。</p>
          <div className="pt-4 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button type="submit">确认成交</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
