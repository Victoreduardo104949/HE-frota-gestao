import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Plus, 
  Download, 
  Fuel, 
  Wrench, 
  CreditCard, 
  FileText,
  AlertCircle,
  X,
  History,
  Trash2
} from 'lucide-react';
import { formatCurrency, formatNumber, cn } from '../lib/utils';
import { Card, StatCard } from './UI';
import { 
  COST_BY_CATEGORY, 
  MONTHLY_FINANCIAL_SUMMARY,
} from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Expense, MaintenanceRecord, Vehicle } from '../types';
import { UserBadge } from './UserAvatar';

const CATEGORY_ICONS = {
  fuel: Fuel,
  maintenance: Wrench,
  toll: CreditCard,
  tax: FileText,
  other: AlertCircle
};

const CATEGORY_LABELS = {
  fuel: 'Combustível',
  maintenance: 'Manutenção',
  toll: 'Pedágio',
  tax: 'Taxas/Impostos',
  other: 'Outros'
};

const CATEGORY_COLORS = {
  fuel: '#3B82F6',
  maintenance: '#6366F1',
  toll: '#A855F7',
  tax: '#EC4899',
  other: '#F59E0B'
};

const BUDGET_VS_ACTUAL = [
  { category: 'Combustível', orçado: 80000, realizado: 0 },
  { category: 'Manutenção', orçado: 30000, realizado: 0 },
  { category: 'Pedágios', orçado: 14000, realizado: 0 },
  { category: 'Taxas', orçado: 12000, realizado: 0 },
  { category: 'Outros', orçado: 10000, realizado: 0 },
];

interface CostsViewProps {
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
  maintenanceRecords: MaintenanceRecord[];
  onAddMaintenance: (record: MaintenanceRecord) => void;
  onUpdateMaintenance: (record: MaintenanceRecord) => void;
  onDeleteMaintenance: (id: string) => void;
  vehicles: Vehicle[];
}

