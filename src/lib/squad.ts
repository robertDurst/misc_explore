// Helpers for the plantilla page. Content + schema live in src/content/.

export function ageFromDob(dob: string, asOf: Date = new Date()): number {
  const b = new Date(dob);
  let age = asOf.getUTCFullYear() - b.getUTCFullYear();
  const m = asOf.getUTCMonth() - b.getUTCMonth();
  if (m < 0 || (m === 0 && asOf.getUTCDate() < b.getUTCDate())) age--;
  return age;
}

export function transferLine(p: {
  joinedFrom?: string;
  joinedYear?: number;
  contractEnd?: number;
}): string | null {
  const parts: string[] = [];
  if (p.joinedFrom && p.joinedYear) {
    parts.push(`Desde ${p.joinedFrom} (${p.joinedYear})`);
  } else if (p.joinedFrom) {
    parts.push(`Desde ${p.joinedFrom}`);
  } else if (p.joinedYear) {
    parts.push(`Desde ${p.joinedYear}`);
  }
  if (p.contractEnd) parts.push(`hasta ${p.contractEnd}`);
  return parts.length > 0 ? parts.join(" · ") : null;
}
