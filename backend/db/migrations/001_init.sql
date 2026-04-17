CREATE TABLE IF NOT EXISTS cars (
  id VARCHAR(64) PRIMARY KEY,
  make VARCHAR(80) NOT NULL,
  model VARCHAR(80) NOT NULL,
  variant VARCHAR(80) NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  mileage NUMERIC(6, 2) NOT NULL,
  body_type VARCHAR(32) NOT NULL,
  fuel_type VARCHAR(32) NOT NULL,
  transmission VARCHAR(32) NOT NULL,
  safety_rating NUMERIC(2, 1) NOT NULL,
  user_rating NUMERIC(2, 1) NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  review_summary TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recommendation_requests (
  request_id VARCHAR(64) PRIMARY KEY,
  session_id VARCHAR(128) NOT NULL,
  budget_min NUMERIC(12, 2) NOT NULL,
  budget_max NUMERIC(12, 2) NOT NULL,
  preferred_body_types JSONB NOT NULL DEFAULT '[]'::jsonb,
  preferred_fuel_types JSONB NOT NULL DEFAULT '[]'::jsonb,
  min_mileage NUMERIC(6, 2) NOT NULL,
  min_safety_rating NUMERIC(2, 1) NOT NULL,
  max_results INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recommendation_results (
  result_id VARCHAR(64) PRIMARY KEY,
  request_id VARCHAR(64) NOT NULL REFERENCES recommendation_requests(request_id),
  car_id VARCHAR(64) NOT NULL REFERENCES cars(id),
  score NUMERIC(4, 3) NOT NULL,
  rank INTEGER NOT NULL,
  reason_codes JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_body_type ON cars(body_type);
CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON cars(fuel_type);
CREATE INDEX IF NOT EXISTS idx_cars_safety_rating ON cars(safety_rating);
