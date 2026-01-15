
import React, { useState } from 'react';
import { ViewType } from './types';
import { useStore } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { SheepModule } from './components/SheepModule';
import { PenModule } from './components/PenModule';
import { BreedingModule } from './components/BreedingModule';
import { HealthModule } from './components/HealthModule';
import { FeedModule } from './components/FeedModule';
import { SalesModule } from './components/SalesModule';
import { SettingsModule } from './components/SettingsModule';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const { data } = useStore();

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'sheep': return <SheepModule />;
      case 'pens': return <PenModule />;
      case 'breeding': return <BreedingModule />;
      case 'health': return <HealthModule />;
      case 'feed': return <FeedModule />;
      case 'sales': return <SalesModule />;
      case 'settings': return <SettingsModule />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeView={activeView} setView={setActiveView} farmName={data.farmInfo.name}>
      {renderContent()}
    </Layout>
  );
};

export default App;
