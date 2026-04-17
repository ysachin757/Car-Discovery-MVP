import { FormEvent, useEffect, useState } from "react";
import { getQuestions } from "../../services/apiClient";
import { RecommendationPayload } from "../../types/api";
import { Question } from "../../types/api";

type PreferencesFormInput = {
  budgetMin: string;
  budgetMax: string;
  preferredBodyTypes: string[];
  preferredFuelTypes: string[];
  minMileage: string;
  minSafetyRating: string;
};

interface Props {
  onSubmit: (values: RecommendationPayload["preferences"]) => Promise<void>;
}

const defaultValues: PreferencesFormInput = {
  budgetMin: "",
  budgetMax: "",
  preferredBodyTypes: [],
  preferredFuelTypes: [],
  minMileage: "",
  minSafetyRating: ""
};

export function QuestionnaireForm({ onSubmit }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [values, setValues] = useState<PreferencesFormInput>(defaultValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getQuestions()
      .then(setQuestions)
      .catch(() => setError("Unable to load questions"));
  }, []);

  const handleMultiSelect = (
    key: "preferredBodyTypes" | "preferredFuelTypes",
    value: string,
    checked: boolean
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: checked ? [...prev[key], value] : prev[key].filter((item) => item !== value)
    }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const budgetMin = Number(values.budgetMin);
    const budgetMax = Number(values.budgetMax);
    const minMileage = Number(values.minMileage);
    const minSafetyRating = Number(values.minSafetyRating);

    if ([budgetMin, budgetMax, minMileage, minSafetyRating].some(Number.isNaN)) {
      setError("Please fill in all numeric values before generating your shortlist.");
      return;
    }

    if (budgetMin > budgetMax) {
      setError("Budget minimum must be less than or equal to budget maximum");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await onSubmit({
        budgetMin,
        budgetMax,
        preferredBodyTypes: values.preferredBodyTypes,
        preferredFuelTypes: values.preferredFuelTypes,
        minMileage,
        minSafetyRating
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="panel questionnaire-panel" onSubmit={submit}>
      <div className="section-heading">
        <span className="eyebrow">Step 1</span>
        <h2>Tell us what you need</h2>
        <p className="muted">Start with a blank form, answer a few quick questions, and get a focused shortlist.</p>
      </div>

      <div className="grid two-col">
        <label>
          Budget Min (INR)
          <input
            type="number"
            value={values.budgetMin}
            onChange={(e) => setValues({ ...values, budgetMin: e.target.value })}
            min={500000}
            step={50000}
            placeholder="e.g. 700000"
          />
        </label>
        <label>
          Budget Max (INR)
          <input
            type="number"
            value={values.budgetMax}
            onChange={(e) => setValues({ ...values, budgetMax: e.target.value })}
            min={500000}
            step={50000}
            placeholder="e.g. 1500000"
          />
        </label>
      </div>

      <fieldset className="option-group">
        <legend>Body Type</legend>
        <div className="inline-list">
          {questions
            .find((q) => q.id === "bodyType")
            ?.options?.map((option) => (
              <label className="pill-option" key={option.value}>
                <input
                  type="checkbox"
                  checked={values.preferredBodyTypes.includes(option.value)}
                  onChange={(e) => handleMultiSelect("preferredBodyTypes", option.value, e.target.checked)}
                />
                {option.label}
              </label>
            ))}
        </div>
      </fieldset>

      <fieldset className="option-group">
        <legend>Fuel Type</legend>
        <div className="inline-list">
          {questions
            .find((q) => q.id === "fuelType")
            ?.options?.map((option) => (
              <label className="pill-option" key={option.value}>
                <input
                  type="checkbox"
                  checked={values.preferredFuelTypes.includes(option.value)}
                  onChange={(e) => handleMultiSelect("preferredFuelTypes", option.value, e.target.checked)}
                />
                {option.label}
              </label>
            ))}
        </div>
      </fieldset>

      <div className="grid two-col">
        <label>
          Minimum Mileage (km/l)
          <input
            type="number"
            value={values.minMileage}
            onChange={(e) => setValues({ ...values, minMileage: e.target.value })}
            min={10}
            max={30}
            placeholder="e.g. 16"
          />
        </label>
        <label>
          Minimum Safety Rating
          <input
            type="number"
            value={values.minSafetyRating}
            onChange={(e) => setValues({ ...values, minSafetyRating: e.target.value })}
            min={0}
            max={5}
            step={0.1}
            placeholder="e.g. 4"
          />
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? "Generating..." : "Generate Shortlist"}
      </button>
    </form>
  );
}
