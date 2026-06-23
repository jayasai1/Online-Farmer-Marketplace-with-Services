import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LandingView from './views/LandingView';
import AuthView from './views/AuthView';
import CropsView from './views/CropsView';
import TractorsView from './views/TractorsView';
import LaborsView from './views/LaborsView';
import AgroServicesView from './views/AgroServicesView';
import PriceIndexView from './views/PriceIndexView';
import FarmerDashboard from './views/FarmerDashboard';
import BuyerDashboard from './views/BuyerDashboard';
import './App.css';

const MainLayout = () => {
  const { activeView, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-main text-success">
        <div className="text-center">
          <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="font-heading">Loading AgroMarket Pro...</h4>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'landing':
        return <LandingView />;
      case 'auth':
        return <AuthView />;
      case 'crops':
        return <CropsView />;
      case 'tractors':
        return <TractorsView />;
      case 'labors':
        return <LaborsView />;
      case 'agroservices':
        return <AgroServicesView />;
      case 'prices':
        return <PriceIndexView />;
      case 'farmer-dashboard':
        return <FarmerDashboard />;
      case 'buyer-dashboard':
        return <BuyerDashboard />;
      default:
        return <LandingView />;
    }
  };

  return (
    <div className="app-wrapper">
      <Sidebar />
      <main className="main-content">
        <Header />
        {renderView()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
