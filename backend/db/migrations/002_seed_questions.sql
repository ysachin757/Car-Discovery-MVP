INSERT INTO recommendation_requests (
  request_id, session_id, budget_min, budget_max, preferred_body_types,
  preferred_fuel_types, min_mileage, min_safety_rating, max_results
)
VALUES (
  'req_sample_001',
  'sess_sample_001',
  700000,
  1500000,
  '["SUV"]'::jsonb,
  '["Petrol", "Hybrid"]'::jsonb,
  16,
  4,
  5
)
ON CONFLICT (request_id) DO NOTHING;
