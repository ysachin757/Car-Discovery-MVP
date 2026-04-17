# API Reference

Base URL: /api

## GET /health
Returns service availability and timestamp.

Sample response
{
  "status": "ok",
  "timestamp": "2026-04-17T10:35:18.713Z"
}

## GET /questions
Returns questionnaire metadata used by the frontend.

Sample response
{
  "questions": [
    {
      "id": "bodyType",
      "type": "multi-select",
      "label": "Preferred body type",
      "options": [
        { "label": "SUV", "value": "SUV" }
      ]
    }
  ]
}

## POST /recommendations
Generates ranked shortlist from user preferences.

Request body
{
  "sessionId": "sess_123",
  "preferences": {
    "budgetMin": 700000,
    "budgetMax": 1500000,
    "preferredBodyTypes": ["SUV"],
    "preferredFuelTypes": ["Petrol"],
    "minMileage": 16,
    "minSafetyRating": 4
  },
  "maxResults": 5
}

Behavior notes
- When preferredFuelTypes is provided, the backend applies a strict fuel pre-filter before scoring.
- If no cars match preferredFuelTypes, the API returns an empty recommendations list.
- Recommendation name is returned as "Make Model (Variant)".

Sample response
{
  "requestId": "d61ff7d6-0c8a-41a4-b9f6-51c64e78d861",
  "recommendations": [
    {
      "rank": 1,
      "carId": "mahindra_thar_roxx_mx5_diesel",
      "name": "Mahindra Thar ROXX (MX5 Diesel)",
      "price": 1849000,
      "mileage": 15,
      "bodyType": "SUV",
      "fuelType": "Diesel",
      "rating": 4.4,
      "score": 0.88,
      "reasons": [
        "Matches preferred body type",
        "Matches preferred fuel type",
        "Above safety threshold"
      ]
    }
  ]
}

## GET /cars/:carId
Returns detailed fields for a specific car.

Sample response
{
  "id": "mahindra_thar_lx_diesel_mt",
  "make": "Mahindra",
  "model": "Thar",
  "variant": "LX Diesel MT",
  "price": 1449000,
  "mileage": 15,
  "bodyType": "SUV",
  "fuelType": "Diesel",
  "transmission": "Manual",
  "safetyRating": 4,
  "userRating": 4.5,
  "reviewSummary": "Iconic off-roader with strong road presence and adventure appeal.",
  "features": ["4x4", "Touchscreen", "Cruise Control"]
}

## Error envelope
{
  "errorCode": "INVALID_PAYLOAD",
  "message": "Request validation failed",
  "details": []
}
