import React from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  MapPin, 
  DollarSign, 
  Fuel, 
  Wrench, 
  CreditCard, 
  FileText, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export type ViewType = 
  | 'dashboard' | 'fleet' | 'drivers' | 'trips' 
  | 'expenses' | 'fuel' | 'maintenance' | 'tolls' 
  | 'contracts' | 'analysis' | 'settings';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'fleet', label: 'Frota', icon: Truck },
  { id: 'drivers', label: 'Motoristas', icon: Users },
  { id: 'trips', label: 'Viagens', icon: MapPin },
  { id: 'expenses', label: 'Custos & Manutenção', icon: DollarSign },
  { id: 'fuel', label: 'Combustível', icon: Fuel },
  { id: 'tolls', label: 'Pedágios & Taxas', icon: CreditCard },
  { id: 'contracts', label: 'Contratos', icon: FileText },
  { id: 'analysis', label: 'Análises', icon: BarChart3 },
  { id: 'settings', label: 'Configurações', icon: Settings },
] as const;

export const Sidebar = ({ activeView, onViewChange, isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-[70] w-[240px] h-screen border-r border-elegant-border bg-elegant-card flex flex-col transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between lg:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className="text-elegant-accent">
              <Truck size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-sm font-extrabold tracking-widest text-elegant-text font-headline">
              <span className="text-elegant-accent">HE</span> TRAVELS&TUORS
            </h1>
          </div>
          <button onClick={onClose} className="lg:hidden text-elegant-dim hover:text-elegant-text p-1">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id as ViewType);
                if (window.innerWidth < 1024) onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-2.5 transition-all duration-200 group relative text-[13px]",
                activeView === item.id 
                  ? "text-white bg-elegant-accent/10 border-l-4 border-elegant-accent" 
                  : "text-elegant-dim hover:text-elegant-text hover:bg-white/5 border-l-4 border-transparent"
              )}
            >
              <item.icon size={16} className={cn(
                "transition-colors",
                activeView === item.id ? "text-elegant-accent" : "group-hover:text-elegant-text"
              )} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-elegant-border">
          <button className="w-full flex items-center gap-3 px-6 py-2.5 text-elegant-dim hover:text-elegant-text text-[13px] transition-colors">
            <Settings size={16} />
            <span>Configurações</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export const Header = ({ title, onMenuClick, alertCount = 0 }: { title: string; onMenuClick: () => void; alertCount?: number }) => {
  return (
    <header className="h-16 border-b border-elegant-border bg-elegant-bg sticky top-0 z-50 px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3 lg:gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-elegant-dim hover:text-elegant-text transition-colors"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-base lg:text-lg font-semibold tracking-tight text-elegant-text truncate max-w-[180px] sm:max-w-none">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="hidden sm:block text-[12px] text-elegant-dim">
          Atualizado: Hoje, {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="hidden sm:block h-4 w-[1px] bg-elegant-border" />
        <button className="relative text-elegant-dim hover:text-elegant-text transition-colors p-2">
          <Bell size={18} />
          {alertCount > 0 && (
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-elegant-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-elegant-bg">
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
