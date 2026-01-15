
import React from 'react';
import { ViewType } from '../types';

interface SidebarItemProps {
  id: ViewType;
  label: string;
  icon: string;
  active: boolean;
  onClick: (id: ViewType) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ id, label, icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center w-full px-4 py-3 mb-2 transition-colors rounded-lg ${
      active ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
    }`}
  >
    <i className={`fas ${icon} w-6 mr-3`}></i>
    <span className="font-medium">{label}</span>
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setView: (v: ViewType) => void;
  farmName: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, setView, farmName }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center space-x-3 border-b border-gray-100 mb-4">
          <div className="bg-green-600 p-2 rounded-lg">
            <i className="fas fa-sheep text-white text-xl"></i>
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-800 leading-tight">羊悦管</h1>
            <p className="text-xs text-gray-500 truncate w-32">{farmName}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto">
          <SidebarItem id="dashboard" label="控制面板" icon="fa-chart-line" active={activeView === 'dashboard'} onClick={setView} />
          <SidebarItem id="sheep" label="羊只档案" icon="fa-id-card" active={activeView === 'sheep'} onClick={setView} />
          <SidebarItem id="pens" label="圈舍管理" icon="fa-warehouse" active={activeView === 'pens'} onClick={setView} />
          <SidebarItem id="breeding" label="繁殖管理" icon="fa-heart" active={activeView === 'breeding'} onClick={setView} />
          <SidebarItem id="health" label="防疫疾病" icon="fa-hand-holding-medical" active={activeView === 'health'} onClick={setView} />
          <SidebarItem id="feed" label="饲料管理" icon="fa-wheat-awn" active={activeView === 'feed'} onClick={setView} />
          <SidebarItem id="sales" label="销售管理" icon="fa-sack-dollar" active={activeView === 'sales'} onClick={setView} />
          <SidebarItem id="settings" label="系统设置" icon="fa-cog" active={activeView === 'settings'} onClick={setView} />
        </nav>

        <div className="p-4 border-t border-gray-100">
           <p className="text-xs text-center text-gray-400">© 2024 羊悦管管理系统</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            {activeView === 'dashboard' && '控制面板'}
            {activeView === 'sheep' && '羊只档案管理'}
            {activeView === 'pens' && '圈舍管理'}
            {activeView === 'breeding' && '繁殖管理'}
            {activeView === 'health' && '防疫与疾病管理'}
            {activeView === 'feed' && '饲料库存管理'}
            {activeView === 'sales' && '销售管理'}
            {activeView === 'settings' && '系统设置'}
          </h2>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-green-600 transition-colors">
              <i className="far fa-bell text-lg"></i>
            </button>
            <div className="h-8 w-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
              {farmName[0]}
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {children}
        </section>
      </main>
    </div>
  );
};
