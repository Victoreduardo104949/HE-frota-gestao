-- HE Travels&Tuors - Initial Schema
-- Migration 00001

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- VEHICLES
-- ============================================
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plate TEXT NOT NULL UNIQUE,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive', 'alert')),
  current_km NUMERIC(10,2) NOT NULL DEFAULT 0,
  cost_per_km NUMERIC(10,2) NOT NULL DEFAULT 0,
  next_maintenance_km NUMERIC(10,2),
  insurance_expiry DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- DRIVERS
-- ============================================
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cnh TEXT NOT NULL UNIQUE,
  cnh_expiry DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'on-trip', 'vacation', 'suspended')),
  productivity NUMERIC(5,2) NOT NULL DEFAULT 100 CHECK (productivity >= 0 AND productivity <= 100),
  occurrences INTEGER NOT NULL DEFAULT 0 CHECK (occurrences >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TRIPS
-- ============================================
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE RESTRICT,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  distance NUMERIC(10,2) NOT NULL CHECK (distance > 0),
  cargo TEXT,
  revenue NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (revenue >= 0),
  cost NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (cost >= 0),
  margin NUMERIC(12,2) GENERATED ALWAYS AS (revenue - cost) STORED,
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- EXPENSES
-- ============================================
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('fuel', 'maintenance', 'toll', 'tax', 'other')),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  description TEXT,
  invoice_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- FUEL FILLUPS
-- ============================================
CREATE TABLE fuel_fillups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  date DATE NOT NULL,
  liters NUMERIC(10,2) NOT NULL CHECK (liters > 0),
  price_per_liter NUMERIC(8,2) NOT NULL CHECK (price_per_liter > 0),
  total_amount NUMERIC(12,2) GENERATED ALWAYS AS (liters * price_per_liter) STORED,
  current_km NUMERIC(10,2) NOT NULL,
  station_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- MAINTENANCE RECORDS
-- ============================================
CREATE TABLE maintenance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  type TEXT NOT NULL CHECK (type IN ('preventive', 'corrective')),
  description TEXT NOT NULL,
  cost NUMERIC(12,2) NOT NULL CHECK (cost >= 0),
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX idx_trips_driver_id ON trips(driver_id);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_date ON trips(date);

CREATE INDEX idx_expenses_vehicle_id ON expenses(vehicle_id);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_date ON expenses(date);

CREATE INDEX idx_fuel_fillups_vehicle_id ON fuel_fillups(vehicle_id);
CREATE INDEX idx_fuel_fillups_date ON fuel_fillups(date);

CREATE INDEX idx_maintenance_records_vehicle_id ON maintenance_records(vehicle_id);
CREATE INDEX idx_maintenance_records_status ON maintenance_records(status);

CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_drivers_status ON drivers(status);

-- ============================================
-- UPDATED AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_drivers_updated_at
  BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_maintenance_records_updated_at
  BEFORE UPDATE ON maintenance_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_fillups ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated" ON vehicles
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated" ON drivers
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated" ON trips
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated" ON expenses
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated" ON fuel_fillups
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated" ON maintenance_records
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
