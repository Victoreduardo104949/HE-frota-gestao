import React, { useState } from 'react';
import { Card } from './UI';
import { Users, Award, AlertCircle, Calendar, MoreVertical, Search, Filter, Plus, X, Trash2, Edit2, History } from 'lucide-react';
import { cn } from '../lib/utils';
import { Driver, Trip, Vehicle } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { formatCurrency } from '../lib/utils';
import { generateAlerts } from '../lib/alerts';
import { UserBadge } from './UserAvatar';

interface DriversViewProps {
  drivers: Driver[];
  onAddDriver: (driver: Driver) => void;
  onUpdateDriver: (driver: Driver) => void;
  onDeleteDriver: (driverId: string) => void;
  trips: Trip[];
  vehicles: Vehicle[];
}

export const DriversView = ({ drivers, onAddDriver, onUpdateDriver, onDeleteDriver, trips, vehicles }: DriversViewProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         driver.cnh.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenEditModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDeleteModalOpen(true);
  };

  const handleOpenHistoryModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsHistoryModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const driverData: Driver = {
      id: selectedDriver?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      cnh: formData.get('cnh') as string,
      cnhExpiry: formData.get('cnhExpiry') as string,
      status: formData.get('status') as Driver['status'],
      productivity: Number(formData.get('productivity')) || (selectedDriver?.productivity || 0),
      occurrences: Number(formData.get('occurrences')) || (selectedDriver?.occurrences || 0),
    };

    if (selectedDriver) {
      onUpdateDriver(driverData);
    } else {
      onAddDriver(driverData);
    }
    
    setIsModalOpen(false);
    setSelectedDriver(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-elegant-text">Controle de Motoristas</h2>
          <p className="text-xs text-elegant-dim mt-1">Gestão de produtividade, CNH e folha salarial</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-elegant-dim" size={14} />
            <input 
              type="text" 
              placeholder="Buscar motorista ou CNH..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-elegant-card border border-elegant-border rounded py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-elegant-accent/50 w-full text-elegant-text"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-elegant-card border border-elegant-border rounded px-3 py-1.5 text-xs text-elegant-text focus:outline-none focus:border-elegant-accent/50"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Disponível</option>
            <option value="on-trip">Em Viagem</option>
            <option value="vacation">Férias</option>
            <option value="suspended">Suspenso</option>
          </select>
          <button 
            onClick={() => {
              setSelectedDriver(null);
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-elegant-accent text-white rounded text-xs font-bold hover:bg-elegant-accent/90 transition-colors shadow-lg shadow-elegant-accent/10"
          >
            <Plus size={14} /> Novo Motorista
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrivers.map((driver) => {
          const driverAlerts = generateAlerts([], [driver], []);
          const hasDanger = driverAlerts.some(a => a.severity === 'danger');
          const hasWarning = driverAlerts.some(a => a.severity === 'warning');

          return (
            <Card key={driver.id} className="relative group">
              {driverAlerts.length > 0 && (
                <div className={cn(
                  "absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-elegant-card z-10",
                  hasDanger ? "bg-elegant-danger" : "bg-elegant-warning"
                )}>
                  <AlertCircle size={10} className="text-white" />
                </div>
              )}
              <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-elegant-bg flex items-center justify-center text-sm font-bold border border-elegant-border text-elegant-text">
                  {driver.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-elegant-text">{driver.name}</h3>
                  <p className="text-[10px] font-mono text-elegant-dim uppercase tracking-wider">CNH: {driver.cnh}</p>
                </div>
              </div>
              <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenEditModal(driver)}
                  className="p-1.5 text-elegant-dim hover:text-elegant-accent transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleOpenDeleteModal(driver)}
                  className="p-1.5 text-elegant-dim hover:text-elegant-danger transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded bg-elegant-bg border border-elegant-border">
                <p className="data-label mb-1">Produtividade</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-elegant-text font-mono">{driver.productivity}%</span>
                  <Award size={12} className="text-elegant-success" />
                </div>
              </div>
              <div className="p-3 rounded bg-elegant-bg border border-elegant-border">
                <p className="data-label mb-1">Ocorrências</p>
                <div className="flex items-baseline gap-1">
                  <span className={cn(
                    "text-lg font-bold font-mono",
                    driver.occurrences > 0 ? "text-elegant-danger" : "text-elegant-text"
                  )}>{driver.occurrences}</span>
                  {driver.occurrences > 0 && <AlertCircle size={12} className="text-elegant-danger" />}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-elegant-dim">Status Atual</span>
                <span className={cn(
                  "font-bold uppercase text-[9px] px-2 py-0.5 rounded border",
                  driver.status === 'on-trip' ? "bg-elegant-accent/10 text-elegant-accent border-elegant-accent/20" :
                  driver.status === 'active' ? "bg-elegant-success/10 text-elegant-success border-elegant-success/20" :
                  driver.status === 'vacation' ? "bg-elegant-warning/10 text-elegant-warning border-elegant-warning/20" :
                  "bg-elegant-danger/10 text-elegant-danger border-elegant-danger/20"
                )}>
                  {driver.status === 'active' ? 'Disponível' : 
                   driver.status === 'on-trip' ? 'Em Viagem' : 
                   driver.status === 'vacation' ? 'Férias' : 'Suspenso'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-elegant-dim">Vencimento CNH</span>
                <span className={cn(
                  "font-mono text-[11px]",
                  new Date(driver.cnhExpiry) < new Date() ? "text-elegant-danger" : 
                  (new Date(driver.cnhExpiry).getTime() - new Date().getTime()) < (30 * 24 * 60 * 60 * 1000) ? "text-elegant-warning" : "text-elegant-text"
                )}>
                  {new Date(driver.cnhExpiry).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            <UserBadge user={driver.createdBy} label="Criado por" className="justify-end mt-3" />
            <div className="mt-3 pt-4 border-t border-elegant-border flex gap-2">
              <button 
                onClick={() => handleOpenHistoryModal(driver)}
                className="flex-1 py-1.5 text-[11px] font-bold bg-elegant-bg hover:bg-white/5 border border-elegant-border rounded transition-colors text-elegant-text"
              >
                Histórico
              </button>
              <button className="flex-1 py-1.5 text-[11px] font-bold bg-elegant-bg hover:bg-white/5 border border-elegant-border rounded transition-colors text-elegant-text">Folha Salarial</button>
            </div>
          </Card>
          );
        })}
        {filteredDrivers.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-elegant-border rounded-lg">
            <Users size={40} className="mx-auto text-elegant-dim mb-4 opacity-20" />
            <p className="text-elegant-dim text-sm">Nenhum motorista encontrado.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-elegant-card border border-elegant-border rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-elegant-border flex justify-between items-center bg-elegant-bg/50">
                <h3 className="text-lg font-bold text-elegant-text">
                  {selectedDriver ? 'Editar Motorista' : 'Novo Motorista'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-elegant-dim hover:text-elegant-text">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-elegant-dim uppercase">Nome Completo</label>
                  <input 
                    name="name" 
                    type="text" 
                    defaultValue={selectedDriver?.name}
                    className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" 
                    placeholder="Ex: João da Silva" 
                    required 
                  />
                </div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                     <label className="text-[11px] font-bold text-elegant-dim uppercase">CNH</label>
                    <input 
                      name="cnh" 
                      type="text" 
                      defaultValue={selectedDriver?.cnh}
                      className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" 
                      placeholder="00000000000" 
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Vencimento CNH</label>
                    <input 
                      name="cnhExpiry" 
                      type="date" 
                      defaultValue={selectedDriver?.cnhExpiry}
                      className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-elegant-dim uppercase">Status</label>
                  <select 
                    name="status" 
                    defaultValue={selectedDriver?.status || 'active'}
                    className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent"
                  >
                    <option value="active">Disponível</option>
                    <option value="on-trip">Em Viagem</option>
                    <option value="vacation">Férias</option>
                    <option value="suspended">Suspenso</option>
                  </select>
                </div>

                {selectedDriver && (
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                       <label className="text-[11px] font-bold text-elegant-dim uppercase">Produtividade (%)</label>
                      <input 
                        name="productivity" 
                        type="number" 
                        min="0" 
                        max="100"
                        defaultValue={selectedDriver.productivity}
                        className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-elegant-dim uppercase">Ocorrências</label>
                      <input 
                        name="occurrences" 
                        type="number" 
                        min="0"
                        defaultValue={selectedDriver.occurrences}
                        className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" 
                      />
                    </div>
                  </div>
                )}

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
                    {selectedDriver ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR MOTORISTA'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedDriver && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-elegant-card border border-elegant-border rounded-lg shadow-2xl p-6"
            >
              <div className="flex items-center gap-3 text-elegant-danger mb-4">
                <AlertCircle size={24} />
                <h3 className="text-lg font-bold text-elegant-text">Confirmar Exclusão</h3>
              </div>
              <p className="text-sm text-elegant-dim mb-6">
                Tem certeza que deseja remover o motorista <span className="text-elegant-text font-bold">{selectedDriver.name}</span>? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2 text-xs font-bold text-elegant-dim hover:text-elegant-text border border-elegant-border rounded transition-colors"
                >
                  CANCELAR
                </button>
                <button 
                  onClick={() => {
                    onDeleteDriver(selectedDriver.id);
                    setIsDeleteModalOpen(false);
                    setSelectedDriver(null);
                  }}
                  className="flex-1 py-2 text-xs font-bold bg-elegant-danger text-white rounded hover:bg-elegant-danger/90 transition-colors"
                >
                  EXCLUIR
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {isHistoryModalOpen && selectedDriver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-elegant-card border border-elegant-border rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-elegant-border flex justify-between items-center bg-elegant-bg/50">
                <div className="flex items-center gap-3">
                  <History className="text-elegant-accent" size={20} />
                  <div>
                    <h3 className="text-lg font-bold text-elegant-text">Histórico de Viagens</h3>
                    <p className="text-[10px] text-elegant-dim uppercase tracking-widest">{selectedDriver.name}</p>
                  </div>
                </div>
                <button onClick={() => setIsHistoryModalOpen(false)} className="text-elegant-dim hover:text-elegant-text">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  {trips.filter(t => t.driverId === selectedDriver.id).length > 0 ? (
                    trips
                      .filter(t => t.driverId === selectedDriver.id)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((trip) => {
                        const vehicle = vehicles.find(v => v.id === trip.vehicleId);
                        return (
                          <div key={trip.id} className="p-4 rounded bg-elegant-bg border border-elegant-border hover:border-elegant-accent/30 transition-colors group">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <Calendar size={12} className="text-elegant-dim" />
                                <span className="text-[11px] font-mono text-elegant-dim">{new Date(trip.date).toLocaleDateString('pt-BR')}</span>
                                <span className={cn(
                                  "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border",
                                  trip.status === 'completed' ? "bg-elegant-success/10 text-elegant-success border-elegant-success/20" :
                                  trip.status === 'in-progress' ? "bg-elegant-accent/10 text-elegant-accent border-elegant-accent/20" :
                                  "bg-elegant-warning/10 text-elegant-warning border-elegant-warning/20"
                                )}>
                                  {trip.status === 'completed' ? 'Finalizada' : 
                                   trip.status === 'in-progress' ? 'Em Rota' : 'Agendada'}
                                </span>
                              </div>
                              <span className="text-xs font-bold text-elegant-text">{formatCurrency(trip.revenue)}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[9px] text-elegant-dim uppercase mb-1">Rota</p>
                                <p className="text-xs text-elegant-text font-medium">{trip.origin} → {trip.destination}</p>
                              </div>
                              <div>
                                <p className="text-[9px] text-elegant-dim uppercase mb-1">Veículo</p>
                                <p className="text-xs text-elegant-text font-medium">{vehicle ? `${vehicle.model} (${vehicle.plate})` : 'N/A'}</p>
                              </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-elegant-border/50 flex justify-between items-center">
                              <div className="flex gap-4">
                                <div>
                                  <span className="text-[9px] text-elegant-dim uppercase mr-1">KM:</span>
                                  <span className="text-[10px] font-mono text-elegant-text">{trip.distance} km</span>
                                </div>
                                <div>
                                  <span className="text-[9px] text-elegant-dim uppercase mr-1">Margem:</span>
                                  <span className={cn(
                                    "text-[10px] font-mono",
                                    trip.margin > 20 ? "text-elegant-success" : "text-elegant-text"
                                  )}>{trip.margin}%</span>
                                </div>
                              </div>
                              <p className="text-[10px] text-elegant-dim italic">{trip.cargo}</p>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="py-12 text-center border border-dashed border-elegant-border rounded">
                      <Calendar size={32} className="mx-auto text-elegant-dim mb-3 opacity-20" />
                      <p className="text-elegant-dim text-xs">Nenhuma viagem registrada para este motorista.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 bg-elegant-bg/50 border-t border-elegant-border flex justify-end">
                <button 
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="px-6 py-2 text-xs font-bold bg-elegant-bg hover:bg-white/5 border border-elegant-border rounded transition-colors text-elegant-text"
                >
                  FECHAR
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