export const CostsView = ({ 
  expenses, 
  onAddExpense, 
  maintenanceRecords, 
  onAddMaintenance, 
  onUpdateMaintenance,
  onDeleteMaintenance,
  vehicles 
}: CostsViewProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isMaintModalOpen, setIsMaintModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'finance' | 'maintenance'>('finance');
  
  // Calculate totals from dynamic expenses
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  
  // Update budget vs actual based on dynamic expenses
  const dynamicBudgetVsActual = BUDGET_VS_ACTUAL.map(item => {
    const categoryMap = {
      'Combustível': 'fuel',
      'Manutenção': 'maintenance',
      'Pedágios': 'toll',
      'Taxas': 'tax',
      'Outros': 'other'
    };
    const cat = categoryMap[item.category as keyof typeof categoryMap];
    const actual = expenses
      .filter(e => e.category === cat)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { ...item, realizado: actual };
  });

  // Dynamic cost distribution for pie chart
  const dynamicCostDistribution = Object.entries(CATEGORY_LABELS).map(([key, label]) => {
    const value = expenses
      .filter(e => e.category === key)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { 
      name: label, 
      value, 
      color: CATEGORY_COLORS[key as keyof typeof CATEGORY_COLORS] 
    };
  }).filter(item => item.value > 0);

  // Fallback for pie chart if empty
  const pieData = dynamicCostDistribution.length > 0 
    ? dynamicCostDistribution 
    : [{ name: 'Sem dados', value: 1, color: '#23252E' }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 w-full sm:w-auto">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-elegant-text">Custos & Manutenção</h2>
            <p className="text-xs text-elegant-dim mt-1">Gestão financeira e operacional da frota</p>
          </div>
          
          <div className="flex bg-elegant-card border border-elegant-border rounded-lg p-1 w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('finance')}
              className={cn(
                "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-md text-[10px] sm:text-xs font-bold transition-all",
                activeTab === 'finance' ? "bg-elegant-accent text-white shadow-lg" : "text-elegant-dim hover:text-elegant-text"
              )}
            >
              <DollarSign size={14} /> FINANCEIRO
            </button>
            <button 
              onClick={() => setActiveTab('maintenance')}
              className={cn(
                "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-md text-[10px] sm:text-xs font-bold transition-all",
                activeTab === 'maintenance' ? "bg-elegant-accent text-white shadow-lg" : "text-elegant-dim hover:text-elegant-text"
              )}
            >
              <Wrench size={14} /> MANUTENÇÃO
            </button>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {activeTab === 'finance' ? (
            <>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-elegant-card border border-elegant-border rounded text-xs font-medium hover:bg-white/5 transition-colors text-elegant-text">
                <Download size={14} /> Exportar
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-elegant-accent text-white rounded text-xs font-bold hover:bg-elegant-accent/90 transition-colors shadow-lg shadow-elegant-accent/10"
              >
                <Plus size={14} /> Nova Despesa
              </button>
            </>
          ) : (
            <>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-elegant-card border border-elegant-border rounded text-xs font-medium hover:bg-white/5 transition-colors text-elegant-text">
                <History size={14} /> Histórico
              </button>
              <button 
                onClick={() => setIsMaintModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-elegant-accent text-white rounded text-xs font-bold hover:bg-elegant-accent/90 transition-colors shadow-lg shadow-elegant-accent/10"
              >
                <Plus size={14} /> Nova O.S.
              </button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'finance' ? (
          <motion.div 
            key="finance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Financial KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                label="Custo Total (Mês)"
                value={formatCurrency(totalExpenses)}
                change={totalExpenses > 0 ? 100 : 0}
                trend={totalExpenses > 0 ? 'up' : 'neutral'}
              />
              <StatCard 
                label="Receita Total (Mês)"
                value="R$ 0"
                change={0}
                trend="neutral"
              />
              <StatCard 
                label="Margem de Lucro"
                value="0%"
                change={0}
                trend="neutral"
              />
              <StatCard 
                label="Custo Médio / KM"
                value="R$ 0,00"
                change={0}
                trend="neutral"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Revenue vs Costs Chart */}
              <Card title="Evolução Financeira" subtitle="Receita vs Custos (Últimos 6 meses)" className="lg:col-span-2">
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MONTHLY_FINANCIAL_SUMMARY} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCustos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#23252E" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#8D8D99" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#8D8D99" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `R$ ${value / 1000}k`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#16171D', border: '1px solid #23252E', borderRadius: '6px' }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="receita" stroke="#3B82F6" fillOpacity={1} fill="url(#colorReceita)" strokeWidth={2} />
                      <Area type="monotone" dataKey="custos" stroke="#EC4899" fillOpacity={1} fill="url(#colorCustos)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Cost Distribution Pie Chart */}
              <Card title="Distribuição de Custos" subtitle="Por categoria de despesa">
                <div className="h-[240px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#16171D', border: '1px solid #23252E', borderRadius: '6px' }}
                        itemStyle={{ fontSize: '12px', color: '#E1E1E6' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {dynamicCostDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-elegant-dim">{item.name}</span>
                      </div>
                      <span className="font-mono text-elegant-text">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                  {dynamicCostDistribution.length === 0 && (
                    <p className="text-center text-[10px] text-elegant-dim py-4 italic">Nenhuma despesa registrada</p>
                  )}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Budget vs Actual */}
              <Card title="Orçado vs Realizado" subtitle="Comparativo de metas financeiras mensais">
                <div className="h-[280px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dynamicBudgetVsActual} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#23252E" vertical={false} />
                      <XAxis 
                        dataKey="category" 
                        stroke="#8D8D99" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#8D8D99" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `R$ ${value / 1000}k`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#16171D', border: '1px solid #23252E', borderRadius: '6px' }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                      <Bar dataKey="orçado" fill="#23252E" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="realizado" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Recent Expenses Table */}
              <Card title="Lançamentos Recentes" subtitle="Últimas despesas registradas">
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-elegant-border">
                        <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Data</th>
                        <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Categoria</th>
                        <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Criado por</th>
                        <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2 text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {expenses.slice(0, 5).map((expense) => {
                        return (
                          <tr key={expense.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="py-3 px-2 text-xs text-elegant-dim font-mono">
                              {new Date(expense.date).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="py-3 px-2">
                              <span className="text-xs font-medium text-elegant-text">{CATEGORY_LABELS[expense.category]}</span>
                            </td>
                            <td className="py-3 px-2">
                              <UserBadge user={expense.createdBy} />
                            </td>
                            <td className="py-3 px-2 text-right text-xs font-bold text-elegant-text font-mono">
                              {formatCurrency(expense.amount)}
                            </td>
                          </tr>
                        );
                      })}
                      {expenses.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-xs text-elegant-dim italic">Nenhum lançamento encontrado</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-auto pt-6 text-center">
                  <button className="text-[12px] text-elegant-dim hover:text-elegant-text border border-elegant-border px-4 py-2 rounded transition-colors w-full">
                    Ver todos os lançamentos
                  </button>
                </div>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="maintenance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Maintenance KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                label="O.S. em Aberto"
                value={maintenanceRecords.filter(r => r.status !== 'completed').length}
                change={0}
                trend="neutral"
              />
              <StatCard 
                label="Custo Manutenção (Mês)"
                value={formatCurrency(expenses.filter(e => e.category === 'maintenance').reduce((acc, curr) => acc + curr.amount, 0))}
                change={0}
                trend="neutral"
              />
              <StatCard 
                label="Preventivas Realizadas"
                value={maintenanceRecords.filter(r => r.type === 'preventive' && r.status === 'completed').length}
                change={0}
                trend="neutral"
              />
              <StatCard 
                label="Indisponibilidade"
                value={`${((maintenanceRecords.filter(r => r.status === 'in-progress').length / (vehicles.length || 1)) * 100).toFixed(0)}%`}
                change={0}
                trend="neutral"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Active Maintenance Table */}
              <Card title="Ordens de Serviço Ativas" subtitle="Monitoramento de veículos em oficina" className="lg:col-span-2">
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-elegant-border">
                        <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Veículo</th>
                        <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Tipo</th>
                        <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Descrição</th>
                        <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Criado por</th>
                        <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2">Status</th>
                        <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2 text-right">Custo Est.</th>
                        <th className="pb-3 text-[11px] font-bold text-elegant-dim uppercase tracking-wider px-2 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {maintenanceRecords.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-xs text-elegant-dim italic">Nenhuma ordem de serviço ativa</td>
                        </tr>
                      ) : (
                        maintenanceRecords.map((record) => {
                          const vehicle = vehicles.find(v => v.id === record.vehicleId);
                          return (
                            <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 px-2">
                                <span className="font-mono text-[11px] bg-elegant-bg border border-elegant-border px-1.5 py-0.5 rounded text-elegant-dim">
                                  {vehicle?.name || vehicle?.plate || 'Geral'}
                                </span>
                              </td>
                              <td className="py-3 px-2">
                                <span className={cn(
                                  "text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase",
                                  record.type === 'preventive' ? "text-elegant-accent border-elegant-accent/20 bg-elegant-accent/5" : "text-elegant-warning border-elegant-warning/20 bg-elegant-warning/5"
                                )}>
                                  {record.type === 'preventive' ? 'Prev' : 'Corr'}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-xs text-elegant-text">{record.description}</td>
                              <td className="py-3 px-2">
                                <UserBadge user={record.createdBy} />
                              </td>
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-1.5">
                                  <div className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    record.status === 'completed' ? "bg-elegant-success" : record.status === 'in-progress' ? "bg-elegant-warning" : "bg-elegant-dim"
                                  )} />
                                  <span className="text-[10px] text-elegant-dim font-medium">
                                    {record.status === 'completed' ? 'Concluído' : record.status === 'in-progress' ? 'Em execução' : 'Pendente'}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-2 text-right text-xs font-bold text-elegant-text font-mono">
                                {formatCurrency(record.cost)}
                              </td>
                              <td className="py-3 px-2 text-right">
                                <div className="flex items-center justify-end gap-3">
                                  {record.status !== 'completed' && (
                                    <button 
                                      onClick={() => {
                                        const nextStatus = record.status === 'pending' ? 'in-progress' : 'completed';
                                        onUpdateMaintenance({ ...record, status: nextStatus });
                                      }}
                                      className="text-[10px] font-bold text-elegant-accent hover:underline"
                                    >
                                      {record.status === 'pending' ? 'INICIAR' : 'CONCLUIR'}
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => {
                                      if (window.confirm('Tem certeza que deseja remover esta ordem de serviço?')) {
                                        onDeleteMaintenance(record.id);
                                      }
                                    }}
                                    className="text-elegant-dim hover:text-elegant-danger transition-colors"
                                    title="Remover O.S."
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Maintenance Alerts */}
              <Card title="Próximas Manutenções" subtitle="Baseado na quilometragem atual">
                <div className="space-y-4 mt-4">
                  {vehicles.filter(v => v.status === 'alert' || (v.nextMaintenanceKm - v.currentKm) < 5000).map((vehicle) => {
                    const remaining = vehicle.nextMaintenanceKm - vehicle.currentKm;
                    const isUrgent = remaining < 1000;
                    
                    return (
                      <div key={vehicle.id} className="p-3 rounded bg-elegant-bg border border-elegant-border group hover:border-elegant-accent/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-elegant-text">{vehicle.name}</span>
                          <span className={cn(
                            "text-[9px] font-bold px-1.5 py-0.5 rounded",
                            isUrgent ? "bg-elegant-danger/10 text-elegant-danger" : "bg-elegant-warning/10 text-elegant-warning"
                          )}>
                            {isUrgent ? 'URGENTE' : 'PRÓXIMO'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-elegant-dim mb-2">
                          <span>Faltam {formatNumber(remaining)} km</span>
                          <span>{vehicle.model}</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full transition-all duration-1000", isUrgent ? "bg-elegant-danger" : "bg-elegant-warning")}
                            style={{ width: `${Math.max(100 - (remaining / 5000) * 100, 0)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {vehicles.filter(v => v.status === 'alert' || (v.nextMaintenanceKm - v.currentKm) < 5000).length === 0 && (
                    <p className="text-center text-[10px] text-elegant-dim py-8 italic">Nenhum alerta de manutenção</p>
                  )}
                </div>
                <button className="w-full mt-6 py-2 text-[11px] font-bold text-elegant-dim hover:text-elegant-text border border-dashed border-elegant-border rounded transition-all">
                  Agendar Manutenções
                </button>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Maintenance Modal */}
      <AnimatePresence>
        {isMaintModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-elegant-card border border-elegant-border rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-elegant-border flex justify-between items-center bg-elegant-bg/50">
                <h3 className="text-lg font-bold text-elegant-text">Nova Ordem de Serviço</h3>
                <button onClick={() => setIsMaintModalOpen(false)} className="text-elegant-dim hover:text-elegant-text">
                  <X size={20} />
                </button>
              </div>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newRecord: MaintenanceRecord = {
                    id: Math.random().toString(36).substr(2, 9),
                    vehicleId: formData.get('vehicleId') as string,
                    type: formData.get('type') as MaintenanceRecord['type'],
                    description: formData.get('description') as string,
                    cost: Number(formData.get('cost')),
                    date: formData.get('date') as string,
                    status: 'pending',
                  };
                  onAddMaintenance(newRecord);
                  setIsMaintModalOpen(false);
                }}
                className="p-6 space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-elegant-dim uppercase">Veículo</label>
                  <select name="vehicleId" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" required>
                    <option value="">Selecione um veículo</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.name} - {v.plate}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Tipo</label>
                    <select name="type" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" required>
                      <option value="preventive">Preventiva</option>
                      <option value="corrective">Corretiva</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Custo Estimado (R$)</label>
                    <input name="cost" type="number" step="0.01" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="0,00" required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-elegant-dim uppercase">Data Prevista</label>
                  <input name="date" type="date" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" defaultValue={new Date().toISOString().split('T')[0]} required />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-elegant-dim uppercase">Descrição do Serviço</label>
                  <textarea name="description" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent h-20 resize-none" placeholder="O que será feito?" required />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsMaintModalOpen(false)}
                    className="flex-1 py-2 text-xs font-bold text-elegant-dim hover:text-elegant-text border border-elegant-border rounded transition-colors"
                  >
                    CANCELAR
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold bg-elegant-accent text-white rounded hover:bg-elegant-accent/90 transition-colors shadow-lg shadow-elegant-accent/20"
                  >
                    ABRIR O.S.
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Expense Modal */}
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
                <h3 className="text-lg font-bold text-elegant-text">Novo Lançamento</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-elegant-dim hover:text-elegant-text">
                  <X size={20} />
                </button>
              </div>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newExpense: Expense = {
                    id: Math.random().toString(36).substr(2, 9),
                    vehicleId: formData.get('vehicleId') as string,
                    category: formData.get('category') as Expense['category'],
                    amount: Number(formData.get('amount')),
                    date: formData.get('date') as string,
                    description: formData.get('description') as string,
                    invoiceNumber: formData.get('invoiceNumber') as string,
                  };
                  onAddExpense(newExpense);
                  setIsModalOpen(false);
                }}
                className="p-6 space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-elegant-dim uppercase">Veículo</label>
                  <select name="vehicleId" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" required>
                    <option value="">Selecione um veículo</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.name} - {v.plate}</option>
                    ))}
                    <option value="general">Geral / Administrativo</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Categoria</label>
                    <select name="category" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" required>
                      {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Valor (R$)</label>
                    <input name="amount" type="number" step="0.01" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="0,00" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Data</label>
                    <input name="date" type="date" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" defaultValue={new Date().toISOString().split('T')[0]} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-elegant-dim uppercase">Documento / NF</label>
                    <input name="invoiceNumber" type="text" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent" placeholder="Ex: NF-123" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-elegant-dim uppercase">Descrição</label>
                  <textarea name="description" className="w-full bg-elegant-bg border border-elegant-border rounded px-3 py-2 text-sm text-elegant-text focus:outline-none focus:border-elegant-accent h-20 resize-none" placeholder="Detalhes da despesa..." required />
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
                    SALVAR DESPESA
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
