-- HE Travels&Tuors - Add created_by and updated_by
-- Migration 00002

-- Add created_by (TEXT = user email) to all tables
ALTER TABLE vehicles ADD COLUMN created_by TEXT, ADD COLUMN updated_by TEXT;
ALTER TABLE drivers ADD COLUMN created_by TEXT, ADD COLUMN updated_by TEXT;
ALTER TABLE trips ADD COLUMN created_by TEXT, ADD COLUMN updated_by TEXT;
ALTER TABLE expenses ADD COLUMN created_by TEXT;
ALTER TABLE fuel_fillups ADD COLUMN created_by TEXT;
ALTER TABLE maintenance_records ADD COLUMN created_by TEXT, ADD COLUMN updated_by TEXT;
