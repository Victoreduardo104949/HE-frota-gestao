import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  Fuel, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Download, 
  Droplets,
  Zap,
  Gauge,
  X,
  Calendar,
  MapPin
} from 'lucide-react';
import { formatCurrency, formatNumber, cn } from '../lib/utils';
import { Card, StatCard } from './UI';
import { FuelFillup, Vehicle } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { UserBadge } from './UserAvatar';

const FUEL_PRICE_HISTORY = [
  { date: '01/04', price: 5.75 },
  { date: '04/04', price: 5.82 },
  { date: '07/04', price: 5.80 },
  { date: '10/04', price: 5.88 },
  { date: '13/04', price: 5.92 },
  { date: '14/04', price: 5.85 },
];

interface FuelViewProps {
  fillups: FuelFillup[];
  onAddFillup: (fillup: FuelFillup) => void;
  vehicles: Vehicle[];
}

export const FuelView = ({ fillups, onAddFillup, vehicles }: FuelViewProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalLiters = fillups.reduce((acc, curr) => acc + curr.liters, 0);
  const totalCost = fillups.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const avgPrice = fillups.length > 0 ? totalCost / totalLiters : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-elegant-text">Controle de Combustível</h2>
          <p className="text-xs text-elegant-dim mt-1">Monitoramento de consumo, preços e eficiência da frota</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-elegant-card border border-elegant-border rounded text-xs font-medium hover:bg-white/5 transition-colors text-elegant-text">
            <Download size={14} /> Relatório
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-elegant-accent text-white rounded text-xs font-bold hover:bg-elegant-accent/90 transition-colors shadow-lg shadow-elegant-accent/10"
          >
            <Plus size={14} /> Novo Abastecimento
          </button>
        </div>
      </div>

      {/* Fuel KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Consumo Total (Mês)"
          value={`${formatNumber(totalLiters)} L`}
          change={3.2}
          trend="up"
        />
        <StatCard 
          label="Preço Médio / Litro"
          value={`R$ ${avgPrice.toFixed(2)}`}
          change={-1.5}
          trend="down"
        />
        <StatCard 
          label="Média Frota (km/L)"
          value="2,45"
          change={0.8}
          trend="up"
        />
        <StatCard 
          label="Custo Total (Mês)"
          value={formatCurrency(totalCost)}
          change={2.1}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Fuel Price Trend Chart */}
        <Card title="Tendência de Preço" subtitle="Preço médio do Diesel S10 (R$/L)" className="lg:col-span-2">
          <div className="h-[280px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FUEL_PRICE_HISTORY} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#A1A1A1" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#A1A1A1" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  domain={['dataMin - 0.1', 'dataMax + 0.1']}
                  tickFormatter={(value) => `R$ ${value.toFixed(2)}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '6px' }}
                  itemStyle={{ fontSize: '12px', color: '#FFFFFF' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#D4AF37" 
                  strokeWidth={3} 
                  dot={{ fill: '#D4AF37', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Efficiency by Vehicle */}
        <Card title="Eficiência por Veículo" subtitle="km/L por placa">
          <div className="space-y-4 mt-4">
            {vehicles.map((vehicle, index) => {
              const efficiency = 2.2 + (index * 0.15); // Mock efficiency
              return (
                <div key={vehicle.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-mono text-elegant-text">{vehicle.plate}</span>
                    <span className="font-bold text-elegant-accent">{efficiency.toFixed(2)} km/L</span>
                  </div>
                  <div className="w-full h-1.5 bg-elegant-bg rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-elegant-accent transition-all duration-1000"
                      style={{ width: `${(efficiency / 3) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Fillups Table */}
      <Card title="Histórico de Abastecimentos">
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-elegant-border">
                <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Data</th>
                <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Veículo</th>
                <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Posto</th>
                <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Litros</th>
                <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">R$/L</th>
                <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Criado por</th>
                <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {fillups.map((fillup) => {
                const vehicle = vehicles.find(v => v.id === fillup.vehicleId);
                return (
                  <tr key={fillup.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-2 text-xs text-elegant-dim font-mono">
                      {new Date(fillup.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-mono text-[11px] bg-elegant-bg border border-elegant-border px-1.5 py-0.5 rounded text-elegant-dim">
                        {vehicle?.plate}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-xs text-elegant-text">{fillup.stationName}</td>
                    <td className="py-3 px-2 text-xs text-elegant-dim font-mono">{fillup.liters} L</td>
                    <td className="py-3 px-2 text-xs text-elegant-dim font-mono">R$ {fillup.pricePerLiter.toFixed(2)}</td>
                    <td className="py-3 px-2">
                      <UserBadge user={fillup.createdBy} />
                    </td>
                    <td className="py-3 px-2 text-right text-xs font-bold text-elegant-text font-mono">
                      {formatCurrency(fillup.totalAmount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Fillup Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-elegant-card border border-elegant-border rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-elegant-border flex justify-between items-center">
                <h3 className="text-lg font-bold text-elegant-text">Novo Abastecimento</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-elegant-dim hover:text-elegant-text">
                  <X size={20} />
                </button>
              </div>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const liters = Number(formData.get('liters'));
                  const pricePerLiter = Number(formData.get('pricePerLiter'));
                  
                  const newFillup: FuelFillup = {
                    id: Math.random().toString(36).substr(2, 9),
                    vehicleId: formData.get('vehicleId') as string,
                    date: formData.get('date') as string,
                    liters: liters,
                    pricePerLiter: pricePerLiter,
                    totalAmount: liters * pricePerLiter,
                    currentKm: Number(formData.get('currentKm')),
                    stationName: formData.get('stationName') as string,
                  };
                  onAddFillup(newFillup);
                  setIsModalOpen(false);
                }}
                className="p-6 space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-elegant-dim uppercase">Veículo</label>
                  <select name="vehicleId" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" required>
                    <option value="">Selecione um veículo</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.plate} - {v.model}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Data</label>
                    <input name="date" type="date" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">KM Atual</label>
                    <input name="currentKm" type="number" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="0" required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-elegant-dim uppercase">Posto de Combustível</label>
                  <input name="stationName" type="text" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="Ex: Posto Graal" required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Litros</label>
                    <input name="liters" type="number" step="0.01" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="0.00" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Preço por Litro (R$)</label>
                    <input name="pricePerLiter" type="number" step="0.01" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="0.00" required />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 text-xs font-bold text-elegant-dim hover:text-elegant-text border border-elegant-border rounded transition-colors"
                  >
                    CANCELAR
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold bg-elegant-accent text-white rounded hover:bg-elegant-accent/90 transition-colors shadow-lg shadow-elegant-accent/20"
                  >
                    REGISTRAR
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
