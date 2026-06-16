import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, Header, ViewType } from './components/Navigation';
import { AuthScreen } from './components/Auth';
import { DashboardView } from './components/Dashboard';
import { FleetView } from './components/Fleet';
import { DriversView } from './components/Drivers';
import { TripsView } from './components/Trips';
import { CostsView } from './components/Costs';
import { FuelView } from './components/Fuel';
import { supabase } from './lib/supabase';
import { Card } from './components/UI';
import { motion, AnimatePresence } from 'motion/react';
import { Construction } from 'lucide-react';
import { Vehicle, Driver, Trip, Expense, FuelFillup, MaintenanceRecord } from './types';
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

function mapCreatedBy(email?: string | null) {
  return email ? { id: email, email } : undefined;
}

function mapVehicle(row: any): Vehicle {
  return {
    id: row.id,
    name: row.name || row.plate,
    plate: row.plate,
    model: row.model,
    year: row.year,
    status: row.status,
    currentKm: Number(row.current_km),
    costPerKm: Number(row.cost_per_km),
    nextMaintenanceKm: row.next_maintenance_km ? Number(row.next_maintenance_km) : 0,
    insuranceExpiry: row.insurance_expiry || '',
    createdBy: mapCreatedBy(row.created_by),
    updatedBy: mapCreatedBy(row.updated_by),
  };
}

function mapDriver(row: any): Driver {
  return {
    id: row.id,
    name: row.name,
    cnh: row.cnh,
    cnhExpiry: row.cnh_expiry,
    status: row.status,
    productivity: Number(row.productivity),
    occurrences: Number(row.occurrences),
    createdBy: mapCreatedBy(row.created_by),
    updatedBy: mapCreatedBy(row.updated_by),
  };
}

function mapTrip(row: any): Trip {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    driverId: row.driver_id,
    origin: row.origin,
    destination: row.destination,
    distance: Number(row.distance),
    cargo: row.cargo || '',
    revenue: Number(row.revenue),
    cost: Number(row.cost),
    margin: Number(row.margin),
    date: row.date,
    status: row.status,
    createdBy: mapCreatedBy(row.created_by),
    updatedBy: mapCreatedBy(row.updated_by),
  };
}

function mapExpense(row: any): Expense {
  return {
    id: row.id,
    vehicleId: row.vehicle_id || '',
    category: row.category,
    amount: Number(row.amount),
    date: row.date,
    description: row.description || '',
    invoiceNumber: row.invoice_number || undefined,
    createdBy: mapCreatedBy(row.created_by),
  };
}

function mapFuelFillup(row: any): FuelFillup {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    date: row.date,
    liters: Number(row.liters),
    pricePerLiter: Number(row.price_per_liter),
    totalAmount: Number(row.total_amount),
    currentKm: Number(row.current_km),
    stationName: row.station_name,
    createdBy: mapCreatedBy(row.created_by),
    updatedBy: mapCreatedBy(row.updated_by),
  };
}

