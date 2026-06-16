import React from 'react';
import { Card } from './UI';
import { Truck, AlertCircle, CheckCircle2, Clock, Plus, Filter, Download, X, AlertTriangle, Wrench, MapPin, ArrowRight, Info } from 'lucide-react';
import { cn, formatNumber } from '../lib/utils';
import { Vehicle, Trip, MaintenanceRecord } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType } from './Navigation';
import { generateAlerts } from '../lib/alerts';
import { UserBadge } from './UserAvatar';

interface FleetViewProps {
  vehicles: Vehicle[];
  onAddVehicle: (vehicle: Vehicle) => void;
  onUpdateVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicleId: string) => void;
  trips: Trip[];
  maintenance?: MaintenanceRecord[];
  onNavigate: (view: ViewType) => void;
}

export const FleetView = ({ vehicles, onAddVehicle, onUpdateVehicle, onDeleteVehicle, trips, maintenance = [], onNavigate }: FleetViewProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | null>(null);
  const [detailsModalType, setDetailsModalType] = React.useState<'details' | 'alerts'>('details');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-elegant-text">Gestão de Frota</h2>
          <p className="text-xs text-elegant-dim mt-1">Controle de veículos, manutenção e custos operacionais</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-elegant-card border border-elegant-border rounded text-xs font-medium hover:bg-white/5 transition-colors text-elegant-text">
            <Filter size={14} /> Filtrar
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-elegant-accent text-white rounded text-xs font-bold hover:bg-elegant-accent/90 transition-colors shadow-lg shadow-elegant-accent/10"
          >
            <Plus size={14} /> Novo Veículo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {vehicles.map((vehicle) => {
          const activeTrip = trips.find(t => t.vehicleId === vehicle.id && t.status === 'in-progress');
          const isOnTrip = !!activeTrip;
          const displayStatus = isOnTrip ? 'in-trip' : vehicle.status;

          return (
            <Card key={vehicle.id} className="group">
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "p-2 rounded bg-elegant-bg border border-elegant-border",
                  displayStatus === 'active' ? "text-elegant-success" :
                  displayStatus === 'in-trip' ? "text-elegant-accent" :
                  displayStatus === 'maintenance' ? "text-elegant-danger" :
                  "text-elegant-warning"
                )}>
                  {isOnTrip ? <MapPin size={20} /> : <Truck size={20} />}
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded border",
                  displayStatus === 'active' ? "bg-elegant-success/10 text-elegant-success border-elegant-success/20" :
                  displayStatus === 'in-trip' ? "bg-elegant-accent/10 text-elegant-accent border-elegant-accent/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]" :
                  displayStatus === 'maintenance' ? "bg-elegant-danger/10 text-elegant-danger border-elegant-danger/20" :
                  "bg-elegant-warning/10 text-elegant-warning border-elegant-warning/20"
                )}>
                  {displayStatus === 'active' ? 'ATIVO' : 
                   displayStatus === 'in-trip' ? 'EM ROTA' :
                   displayStatus === 'maintenance' ? 'MANUTENÇÃO' : 'ALERTA'}
                </span>
              </div>

              <h3 className="text-base font-bold text-elegant-text">{vehicle.name}</h3>
              <p className="text-[11px] text-elegant-dim mb-6">{vehicle.model} • {vehicle.year}</p>

              <div className="space-y-3">
                {isOnTrip && (
                  <div className="p-2 rounded bg-elegant-accent/5 border border-elegant-accent/10 mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-bold text-elegant-accent uppercase tracking-wider">Viagem Atual</span>
                      <button 
                        onClick={() => onNavigate('trips')}
                        className="text-[9px] font-bold text-elegant-accent hover:underline flex items-center gap-1"
                      >
                        DETALHES <ArrowRight size={10} />
                      </button>
                    </div>
                    <p className="text-[10px] text-elegant-text truncate">{activeTrip.origin} → {activeTrip.destination}</p>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="data-label">KM Atual</span>
                  <span className="text-xs font-mono text-elegant-text">{formatNumber(vehicle.currentKm)} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="data-label">Custo/KM</span>
                  <span className="text-xs font-mono text-elegant-text">R$ {vehicle.costPerKm.toFixed(2)}</span>
                </div>
                
                <div className="pt-3 border-t border-elegant-border">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold text-elegant-dim uppercase">Próxima Revisão</span>
                    <span className="text-[10px] font-mono text-elegant-dim">{formatNumber(vehicle.nextMaintenanceKm)} km</span>
                  </div>
                  <div className="w-full h-1 bg-elegant-bg rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-1000",
                        (vehicle.currentKm / vehicle.nextMaintenanceKm) > 0.9 ? "bg-elegant-danger" : "bg-elegant-accent"
                      )}
                      style={{ width: `${Math.min((vehicle.currentKm / vehicle.nextMaintenanceKm) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <UserBadge user={vehicle.createdBy} label="Criado por" className="justify-end mt-3" />
              <div className="mt-3 pt-4 border-t border-elegant-border flex gap-2">
                <button 
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setDetailsModalType('details');
                  }}
                  className="flex-1 py-2 text-[11px] font-bold bg-elegant-bg hover:bg-white/5 border border-elegant-border rounded transition-colors text-elegant-text"
                >
                  Detalhes
                </button>
                <button 
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setDetailsModalType('alerts');
                  }}
                  className="px-3 py-2 text-[11px] font-bold bg-elegant-bg hover:bg-white/5 border border-elegant-border rounded transition-colors text-elegant-text"
                >
                  <AlertCircle size={14} />
                </button>
              </div>
            </Card>
          );
        })}
        {vehicles.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-elegant-border rounded-lg">
            <Truck size={40} className="mx-auto text-elegant-dim mb-4 opacity-20" />
            <p className="text-elegant-dim text-sm">Nenhum veículo cadastrado na frota.</p>
          </div>
        )}
      </div>

      {/* Vehicle Details/Alerts Modal */}
      <AnimatePresence>
        {selectedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-elegant-card border border-elegant-border rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-elegant-border flex justify-between items-center bg-elegant-bg/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-elegant-accent/10 text-elegant-accent rounded">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-elegant-text">{selectedVehicle.name}</h3>
                    <p className="text-[10px] text-elegant-dim uppercase font-bold tracking-wider">{selectedVehicle.model}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedVehicle(null)} className="text-elegant-dim hover:text-elegant-text">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {detailsModalType === 'details' ? (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-elegant-dim uppercase block mb-1">Ano de Fabricação</label>
                        <p className="text-sm text-elegant-text font-medium">{selectedVehicle.year}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-elegant-dim uppercase block mb-1">Quilometragem Atual</label>
                        <p className="text-sm text-elegant-text font-mono">{formatNumber(selectedVehicle.currentKm)} km</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-elegant-dim uppercase block mb-1">Custo por KM</label>
                        <p className="text-sm text-elegant-text font-mono">R$ {selectedVehicle.costPerKm.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-elegant-dim uppercase block mb-1">Vencimento do Seguro</label>
                        <p className="text-sm text-elegant-text font-medium">
                          {new Date(selectedVehicle.insuranceExpiry).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-elegant-dim uppercase block mb-1">Status Operacional</label>
                        {trips.some(t => t.vehicleId === selectedVehicle.id && t.status === 'in-progress') ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border inline-block bg-elegant-accent/10 text-elegant-accent border-elegant-accent/20">
                            EM ROTA
                          </span>
                        ) : (
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded border inline-block",
                            selectedVehicle.status === 'active' ? "bg-elegant-success/10 text-elegant-success border-elegant-success/20" :
                            selectedVehicle.status === 'maintenance' ? "bg-elegant-danger/10 text-elegant-danger border-elegant-danger/20" :
                            "bg-elegant-warning/10 text-elegant-warning border-elegant-warning/20"
                          )}>
                            {selectedVehicle.status === 'active' ? 'ATIVO' : selectedVehicle.status === 'maintenance' ? 'MANUTENÇÃO' : 'ALERTA'}
                          </span>
                        )}
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-elegant-dim uppercase block mb-1">Próxima Manutenção</label>
                        <p className="text-sm text-elegant-text font-mono">{formatNumber(selectedVehicle.nextMaintenanceKm)} km</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-elegant-text uppercase tracking-wider mb-2">Alertas e Notificações</h4>
                    
                    {generateAlerts([selectedVehicle], [], maintenance).map((alert) => (
                      <div 
                        key={alert.id}
                        className={cn(
                          "flex gap-3 p-3 rounded border",
                          alert.severity === 'danger' ? "bg-elegant-danger/5 border-elegant-danger/20" :
                          alert.severity === 'warning' ? "bg-elegant-warning/5 border-elegant-warning/20" :
                          "bg-elegant-accent/5 border-elegant-accent/20"
                        )}
                      >
                        {alert.severity === 'danger' ? <AlertCircle className="text-elegant-danger shrink-0" size={18} /> :
                         alert.severity === 'warning' ? <AlertTriangle className="text-elegant-warning shrink-0" size={18} /> :
                         <Info className="text-elegant-accent shrink-0" size={18} />}
                        <div>
                          <p className={cn(
                            "text-xs font-bold",
                            alert.severity === 'danger' ? "text-elegant-danger" :
                            alert.severity === 'warning' ? "text-elegant-warning" :
                            "text-elegant-accent"
                          )}>
                            {alert.title}
                          </p>
                          <p className="text-[11px] text-elegant-dim mt-0.5">{alert.message}</p>
                        </div>
                      </div>
                    ))}

                    {trips.some(t => t.vehicleId === selectedVehicle.id && t.status === 'in-progress') && (
                      <div className="flex gap-3 p-3 rounded bg-elegant-accent/5 border border-elegant-accent/20">
                        <MapPin className="text-elegant-accent shrink-0" size={18} />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="text-xs font-bold text-elegant-accent">Veículo em Rota</p>
                            <button 
                              onClick={() => {
                                setSelectedVehicle(null);
                                onNavigate('trips');
                              }}
                              className="text-[10px] font-bold text-elegant-accent hover:underline flex items-center gap-1"
                            >
                              VER VIAGEM <ArrowRight size={10} />
                            </button>
                          </div>
                          <p className="text-[11px] text-elegant-dim mt-0.5">
                            Este veículo está realizando uma entrega ativa.
                          </p>
                        </div>
                      </div>
                    )}

                    {generateAlerts([selectedVehicle], [], maintenance).length === 0 && 
                     !trips.some(t => t.vehicleId === selectedVehicle.id && t.status === 'in-progress') && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <CheckCircle2 className="text-elegant-success mb-2" size={32} />
                        <p className="text-xs font-bold text-elegant-text">Nenhum alerta crítico</p>
                        <p className="text-[11px] text-elegant-dim mt-1">O veículo está operando dentro dos parâmetros normais.</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-6 border-t border-elegant-border flex gap-3">
                  <button 
                    onClick={() => setSelectedVehicle(null)}
                    className="flex-1 py-2.5 text-xs font-bold text-elegant-dim hover:text-elegant-text border border-elegant-border rounded transition-colors"
                  >
                    FECHAR
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditModalOpen(true);
                      // selectedVehicle is already set
                    }}
                    className="flex-1 py-2.5 text-xs font-bold bg-elegant-accent text-white rounded hover:bg-elegant-accent/90 transition-colors shadow-lg shadow-elegant-accent/20"
                  >
                    EDITAR VEÍCULO
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Vehicle Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedVehicle && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-elegant-card border border-elegant-border rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-elegant-border flex justify-between items-center">
                <h3 className="text-lg font-bold text-elegant-text">Editar Veículo</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-elegant-dim hover:text-elegant-text">
                  <X size={20} />
                </button>
              </div>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const updatedVehicle: Vehicle = {
                    ...selectedVehicle,
                    name: (formData.get('name') as string) || (formData.get('plate') as string),
                    plate: formData.get('plate') as string,
                    model: formData.get('model') as string,
                    year: Number(formData.get('year')),
                    status: formData.get('status') as any,
                    currentKm: Number(formData.get('currentKm')),
                    costPerKm: Number(formData.get('costPerKm')),
                    nextMaintenanceKm: Number(formData.get('nextMaintenanceKm')),
                    insuranceExpiry: formData.get('insuranceExpiry') as string,
                  };
                  onUpdateVehicle(updatedVehicle);
                  setIsEditModalOpen(false);
                  setSelectedVehicle(updatedVehicle);
                }}
                className="p-6 space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-elegant-dim uppercase">Nome do Veículo</label>
                  <input name="name" type="text" defaultValue={selectedVehicle.name} className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="Ex: Carro 01" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Placa</label>
                    <input name="plate" type="text" defaultValue={selectedVehicle.plate} className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Ano</label>
                    <input name="year" type="number" defaultValue={selectedVehicle.year} className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-elegant-dim uppercase">Modelo</label>
                  <input name="model" type="text" defaultValue={selectedVehicle.model} className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" required />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-elegant-dim uppercase">Status</label>
                  <select name="status" defaultValue={selectedVehicle.status} className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent">
                    <option value="active">Ativo</option>
                    <option value="maintenance">Manutenção</option>
                    <option value="alert">Alerta</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">KM Atual</label>
                    <input name="currentKm" type="number" defaultValue={selectedVehicle.currentKm} className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Custo/KM (R$)</label>
                    <input name="costPerKm" type="number" step="0.01" defaultValue={selectedVehicle.costPerKm} className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Próx. Revisão (KM)</label>
                    <input name="nextMaintenanceKm" type="number" defaultValue={selectedVehicle.nextMaintenanceKm} className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Venc. Seguro</label>
                    <input name="insuranceExpiry" type="date" defaultValue={selectedVehicle.insuranceExpiry} className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" required />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsDeleteConfirmOpen(true);
                    }}
                    className="px-4 py-2 text-xs font-bold text-elegant-danger hover:bg-elegant-danger/10 border border-elegant-danger/20 rounded transition-colors"
                  >
                    REMOVER
                  </button>
                  <div className="flex-1" />
                  <button 
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-elegant-dim hover:text-elegant-text border border-elegant-border rounded transition-colors"
                  >
                    CANCELAR
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-elegant-accent text-white rounded hover:bg-elegant-accent/90 transition-colors shadow-lg shadow-elegant-accent/20"
                  >
                    SALVAR ALTERAÇÕES
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && selectedVehicle && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-elegant-card border border-elegant-border rounded-lg shadow-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-elegant-danger/10 text-elegant-danger rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-bold text-elegant-text mb-2">Confirmar Remoção</h3>
              <p className="text-sm text-elegant-dim mb-6">
                Tem certeza que deseja remover o veículo <span className="text-elegant-text font-bold">{selectedVehicle.name}</span> da frota? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-elegant-dim hover:text-elegant-text border border-elegant-border rounded transition-colors"
                >
                  CANCELAR
                </button>
                <button 
                  onClick={() => {
                    onDeleteVehicle(selectedVehicle.id);
                    setIsDeleteConfirmOpen(false);
                    setIsEditModalOpen(false);
                    setSelectedVehicle(null);
                  }}
                  className="flex-1 py-2.5 text-xs font-bold bg-elegant-danger text-white rounded hover:bg-elegant-danger/90 transition-colors"
                >
                  REMOVER
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Vehicle Modal */}
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
                <h3 className="text-lg font-bold text-elegant-text">Novo Veículo</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-elegant-dim hover:text-elegant-text">
                  <X size={20} />
                </button>
              </div>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newVehicle: Vehicle = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: (formData.get('name') as string) || (formData.get('plate') as string),
                    plate: formData.get('plate') as string,
                    model: formData.get('model') as string,
                    year: Number(formData.get('year')),
                    status: 'active',
                    currentKm: Number(formData.get('currentKm')),
                    costPerKm: Number(formData.get('costPerKm')),
                    nextMaintenanceKm: Number(formData.get('nextMaintenanceKm')),
                    insuranceExpiry: formData.get('insuranceExpiry') as string,
                  };
                  onAddVehicle(newVehicle);
                  setIsModalOpen(false);
                }}
                className="p-6 space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-elegant-dim uppercase">Nome do Veículo</label>
                  <input name="name" type="text" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="Ex: Carro 01" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Placa</label>
                    <input name="plate" type="text" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="ABC-1234" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Ano</label>
                    <input name="year" type="number" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="2024" required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-elegant-dim uppercase">Modelo</label>
                  <input name="model" type="text" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="Ex: Volvo FH 540" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">KM Atual</label>
                    <input name="currentKm" type="number" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="0" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Custo/KM (R$)</label>
                    <input name="costPerKm" type="number" step="0.01" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="0,00" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Próx. Revisão (KM)</label>
                    <input name="nextMaintenanceKm" type="number" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="0" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Venc. Seguro</label>
                    <input name="insuranceExpiry" type="date" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" required />
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
                    CADASTRAR VEÍCULO
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
