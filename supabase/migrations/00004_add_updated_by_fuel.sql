-- Add updated_by to fuel_fillups for edit tracking
ALTER TABLE fuel_fillups ADD COLUMN updated_by TEXT;