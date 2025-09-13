import { Macro, SearchResult } from "@lib/storage/types";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "");
}

export function searchMacros(macros: Macro[], query: string): SearchResult[] {
  const q = normalize(query.trim());
  if (!q) return [];
  return macros
    .map((m) => {
      const t = normalize(m.title);
      const c = normalize(m.content);
      let score = 0;
      let matchedIn: SearchResult["matchedIn"] = "content";
      if (t.includes(q)) {
        score += 5;
        matchedIn = "title";
      }
      const tCount = countOccurrences(t, q);
      const cCount = countOccurrences(c, q);
      score += tCount * 3 + cCount * 1;
      if (tCount > 0 && cCount > 0) matchedIn = "both";
      return { macro: m, score, matchedIn };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

function countOccurrences(text: string, q: string): number {
  if (!q) return 0;
  let idx = 0;
  let count = 0;
  while ((idx = text.indexOf(q, idx)) !== -1) {
    count++;
    idx += q.length;
  }
  return count;
}