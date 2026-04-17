import { RecommendationItem } from "../../types/api";
import { formatCurrencyINR } from "../../utils/formatters";

interface Props {
  items: RecommendationItem[];
  onSelect: (carId: string) => void;
}

export function RecommendationList({ items, onSelect }: Props) {
  if (!items.length) {
    return (
      <section className="panel empty-state">
        <h2>Your shortlist</h2>
        <p className="muted">Your recommendations will appear here after you submit the questionnaire.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <span className="eyebrow">Step 2</span>
        <h2>Your shortlist</h2>
        <p className="muted">Ranked matches with the strongest fit at the top.</p>
      </div>
      <div className="cards">
        {items.map((item) => (
          <article className="card" key={item.carId}>
            <div className="card-topline">
              <span className="rank-badge">#{item.rank}</span>
              <span className="score-badge">Score {item.score}</span>
            </div>
            <h3>{item.name}</h3>
            <p className="card-price">{formatCurrencyINR(item.price)}</p>
            <div className="tag-row">
              <span className="tag">{item.bodyType}</span>
              <span className="tag">{item.fuelType}</span>
              <span className="tag">{item.mileage} km/l</span>
              <span className="tag">{item.rating} / 5</span>
            </div>
            <ul className="reason-list">
              {item.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
            <button className="secondary-button" onClick={() => onSelect(item.carId)}>View Details</button>
          </article>
        ))}
      </div>
    </section>
  );
}
