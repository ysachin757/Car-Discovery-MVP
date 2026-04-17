interface ExplainInput {
  carName: string;
  reasons: string[];
  score: number;
}

export interface ExplanationProvider {
  explain(input: ExplainInput): Promise<string>;
}

export class FallbackExplanationProvider implements ExplanationProvider {
  async explain(input: ExplainInput): Promise<string> {
    const reasonText = input.reasons.join(", ");
    return `${input.carName} is recommended with score ${input.score}. Key reasons: ${reasonText}.`;
  }
}

// Placeholder interface for future LLM integration.
export class AiExplanationService {
  constructor(private readonly provider: ExplanationProvider = new FallbackExplanationProvider()) {}

  async generateExplanation(carName: string, reasons: string[], score: number): Promise<string> {
    return this.provider.explain({ carName, reasons, score });
  }
}
