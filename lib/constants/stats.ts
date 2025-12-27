// mbl/lib/constants/stats.ts
export const STAT_KEYS = [
    "STR",
    "DEX",
    "INT",
    "LUK",
    "HP",
    "MP",
    "WATT",   // 공격력
    "MATT",   // 마력
    "ACC",    // 명중
    "AVOID",  // 회피
    "SPEED",  // 이동속도
    "JUMP",   // 점프
    "WDEF",   // 물리방어
    "MDEF",   // 마법방어
  ] as const;
  
  export type StatKey = (typeof STAT_KEYS)[number];
  
  // 값이 없을 수 있으니 Partial로 둠 (defaultStats 없으면 null로 시작하는 정책 때문에)
  export type Stats = Partial<Record<StatKey, number | null>>;
  
  // 합산 시 null은 0으로 취급
  export function addStats(a: Stats, b: Stats): Stats {
    const out: Stats = { ...a };
    for (const k of STAT_KEYS) {
      const av = out[k] ?? 0;
      const bv = b[k] ?? 0;
      out[k] = (av ?? 0) + (bv ?? 0);
    }
    return out;
  }
  
  export function normalizeStats(s: Stats): Record<StatKey, number> {
    const out = {} as Record<StatKey, number>;
    for (const k of STAT_KEYS) out[k] = (s[k] ?? 0) as number;
    return out;
  }
  