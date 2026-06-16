export type VehicleStatus = 'active' | 'maintenance' | 'inactive' | 'alert';

export interface CreatedBy {
  id: string;
  email: string;
}

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  model: string;
  year: number;
  status: VehicleStatus;
  currentKm: number;
  costPerKm: number;
  nextMaintenanceKm: number;
  insuranceExpiry: string;
  createdBy?: CreatedBy;
  updatedBy?: CreatedBy;
}

export interface Driver {
  id: string;
  name: string;
  cnh: string;
  cnhExpiry: string;
  status: 'active' | 'on-trip' | 'vacation' | 'suspended';
  productivity: number;
  occurrences: number;
  createdBy?: CreatedBy;
  updatedBy?: CreatedBy;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  distance: number;
  cargo: string;
  revenue: number;
  cost: number;
  margin: number;
  date: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  createdBy?: CreatedBy;
  updatedBy?: CreatedBy;
}

export interface Expense {
  id: string;
  vehicleId: string;
  category: 'fuel' | 'maintenance' | 'toll' | 'tax' | 'other';
  amount: number;
  date: string;
  description: string;
  invoiceNumber?: string;
  createdBy?: CreatedBy;
}

export interface FuelFillup {
  id: string;
  vehicleId: string;
  date: string;
  liters: number;
  pricePerLiter: number;
  totalAmount: number;
  currentKm: number;
  stationName: string;
  createdBy?: CreatedBy;
  updatedBy?: CreatedBy;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'preventive' | 'corrective';
  description: string;
  cost: number;
  date: string;
  status: 'pending' | 'completed' | 'in-progress';
  createdBy?: CreatedBy;
  updatedBy?: CreatedBy;
}

export interface KPI {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  unit?: string;
}
