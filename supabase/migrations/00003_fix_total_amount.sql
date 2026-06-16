-- Fix total_amount column: add trigger to auto-calculate since
-- GENERATED ALWAYS AS is not properly supported by Supabase/PostgREST.
-- (The generated expression was already dropped by the initial migration.)

CREATE OR REPLACE FUNCTION calc_fuel_total_amount()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_amount := NEW.liters * NEW.price_per_liter;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_fuel_fillups_calc_total
  BEFORE INSERT ON fuel_fillups
  FOR EACH ROW
  EXECUTE FUNCTION calc_fuel_total_amount();
