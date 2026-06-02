/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar, Header, ViewType } from './components/Navigation';
import { DashboardView } from './components/Dashboard';
import { FleetView } from './components/Fleet';
import { DriversView } from './components/Drivers';
import { TripsView } from './components/Trips';
import { CostsView } from './components/Costs';
import { FuelView } from './components/Fuel';
import { Card } from './components/UI';
import { motion, AnimatePresence } from 'motion/react';
import { Construction } from 'lucide-react';
import { MOCK_EXPENSES, MOCK_VEHICLES, MOCK_TRIPS, MOCK_FUEL_FILLUPS, MOCK_DRIVERS, MOCK_MAINTENANCE } from './constants';
import { Expense, Vehicle, Trip, FuelFillup, Driver, MaintenanceRecord } from './types';
import { generateAlerts } from './lib/alerts';

const PlaceholderView = ({ title }: { title: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="h-[calc(100vh-12rem)] flex flex-col items-center justify-center text-center space-y-4"
  >
    <div className="w-20 h-20 bg-elegant-card rounded-full flex items-center justify-center border border-elegant-border">
      <Construction className="text-elegant-accent" size={40} />
    </div>
    <div>
      <h2 className="text-2xl font-bold text-elegant-text">{title}</h2>
      <p className="text-elegant-dim max-w-md mx-auto mt-2">
        Este módulo está em desenvolvimento. Em breve você terá acesso completo às funcionalidades de {title.toLowerCase()}.
      </p>
    </div>
    <button className="px-6 py-2 bg-elegant-card border border-elegant-border rounded-md text-sm font-medium hover:bg-white/5 transition-colors text-elegant-text">
      Voltar ao Dashboard
    </button>
  </motion.div>
);

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  const [fuelFillups, setFuelFillups] = useState<FuelFillup[]>(MOCK_FUEL_FILLUPS);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(MOCK_MAINTENANCE);

  const alerts = generateAlerts(vehicles, drivers, maintenanceRecords);
  const alertCount = alerts.length;

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses(prev => [newExpense, ...prev]);
  };

  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles(prev => [newVehicle, ...prev]);
  };

  const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles(prev => prev.filter(v => v.id !== vehicleId));
  };

  const handleAddTrip = (newTrip: Trip) => {
    setTrips(prev => [newTrip, ...prev]);
  };

  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
  };

  const handleAddFuelFillup = (newFillup: FuelFillup) => {
    setFuelFillups(prev => [newFillup, ...prev]);
  };

  const handleAddDriver = (newDriver: Driver) => {
    setDrivers(prev => [newDriver, ...prev]);
  };

  const handleUpdateDriver = (updatedDriver: Driver) => {
    setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? updatedDriver : d));
  };

  const handleDeleteDriver = (driverId: string) => {
    setDrivers(prev => prev.filter(d => d.id !== driverId));
  };

  const handleAddMaintenance = (record: MaintenanceRecord) => {
    setMaintenanceRecords(prev => [record, ...prev]);
    
    // Update vehicle status if in progress
    if (record.status === 'in-progress') {
      setVehicles(prev => prev.map(v => 
        v.id === record.vehicleId ? { ...v, status: 'maintenance' } : v
      ));
    }

    // Also add to expenses if completed
    if (record.status === 'completed') {
      const newExpense: Expense = {
        id: `maint-${record.id}`,
        vehicleId: record.vehicleId,
        category: 'maintenance',
        amount: record.cost,
        date: record.date,
        description: `Manutenção: ${record.description}`,
      };
      setExpenses(prev => [newExpense, ...prev]);
      
      // Return vehicle to active if it was in maintenance
      setVehicles(prev => prev.map(v => 
        v.id === record.vehicleId ? { ...v, status: 'active' } : v
      ));
    }
  };

  const handleUpdateMaintenance = (updatedRecord: MaintenanceRecord) => {
    setMaintenanceRecords(prev => {
      const oldRecord = prev.find(r => r.id === updatedRecord.id);
      const newRecords = prev.map(r => r.id === updatedRecord.id ? updatedRecord : r);
      
      // If status changed to in-progress, update vehicle status
      if (oldRecord?.status !== 'in-progress' && updatedRecord.status === 'in-progress') {
        setVehicles(prevVeh => prevVeh.map(v => 
          v.id === updatedRecord.vehicleId ? { ...v, status: 'maintenance' } : v
        ));
      }

      // If status changed to completed, add to expenses and return vehicle to active
      if (oldRecord?.status !== 'completed' && updatedRecord.status === 'completed') {
        const newExpense: Expense = {
          id: `maint-${updatedRecord.id}`,
          vehicleId: updatedRecord.vehicleId,
          category: 'maintenance',
          amount: updatedRecord.cost,
          date: updatedRecord.date,
          description: `Manutenção: ${updatedRecord.description}`,
        };
        setExpenses(prevExp => [newExpense, ...prevExp]);

        setVehicles(prevVeh => prevVeh.map(v => 
          v.id === updatedRecord.vehicleId ? { ...v, status: 'active' } : v
        ));
      }
      
      return newRecords;
    });
  };

  const handleDeleteMaintenance = (id: string) => {
    setMaintenanceRecords(prev => prev.filter(r => r.id !== id));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView 
            vehicles={vehicles} 
            drivers={drivers} 
            trips={trips} 
            maintenance={maintenanceRecords}
            onNavigate={setActiveView}
          />
        );
      case 'fleet':
        return (
          <FleetView 
            vehicles={vehicles} 
            onAddVehicle={handleAddVehicle} 
            onUpdateVehicle={handleUpdateVehicle} 
            onDeleteVehicle={handleDeleteVehicle}
            trips={trips}
            maintenance={maintenanceRecords}
            onNavigate={setActiveView}
          />
        );
      case 'drivers':
        return (
          <DriversView 
            drivers={drivers} 
            onAddDriver={handleAddDriver} 
            onUpdateDriver={handleUpdateDriver} 
            onDeleteDriver={handleDeleteDriver}
            trips={trips}
            vehicles={vehicles}
          />
        );
      case 'trips':
        return (
          <TripsView 
            trips={trips} 
            onAddTrip={handleAddTrip} 
            onUpdateTrip={handleUpdateTrip}
            vehicles={vehicles}
            drivers={drivers}
          />
        );
      case 'expenses':
        return (
          <CostsView 
            expenses={expenses} 
            onAddExpense={handleAddExpense} 
            maintenanceRecords={maintenanceRecords}
            onAddMaintenance={handleAddMaintenance}
            onUpdateMaintenance={handleUpdateMaintenance}
            onDeleteMaintenance={handleDeleteMaintenance}
            vehicles={vehicles}
          />
        );
      case 'fuel':
        return <FuelView fillups={fuelFillups} onAddFillup={handleAddFuelFillup} vehicles={vehicles} />;
      case 'tolls':
        return <PlaceholderView title="Pedágios & Taxas" />;
      case 'contracts':
        return <PlaceholderView title="Gestão de Contratos" />;
      case 'analysis':
        return <PlaceholderView title="Análises & Relatórios" />;
      case 'settings':
        return <PlaceholderView title="Configurações do Sistema" />;
      default:
        return (
          <DashboardView 
            vehicles={vehicles} 
            drivers={drivers} 
            trips={trips} 
            maintenance={maintenanceRecords}
            onNavigate={setActiveView}
          />
        );
    }
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Dashboard Operacional';
      case 'fleet': return 'Gestão de Frota';
      case 'drivers': return 'Motoristas';
      case 'trips': return 'Viagens';
      case 'expenses': return 'Custos & Manutenção';
      case 'fuel': return 'Combustível';
      case 'tolls': return 'Pedágios & Taxas';
      case 'contracts': return 'Contratos';
      case 'analysis': return 'Análises';
      case 'settings': return 'Configurações';
      default: return 'HE Travels&Tuors';
    }
  };

  return (
    <div className="flex min-h-screen bg-elegant-bg">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Header 
          title={getViewTitle()} 
          onMenuClick={() => setIsSidebarOpen(true)}
          alertCount={alertCount}
        />
        
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <footer className="p-4 border-t border-elegant-border bg-elegant-bg/50 flex justify-between items-center text-[10px] font-mono text-elegant-dim">
          <div>© 2026 HE TRAVELS&TUORS • SISTEMA DE GESTÃO DE TRANSPORTES</div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-elegant-success" /> SERVIDOR: US-WEST-1</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-elegant-success" /> DATABASE: FIRESTORE-PROD</span>
            <span>VERSÃO: 2.4.0-STABLE</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

