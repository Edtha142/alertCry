import { useState } from 'react';
import Navigation from '@/components/Layout/Navigation';
import Dashboard from './Dashboard';
import Alerts from './Alerts';
import Positions from './Positions';
import Configuration from './Configuration';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'alerts':
        return <Alerts />;
      case 'positions':
        return <Positions />;
      case 'config':
        return <Configuration />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default Index;