function mapMaintenanceRecord(row: any): MaintenanceRecord {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    type: row.type,
    description: row.description,
    cost: Number(row.cost),
    date: row.date,
    status: row.status,
    createdBy: mapCreatedBy(row.created_by),
    updatedBy: mapCreatedBy(row.updated_by),
  };
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [fuelFillups, setFuelFillups] = useState<FuelFillup[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          { data: vehiclesData },
          { data: driversData },
          { data: tripsData },
          { data: expensesData },
          { data: fuelData },
          { data: maintenanceData },
        ] = await Promise.all([
          supabase.from('vehicles').select('*'),
          supabase.from('drivers').select('*'),
          supabase.from('trips').select('*'),
          supabase.from('expenses').select('*'),
          supabase.from('fuel_fillups').select('*'),
          supabase.from('maintenance_records').select('*'),
        ]);

        if (vehiclesData) setVehicles(vehiclesData.map(mapVehicle));
        if (driversData) setDrivers(driversData.map(mapDriver));
        if (tripsData) setTrips(tripsData.map(mapTrip));
        if (expensesData) setExpenses(expensesData.map(mapExpense));
        if (fuelData) setFuelFillups(fuelData.map(mapFuelFillup));
        if (maintenanceData) setMaintenanceRecords(maintenanceData.map(mapMaintenanceRecord));
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const alerts = generateAlerts(vehicles, drivers, maintenanceRecords);
  const alertCount = alerts.length;

  const userEmail = session?.user?.email || '';

  const handleAddExpense = useCallback(async (newExpense: Expense) => {
    const { data, error } = await supabase.from('expenses').insert({
      vehicle_id: newExpense.vehicleId || null,
      category: newExpense.category,
      amount: newExpense.amount,
      date: newExpense.date,
      description: newExpense.description,
      invoice_number: newExpense.invoiceNumber || null,
      created_by: userEmail,
    }).select().single();

    if (error) { console.error(error); return; }
    setExpenses(prev => [mapExpense(data), ...prev]);
  }, [userEmail]);

  const handleAddVehicle = useCallback(async (newVehicle: Vehicle) => {
    const { data, error } = await supabase.from('vehicles').insert({
      name: newVehicle.name || null,
      plate: newVehicle.plate,
      model: newVehicle.model,
      year: newVehicle.year,
      status: newVehicle.status,
      current_km: newVehicle.currentKm,
      cost_per_km: newVehicle.costPerKm,
      next_maintenance_km: newVehicle.nextMaintenanceKm,
      insurance_expiry: newVehicle.insuranceExpiry || null,
      created_by: userEmail,
    }).select().single();

    if (error) { console.error(error); return; }
    setVehicles(prev => [mapVehicle(data), ...prev]);
  }, [userEmail]);

  const handleUpdateVehicle = useCallback(async (updatedVehicle: Vehicle) => {
    const { error } = await supabase.from('vehicles').update({
      name: updatedVehicle.name || null,
      plate: updatedVehicle.plate,
      model: updatedVehicle.model,
      year: updatedVehicle.year,
      status: updatedVehicle.status,
      current_km: updatedVehicle.currentKm,
      cost_per_km: updatedVehicle.costPerKm,
      next_maintenance_km: updatedVehicle.nextMaintenanceKm,
      insurance_expiry: updatedVehicle.insuranceExpiry || null,
      updated_by: userEmail,
    }).eq('id', updatedVehicle.id);

    if (error) { console.error(error); return; }
    setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
  }, [userEmail]);

  const handleDeleteVehicle = useCallback(async (vehicleId: string) => {
    const { error } = await supabase.from('vehicles').delete().eq('id', vehicleId);
    if (error) { console.error(error); return; }
    setVehicles(prev => prev.filter(v => v.id !== vehicleId));
  }, []);

  const handleAddTrip = useCallback(async (newTrip: Trip) => {
    const { data, error } = await supabase.from('trips').insert({
      vehicle_id: newTrip.vehicleId,
      driver_id: newTrip.driverId,
      origin: newTrip.origin,
      destination: newTrip.destination,
      distance: newTrip.distance,
      cargo: newTrip.cargo,
      revenue: newTrip.revenue,
      cost: newTrip.cost,
      date: newTrip.date,
      status: newTrip.status,
      created_by: userEmail,
    }).select().single();

    if (error) { console.error(error); return; }
    setTrips(prev => [mapTrip(data), ...prev]);
  }, [userEmail]);

  const handleUpdateTrip = useCallback(async (updatedTrip: Trip) => {
    const { error } = await supabase.from('trips').update({
      status: updatedTrip.status,
      updated_by: userEmail,
    }).eq('id', updatedTrip.id);

    if (error) { console.error(error); return; }
    setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
  }, [userEmail]);

  const handleAddFuelFillup = useCallback(async (newFillup: FuelFillup) => {
    const { data, error } = await supabase.from('fuel_fillups').insert({
      vehicle_id: newFillup.vehicleId,
      date: newFillup.date,
      liters: newFillup.liters,
      price_per_liter: newFillup.pricePerLiter,
      total_amount: newFillup.totalAmount,
      current_km: newFillup.currentKm,
      station_name: newFillup.stationName,
      created_by: userEmail,
    }).select().single();

    if (error) { console.error(error); return; }
    setFuelFillups(prev => [mapFuelFillup(data), ...prev]);

    // Create corresponding expense entry for fuel cost
    const { data: expenseData, error: expenseError } = await supabase.from('expenses').insert({
      vehicle_id: newFillup.vehicleId,
      category: 'fuel',
      amount: newFillup.totalAmount,
      date: newFillup.date,
      description: `Abastecimento - ${newFillup.stationName}`,
      created_by: userEmail,
    }).select().single();

    if (!expenseError && expenseData) {
      setExpenses(prev => [mapExpense(expenseData), ...prev]);
    }
  }, [userEmail]);

  const handleUpdateFuelFillup = useCallback(async (updatedFillup: FuelFillup) => {
    const newTotal = updatedFillup.liters * updatedFillup.pricePerLiter;
    const { error } = await supabase.from('fuel_fillups').update({
      date: updatedFillup.date,
      liters: updatedFillup.liters,
      price_per_liter: updatedFillup.pricePerLiter,
      total_amount: newTotal,
      current_km: updatedFillup.currentKm,
      station_name: updatedFillup.stationName,
      updated_by: userEmail,
    }).eq('id', updatedFillup.id);

    if (error) { console.error(error); return; }
    setFuelFillups(prev => prev.map(f =>
      f.id === updatedFillup.id ? { ...updatedFillup, totalAmount: newTotal, updatedBy: mapCreatedBy(userEmail) } : f
    ));

    // Update corresponding expense
    const { data: matchingExpenses } = await supabase.from('expenses')
      .select('id')
      .eq('category', 'fuel')
      .eq('vehicle_id', updatedFillup.vehicleId)
      .eq('date', updatedFillup.date);

    if (matchingExpenses && matchingExpenses.length > 0) {
      const expenseId = matchingExpenses[matchingExpenses.length - 1].id;
      await supabase.from('expenses').update({
        amount: newTotal,
        description: `Abastecimento - ${updatedFillup.stationName}`,
      }).eq('id', expenseId);

      setExpenses(prev => prev.map(e =>
        e.id === expenseId
          ? { ...e, amount: newTotal, description: `Abastecimento - ${updatedFillup.stationName}` }
          : e
      ));
    }
  }, [userEmail]);

  const handleDeleteFuelFillup = useCallback(async (fillupId: string) => {
    const fillup = fuelFillups.find(f => f.id === fillupId);
    if (!fillup) return;

    const { error } = await supabase.from('fuel_fillups').delete().eq('id', fillupId);
    if (error) { console.error(error); return; }
    setFuelFillups(prev => prev.filter(f => f.id !== fillupId));

    // Delete corresponding expense
    const { data: matchingExpenses } = await supabase.from('expenses')
      .select('id')
      .eq('category', 'fuel')
      .eq('vehicle_id', fillup.vehicleId)
      .eq('date', fillup.date);

    if (matchingExpenses && matchingExpenses.length > 0) {
      const expenseId = matchingExpenses[matchingExpenses.length - 1].id;
      await supabase.from('expenses').delete().eq('id', expenseId);
      setExpenses(prev => prev.filter(e => e.id !== expenseId));
    }
  }, [fuelFillups]);

  const handleAddDriver = useCallback(async (newDriver: Driver) => {
    const { data, error } = await supabase.from('drivers').insert({
      name: newDriver.name,
      cnh: newDriver.cnh,
      cnh_expiry: newDriver.cnhExpiry,
      status: newDriver.status,
      productivity: newDriver.productivity,
      occurrences: newDriver.occurrences,
      created_by: userEmail,
    }).select().single();

    if (error) { console.error(error); return; }
    setDrivers(prev => [mapDriver(data), ...prev]);
  }, [userEmail]);

  const handleUpdateDriver = useCallback(async (updatedDriver: Driver) => {
    const { error } = await supabase.from('drivers').update({
      name: updatedDriver.name,
      cnh: updatedDriver.cnh,
      cnh_expiry: updatedDriver.cnhExpiry,
      status: updatedDriver.status,
      productivity: updatedDriver.productivity,
      occurrences: updatedDriver.occurrences,
      updated_by: userEmail,
    }).eq('id', updatedDriver.id);

    if (error) { console.error(error); return; }
    setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? updatedDriver : d));
  }, [userEmail]);

  const handleDeleteDriver = useCallback(async (driverId: string) => {
    const { error } = await supabase.from('drivers').delete().eq('id', driverId);
    if (error) { console.error(error); return; }
    setDrivers(prev => prev.filter(d => d.id !== driverId));
  }, []);

  const handleAddMaintenance = useCallback(async (record: MaintenanceRecord) => {
    const { data, error } = await supabase.from('maintenance_records').insert({
      vehicle_id: record.vehicleId,
      type: record.type,
      description: record.description,
      cost: record.cost,
      date: record.date,
      status: record.status,
      created_by: userEmail,
    }).select().single();

    if (error) { console.error(error); return; }
    const mapped = mapMaintenanceRecord(data);
    setMaintenanceRecords(prev => [mapped, ...prev]);

    if (record.status === 'in-progress') {
      setVehicles(prev => prev.map(v =>
        v.id === record.vehicleId ? { ...v, status: 'maintenance' as const } : v
      ));
    }

    if (record.status === 'completed') {
      const newExpense: Expense = {
        id: `maint-${mapped.id}`,
        vehicleId: record.vehicleId,
        category: 'maintenance',
        amount: record.cost,
        date: record.date,
        description: `Manutenção: ${record.description}`,
      };
      setExpenses(prev => [newExpense, ...prev]);
      setVehicles(prev => prev.map(v =>
        v.id === record.vehicleId ? { ...v, status: 'active' as const } : v
      ));
    }
  }, []);

  const handleUpdateMaintenance = useCallback(async (updatedRecord: MaintenanceRecord) => {
    const oldRecord = maintenanceRecords.find(r => r.id === updatedRecord.id);

    const { error } = await supabase.from('maintenance_records').update({
      status: updatedRecord.status,
      cost: updatedRecord.cost,
      description: updatedRecord.description,
      updated_by: userEmail,
    }).eq('id', updatedRecord.id);

    if (error) { console.error(error); return; }

    setMaintenanceRecords(prev => {
      const newRecords = prev.map(r => r.id === updatedRecord.id ? updatedRecord : r);

      if (oldRecord?.status !== 'in-progress' && updatedRecord.status === 'in-progress') {
        setVehicles(prevVeh => prevVeh.map(v =>
          v.id === updatedRecord.vehicleId ? { ...v, status: 'maintenance' } : v
        ));
      }

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
  }, [maintenanceRecords]);

  const handleDeleteMaintenance = useCallback(async (id: string) => {
    const { error } = await supabase.from('maintenance_records').delete().eq('id', id);
    if (error) { console.error(error); return; }
    setMaintenanceRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-elegant-bg flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-elegant-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  const renderView = () => {
    if (loading) {
      return (
        <div className="h-[calc(100vh-12rem)] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-elegant-accent border-t-transparent rounded-full" />
        </div>
      );
    }

    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            vehicles={vehicles}
            drivers={drivers}
            trips={trips}
            maintenance={maintenanceRecords}
            expenses={expenses}
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
        return <FuelView fillups={fuelFillups} onAddFillup={handleAddFuelFillup} onUpdateFillup={handleUpdateFuelFillup} onDeleteFillup={handleDeleteFuelFillup} vehicles={vehicles} />;
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
            expenses={expenses}
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
          <div className="flex items-center gap-4">
            <span className="text-elegant-dim">{session.user.email}</span>
            <button
              onClick={handleLogout}
              className="text-elegant-dim hover:text-elegant-danger transition-colors"
            >
              SAIR
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
