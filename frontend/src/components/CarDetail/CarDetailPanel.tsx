import { CarDetail } from "../../types/api";
import { formatCurrencyINR } from "../../utils/formatters";

interface Props {
  car: CarDetail | null;
}

export function CarDetailPanel({ car }: Props) {
  if (!car) {
    return (
      <section className="panel empty-state">
        <h2>Car details</h2>
        <p className="muted">Select a car from your shortlist to view complete details.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <span className="eyebrow">Step 3</span>
        <h2>
          {car.make} {car.model} {car.variant}
        </h2>
        <p className="muted">Inspect the shortlisted car in detail before you decide.</p>
      </div>

      <div className="detail-grid">
        <div className="detail-card highlight">
          <span>Price</span>
          <strong>{formatCurrencyINR(car.price)}</strong>
        </div>
        <div className="detail-card">
          <span>Mileage</span>
          <strong>{car.mileage} km/l</strong>
        </div>
        <div className="detail-card">
          <span>Safety</span>
          <strong>{car.safetyRating} / 5</strong>
        </div>
        <div className="detail-card">
          <span>User Rating</span>
          <strong>{car.userRating} / 5</strong>
        </div>
      </div>

      <div className="tag-row spacing-top">
        <span className="tag">{car.bodyType}</span>
        <span className="tag">{car.fuelType}</span>
        <span className="tag">{car.transmission}</span>
      </div>

      <p className="review-copy">{car.reviewSummary}</p>

      <h3>Key Features</h3>
      <ul className="reason-list">
        {car.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </section>
  );
}
