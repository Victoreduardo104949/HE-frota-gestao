import { Vehicle, Driver, Trip, KPI, Expense, FuelFillup, MaintenanceRecord } from './types';

export const MOCK_VEHICLES: Vehicle[] = [
  { id: '1', plate: 'ABC-1234', model: 'Volvo FH 540', year: 2022, status: 'active', currentKm: 125000, costPerKm: 2.45, nextMaintenanceKm: 130000, insuranceExpiry: '2026-12-15', hasInsurance: true },
  { id: '2', plate: 'XYZ-5678', model: 'Scania R 450', year: 2021, status: 'maintenance', currentKm: 210000, costPerKm: 2.60, nextMaintenanceKm: 210000, insuranceExpiry: '2026-08-20', hasInsurance: true },
  { id: '3', plate: 'KJH-9012', model: 'Mercedes-Benz Actros', year: 2023, status: 'active', currentKm: 45000, costPerKm: 2.30, nextMaintenanceKm: 50000, insuranceExpiry: '2027-01-10', hasInsurance: true },
  { id: '4', plate: 'LMN-3456', model: 'DAF XF 530', year: 2020, status: 'alert', currentKm: 350000, costPerKm: 2.85, nextMaintenanceKm: 355000, insuranceExpiry: '2026-04-30', hasInsurance: true },
];

export const MOCK_DRIVERS: Driver[] = [
  { id: '1', name: 'João Silva', cnh: '12345678900', cnhExpiry: '2028-05-10', status: 'on-trip', productivity: 92, occurrences: 0 },
  { id: '2', name: 'Maria Santos', cnh: '98765432100', cnhExpiry: '2026-11-22', status: 'active', productivity: 88, occurrences: 1 },
  { id: '3', name: 'Pedro Oliveira', cnh: '45678912300', cnhExpiry: '2027-02-15', status: 'vacation', productivity: 95, occurrences: 0 },
];

export const MOCK_TRIPS: Trip[] = [];

export const MOCK_KPIS: KPI[] = [
  { label: 'Custo Total', value: 0, change: 0, trend: 'neutral', unit: 'R$' },
  { label: 'Receita Total', value: 0, change: 0, trend: 'neutral', unit: 'R$' },
  { label: 'Margem Média', value: 0, change: 0, trend: 'neutral', unit: '%' },
  { label: 'KM Rodados', value: 0, change: 0, trend: 'neutral', unit: 'km' },
];

export const COST_BY_CATEGORY = [
  { name: 'Combustível', value: 0, color: '#3B82F6' },
  { name: 'Manutenção', value: 0, color: '#6366F1' },
  { name: 'Pedágios', value: 0, color: '#A855F7' },
  { name: 'Taxas/Impostos', value: 0, color: '#EC4899' },
  { name: 'Custos Fixos', value: 0, color: '#10B981' },
  { name: 'Outros', value: 0, color: '#F59E0B' },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: '1', vehicleId: 'general', category: 'fixed', amount: 5000, date: '2026-04-01', description: 'Aluguel do Galpão' },
  { id: '2', vehicleId: 'general', category: 'fixed', amount: 1200, date: '2026-04-05', description: 'Internet e Software' },
  { id: '3', vehicleId: 'general', category: 'tax', amount: 800, date: '2026-04-10', description: 'Taxas Administrativas' },
];

export const MONTHLY_FINANCIAL_SUMMARY = [
  { month: 'Nov', receita: 0, custos: 0 },
  { month: 'Dez', receita: 0, custos: 0 },
  { month: 'Jan', receita: 0, custos: 0 },
  { month: 'Fev', receita: 0, custos: 0 },
  { month: 'Mar', receita: 0, custos: 0 },
  { month: 'Abr', receita: 0, custos: 0 },
];

export const MOCK_FUEL_FILLUPS: FuelFillup[] = [
  { id: '1', vehicleId: '1', date: '2026-04-14', liters: 450, pricePerLiter: 5.85, totalAmount: 2632.50, currentKm: 125000, stationName: 'Posto Graal' },
  { id: '2', vehicleId: '2', date: '2026-04-13', liters: 380, pricePerLiter: 5.92, totalAmount: 2249.60, currentKm: 210000, stationName: 'Posto Ipiranga' },
  { id: '3', vehicleId: '3', date: '2026-04-12', liters: 520, pricePerLiter: 5.88, totalAmount: 3057.60, currentKm: 45000, stationName: 'Posto Shell' },
  { id: '4', vehicleId: '1', date: '2026-04-10', liters: 420, pricePerLiter: 5.80, totalAmount: 2436.00, currentKm: 124200, stationName: 'Posto Petrobras' },
];

export const MOCK_MAINTENANCE: MaintenanceRecord[] = [];
