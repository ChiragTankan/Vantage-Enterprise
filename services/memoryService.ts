
class MemoryService {
  private STRATEGY_KEY = 'vantage_business_strategy';

  saveStrategy(strategy: string) {
    localStorage.setItem(this.STRATEGY_KEY, strategy);
  }

  getStrategy(): string {
    return localStorage.getItem(this.STRATEGY_KEY) || "Standard Market Growth (Default)";
  }

  chunkText(text: string, size: number = 800): string[] {
    const chunks = [];
    for (let i = 0; i < text.length; i += size) {
      chunks.push(text.slice(i, i + size));
    }
    return chunks;
  }

  async retrieveRelevantContext(query: string, text: string): Promise<string> {
    const chunks = this.chunkText(text);
    const keywords = query.toLowerCase().split(' ').filter(k => k.length > 3);
    
    const scored = chunks.map(chunk => {
      let score = 0;
      keywords.forEach(kw => {
        if (chunk.toLowerCase().includes(kw)) score += 1;
      });
      return { chunk, score };
    });

    // Sort by relevance and take top 4 chunks
    const relevant = scored
      .sort((a, b) => b.score - a.score)
      .filter(s => s.score > 0 || chunks.length < 3)
      .slice(0, 4)
      .map(s => s.chunk);

    return relevant.length > 0 ? relevant.join('\n\n[SEGMENT]\n') : text.slice(0, 3000);
  }
}

export const memoryService = new MemoryService();
