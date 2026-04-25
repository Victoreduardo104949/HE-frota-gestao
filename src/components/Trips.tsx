import React from 'react';
import { Card } from './UI';
import { MapPin, ArrowRight, Package, DollarSign, TrendingUp, Filter, Plus, Search, Truck, X, Calendar, Edit2 } from 'lucide-react';
import { cn, formatCurrency, formatNumber } from '../lib/utils';
import { Trip, Vehicle, Driver } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface TripsViewProps {
  trips: Trip[];
  onAddTrip: (trip: Trip) => void;
  onUpdateTrip: (trip: Trip) => void;
  vehicles: Vehicle[];
  drivers: Driver[];
}

export const TripsView = ({ trips, onAddTrip, onUpdateTrip, vehicles, drivers }: TripsViewProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedTrip, setSelectedTrip] = React.useState<Trip | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTrips = trips.filter(trip => 
    trip.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-elegant-text">Registro de Viagens</h2>
          <p className="text-xs text-elegant-dim mt-1">Acompanhamento de rotas, cargas e rentabilidade</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-elegant-dim" size={14} />
            <input 
              type="text" 
              placeholder="Buscar viagem..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-elegant-card border border-elegant-border rounded py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-elegant-accent/50 w-full text-elegant-text"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3 py-1.5 bg-elegant-accent text-white rounded text-xs font-bold hover:bg-elegant-accent/90 transition-colors shadow-lg shadow-elegant-accent/10 w-full sm:w-auto"
          >
            <Plus size={14} /> Nova Viagem
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTrips.map((trip) => {
          const vehicle = vehicles.find(v => v.id === trip.vehicleId);
          const driver = drivers.find(d => d.id === trip.driverId);
          const marginPercent = (trip.margin / trip.revenue) * 100;

          return (
            <Card key={trip.id} className="p-0 overflow-hidden group hover:border-elegant-accent/30 transition-colors">
              <div className="flex flex-col lg:flex-row">
                {/* Route Info */}
                <div className="p-5 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-elegant-border">
                  <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-elegant-dim uppercase tracking-wider">ID: #{trip.id}</span>
                        <button 
                          onClick={() => {
                            setSelectedTrip(trip);
                            setIsEditModalOpen(true);
                          }}
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-elegant-accent/10 border border-elegant-accent/20 text-elegant-accent hover:bg-elegant-accent hover:text-white transition-all shadow-sm"
                          title="Mudar Status / Editar"
                        >
                          <Edit2 size={12} />
                        </button>
                      </div>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded border",
                      trip.status === 'completed' ? "bg-elegant-success/10 text-elegant-success border-elegant-success/20" : 
                      trip.status === 'in-progress' ? "bg-elegant-accent/10 text-elegant-accent border-elegant-accent/20" :
                      "bg-elegant-warning/10 text-elegant-warning border-elegant-warning/20"
                    )}>
                      {trip.status === 'completed' ? 'CONCLUÍDA' : trip.status === 'in-progress' ? 'EM CURSO' : 'AGENDADA'}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-elegant-border" />
                        <div className="w-[1px] h-6 bg-elegant-border" />
                        <MapPin size={12} className="text-elegant-accent" />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[9px] data-label">Origem</p>
                          <p className="text-xs font-bold text-elegant-text">{trip.origin}</p>
                        </div>
                        <div>
                          <p className="text-[9px] data-label">Destino</p>
                          <p className="text-xs font-bold text-elegant-text">{trip.destination}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logistics Info */}
                <div className="p-5 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-elegant-border bg-white/[0.01]">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="data-label mb-1.5">Veículo</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono bg-elegant-bg border border-elegant-border px-1.5 py-0.5 rounded text-elegant-dim">{vehicle?.plate || 'N/A'}</span>
                      </div>
                    </div>
                    <div>
                      <p className="data-label mb-1.5">Motorista</p>
                      <span className="text-xs font-medium text-elegant-text">{driver?.name || 'Não atribuído'}</span>
                    </div>
                    <div>
                      <p className="data-label mb-1.5">Carga</p>
                      <div className="flex items-center gap-2">
                        <Package size={12} className="text-elegant-dim" />
                        <span className="text-xs text-elegant-dim">{trip.cargo}</span>
                      </div>
                    </div>
                    <div>
                      <p className="data-label mb-1.5">Distância</p>
                      <span className="text-xs font-mono text-elegant-dim">{formatNumber(trip.distance)} km</span>
                    </div>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="p-5 lg:w-1/3 flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="data-label mb-1">Receita</p>
                      <p className="text-xs font-mono text-elegant-text">{formatCurrency(trip.revenue)}</p>
                    </div>
                    <div>
                      <p className="data-label mb-1">Custo</p>
                      <p className="text-xs font-mono text-elegant-text">{formatCurrency(trip.cost)}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded bg-elegant-bg border border-elegant-border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-bold text-elegant-dim uppercase tracking-wider">Margem Líquida</span>
                      <span className={cn(
                        "text-[10px] font-mono",
                        marginPercent > 0 ? "text-elegant-success" : "text-elegant-danger"
                      )}>
                        {marginPercent > 0 ? '+' : ''}{marginPercent.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-lg font-bold text-elegant-text font-mono">{formatCurrency(trip.margin)}</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredTrips.length === 0 && (
          <div className="py-20 text-center border border-dashed border-elegant-border rounded-lg">
            <ArrowRight size={40} className="mx-auto text-elegant-dim mb-4 opacity-20" />
            <p className="text-elegant-dim text-sm">Nenhuma viagem encontrada.</p>
          </div>
        )}
      </div>

      {/* Edit Trip Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedTrip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-elegant-card border border-elegant-border rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-elegant-border flex justify-between items-center">
                <h3 className="text-lg font-bold text-elegant-text">Editar Viagem #{selectedTrip.id}</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-elegant-dim hover:text-elegant-text">
                  <X size={20} />
                </button>
              </div>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const updatedTrip: Trip = {
                    ...selectedTrip,
                    status: formData.get('status') as any,
                  };
                  onUpdateTrip(updatedTrip);
                  setIsEditModalOpen(false);
                }}
                className="p-6 space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-elegant-dim uppercase">Status da Viagem</label>
                  <select 
                    name="status" 
                    defaultValue={selectedTrip.status}
                    className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent"
                  >
                    <option value="scheduled">Agendada</option>
                    <option value="in-progress">Em Curso</option>
                    <option value="completed">Concluída</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-2 text-xs font-bold text-elegant-dim hover:text-elegant-text border border-elegant-border rounded transition-colors"
                  >
                    CANCELAR
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold bg-elegant-accent text-white rounded hover:bg-elegant-accent/90 transition-colors shadow-lg shadow-elegant-accent/20"
                  >
                    SALVAR ALTERAÇÕES
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Trip Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-elegant-card border border-elegant-border rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-elegant-border flex justify-between items-center">
                <h3 className="text-lg font-bold text-elegant-text">Nova Viagem</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-elegant-dim hover:text-elegant-text">
                  <X size={20} />
                </button>
              </div>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const revenue = Number(formData.get('revenue'));
                  const cost = Number(formData.get('cost'));
                  
                  const newTrip: Trip = {
                    id: Math.random().toString(36).substr(2, 6).toUpperCase(),
                    vehicleId: formData.get('vehicleId') as string,
                    driverId: formData.get('driverId') as string,
                    origin: formData.get('origin') as string,
                    destination: formData.get('destination') as string,
                    distance: Number(formData.get('distance')),
                    cargo: formData.get('cargo') as string,
                    revenue: revenue,
                    cost: cost,
                    margin: revenue - cost,
                    date: formData.get('date') as string,
                    status: 'scheduled',
                  };
                  onAddTrip(newTrip);
                  setIsModalOpen(false);
                }}
                className="p-6 space-y-6"
              >
                <div className="grid grid-cols-2 gap-6">
                  {/* Route Section */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-elegant-accent uppercase tracking-wider">Rota e Carga</h4>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-elegant-dim uppercase">Origem</label>
                      <input name="origin" type="text" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="Cidade, UF" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-elegant-dim uppercase">Destino</label>
                      <input name="destination" type="text" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="Cidade, UF" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-elegant-dim uppercase">Distância (KM)</label>
                        <input name="distance" type="number" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="0" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-elegant-dim uppercase">Data</label>
                        <input name="date" type="date" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-elegant-dim uppercase">Tipo de Carga</label>
                      <input name="cargo" type="text" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="Ex: Grãos, Eletrônicos..." required />
                    </div>
                  </div>

                  {/* Assignment & Finance Section */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-elegant-accent uppercase tracking-wider">Atribuição e Financeiro</h4>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-elegant-dim uppercase">Veículo</label>
                      <select name="vehicleId" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" required>
                        <option value="">Selecione um veículo</option>
                        {vehicles.map(v => {
                          const isMaintenance = v.status === 'maintenance';
                          const isOnTrip = trips.some(t => t.vehicleId === v.id && t.status === 'in-progress');
                          const isScheduled = trips.some(t => t.vehicleId === v.id && t.status === 'scheduled');
                          const isUnavailable = isMaintenance || isOnTrip;
                          
                          const statusLabel = 
                            isMaintenance ? '(EM MANUTENÇÃO)' : 
                            isOnTrip ? '(EM VIAGEM)' : 
                            isScheduled ? '(AGENDADO)' : '';
                          
                          return (
                            <option 
                              key={v.id} 
                              value={v.id} 
                              disabled={isUnavailable}
                              className={isUnavailable ? "text-elegant-dim" : ""}
                            >
                              {v.plate} - {v.model} {statusLabel}
                            </option>
                          );
                        })}
                      </select>
                      {(vehicles.some(v => v.status === 'maintenance') || vehicles.some(v => trips.some(t => t.vehicleId === v.id && t.status === 'in-progress'))) && (
                        <p className="text-[9px] text-elegant-danger/60 italic mt-1">
                          * Veículos em manutenção ou em viagem estão indisponíveis para seleção.
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-elegant-dim uppercase">Motorista</label>
                      <select name="driverId" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" required>
                        <option value="">Selecione um motorista</option>
                        {drivers.map(d => {
                          const isOnTrip = trips.some(t => t.driverId === d.id && t.status === 'in-progress');
                          const isScheduled = trips.some(t => t.driverId === d.id && t.status === 'scheduled');
                          const isUnavailable = d.status !== 'active' || isOnTrip;
                          
                          const statusLabel = 
                            d.status === 'vacation' ? '(EM FÉRIAS)' :
                            d.status === 'suspended' ? '(SUSPENSO)' :
                            (d.status === 'on-trip' || isOnTrip) ? '(EM VIAGEM)' : 
                            isScheduled ? '(AGENDADO)' : '';
                          
                          return (
                            <option 
                              key={d.id} 
                              value={d.id} 
                              disabled={isUnavailable}
                              className={isUnavailable ? "text-elegant-dim" : ""}
                            >
                              {d.name} {statusLabel}
                            </option>
                          );
                        })}
                      </select>
                      {(drivers.some(d => d.status !== 'active') || drivers.some(d => trips.some(t => t.driverId === d.id && t.status === 'in-progress'))) && (
                        <p className="text-[9px] text-elegant-danger/60 italic mt-1">
                          * Motoristas ausentes ou em viagem estão indisponíveis para seleção.
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-elegant-dim uppercase">Receita (R$)</label>
                        <input name="revenue" type="number" step="0.01" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="0,00" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-elegant-dim uppercase">Custo Est. (R$)</label>
                        <input name="cost" type="number" step="0.01" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="0,00" required />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-elegant-border flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 text-xs font-bold text-elegant-dim hover:text-elegant-text border border-elegant-border rounded transition-colors"
                  >
                    CANCELAR
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-bold bg-elegant-accent text-white rounded hover:bg-elegant-accent/90 transition-colors shadow-lg shadow-elegant-accent/20"
                  >
                    CADASTRAR VIAGEM
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
