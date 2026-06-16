import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { StatCard, Card } from './UI';
import { motion } from 'motion/react';
import { AlertTriangle, ArrowRight, Truck, MapPin, Calendar, AlertCircle, Info } from 'lucide-react';
import { formatCurrency, formatNumber, cn } from '../lib/utils';
import { Vehicle, Driver, Trip, KPI, MaintenanceRecord, Expense } from '../types';
import { generateAlerts, AppAlert } from '../lib/alerts';

const COLORS = ['#D4AF37', '#C5A028', '#E5C158', '#B38F1D', '#8C6F15'];

interface DashboardViewProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  trips: Trip[];
  maintenance: MaintenanceRecord[];
  expenses: Expense[];
  onNavigate: (view: any) => void;
}

export const DashboardView = ({ vehicles, drivers, trips, maintenance, expenses, onNavigate }: DashboardViewProps) => {
  const alerts = generateAlerts(vehicles, drivers, maintenance);
  
  // Calculate dynamic KPIs
  const totalRevenue = trips.reduce((acc, t) => acc + t.revenue, 0);
  const tripCosts = trips.reduce((acc, t) => acc + t.cost, 0);
  const expenseCosts = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalCost = tripCosts + expenseCosts;
  const avgMargin = trips.length > 0 ? (trips.reduce((acc, t) => acc + (t.margin / t.revenue), 0) / trips.length) * 100 : 0;
  const activeTrips = trips.filter(t => t.status === 'in-progress').length;

  const dynamicKPIs: KPI[] = [
    { label: 'Receita Total', value: formatCurrency(totalRevenue), change: 12.5, trend: 'up' },
    { label: 'Custo Operacional', value: formatCurrency(totalCost), change: -2.4, trend: 'down' },
    { label: 'Margem Média', value: `${avgMargin.toFixed(1)}%`, change: 5.2, trend: 'up' },
    { label: 'Viagens em Curso', value: activeTrips, change: 0, trend: 'neutral' },
  ];

  // Dynamic cost distribution chart data from expenses
  const expenseCategories: Record<string, { name: string; value: number; color: string }> = {
    fuel: { name: 'Combustível', value: 0, color: '#3B82F6' },
    maintenance: { name: 'Manutenção', value: 0, color: '#6366F1' },
    toll: { name: 'Pedágios', value: 0, color: '#A855F7' },
    tax: { name: 'Taxas/Impostos', value: 0, color: '#EC4899' },
    other: { name: 'Outros', value: 0, color: '#F59E0B' },
  };
  expenses.forEach(e => {
    if (expenseCategories[e.category]) {
      expenseCategories[e.category].value += e.amount;
    }
  });
  const dynamicCostByCategory = Object.values(expenseCategories);

  const latestTrips = [...trips].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicKPIs.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <StatCard 
              label={kpi.label}
              value={kpi.value}
              change={kpi.change}
              trend={kpi.trend}
              unit={kpi.unit}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Chart */}
        <Card title="Distribuição de Custos por Categoria" subtitle="R$/km" className="lg:col-span-2">
          <div className="h-[280px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dynamicCostByCategory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#A1A1A1" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    fontFamily="Inter"
                  />
                  <YAxis 
                    stroke="#A1A1A1" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    fontFamily="JetBrains Mono"
                    tickFormatter={(value) => `R$ ${value / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '6px' }}
                    itemStyle={{ color: '#FFFFFF', fontFamily: 'Inter', fontSize: '12px' }}
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                    {dynamicCostByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                    ))}
                  </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Critical Alerts */}
        <Card 
          title={`Alertas do Sistema (${alerts.length})`} 
          subtitle="Ações preventivas e corretivas"
          className="flex flex-col"
        >
          <div className="space-y-3 mt-4 flex-1 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div 
                  key={alert.id}
                  onClick={() => onNavigate(alert.targetType === 'vehicle' ? 'fleet' : 'drivers')}
                  className={cn(
                    "p-3 rounded-md border-l-4 transition-all cursor-pointer hover:translate-x-1",
                    alert.severity === 'danger' ? "bg-elegant-danger/5 border-elegant-danger hover:bg-elegant-danger/10" :
                    alert.severity === 'warning' ? "bg-elegant-warning/5 border-elegant-warning hover:bg-elegant-warning/10" :
                    "bg-elegant-accent/5 border-elegant-accent hover:bg-elegant-accent/10"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      alert.severity === 'danger' ? "text-elegant-danger" :
                      alert.severity === 'warning' ? "text-elegant-warning" :
                      "text-elegant-accent"
                    )}>
                      {alert.title}
                    </p>
                    {alert.severity === 'danger' ? <AlertCircle size={12} className="text-elegant-danger" /> :
                     alert.severity === 'warning' ? <AlertTriangle size={12} className="text-elegant-warning" /> :
                     <Info size={12} className="text-elegant-accent" />}
                  </div>
                  <p className="text-xs font-medium text-elegant-text leading-relaxed">{alert.message}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center opacity-30">
                <AlertCircle size={32} className="mb-2" />
                <p className="text-xs">Nenhum alerta pendente</p>
              </div>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-elegant-border text-center">
            <button 
              onClick={() => onNavigate('fleet')}
              className="text-[11px] font-bold text-elegant-dim hover:text-elegant-text transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              GERENCIAR FROTA <ArrowRight size={12} />
            </button>
          </div>
        </Card>
      </div>

      {/* Latest Trips */}
      <Card title="Últimas Viagens Registradas">
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-elegant-border">
                <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">ID/Rota</th>
                <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Veículo</th>
                <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Custo</th>
                <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Receita</th>
                <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Margem</th>
                <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {latestTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-2">
                    <p className="text-xs font-medium text-elegant-text">#{trip.id} - {trip.origin.split(',')[0]} &gt; {trip.destination.split(',')[0]}</p>
                  </td>
                  <td className="py-3 px-2">
                    <span className="font-mono text-[11px] bg-elegant-bg border border-elegant-border px-1.5 py-0.5 rounded text-elegant-dim">
                      {vehicles.find(v => v.id === trip.vehicleId)?.name}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-xs text-elegant-dim">{formatCurrency(trip.cost)}</td>
                  <td className="py-3 px-2 text-xs text-elegant-dim">{formatCurrency(trip.revenue)}</td>
                  <td className="py-3 px-2 text-xs font-bold text-elegant-success">{((trip.margin / trip.revenue) * 100).toFixed(0)}%</td>
                  <td className="py-3 px-2">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded border",
                      trip.status === 'completed' 
                        ? "bg-elegant-success/10 text-elegant-success border-elegant-success/20" 
                        : trip.status === 'in-progress'
                        ? "bg-elegant-accent/10 text-elegant-accent border-elegant-accent/20"
                        : "bg-elegant-warning/10 text-elegant-warning border-elegant-warning/20"
                    )}>
                      {trip.status === 'completed' ? 'Finalizada' : trip.status === 'in-progress' ? 'Em Rota' : 'Agendada'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
