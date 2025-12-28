import type { JobKo } from "@/lib/types";
import type { StatKey } from "@/lib/constants/stats";
import type { WeaponKey } from "@/lib/constants/weapons";
import { WEAPON_CONST } from "@/lib/constants/weapons";

export type TotalStats = Record<StatKey, number>;

export type PhysRange = {
  min: number;
  max: number;
  detail?: {
    label: string;
    min: number;
    max: number;
  }[];
};

export type DerivedStats = {
  accuracy: number;
  avoidability: number;

  physical?: PhysRange; // 법사도 볼 수 있게 optional로 두지만, 기본 UI에서 숨겨도 됨
  magic?: { min: number; max: number };
};

function floor(n: number) {
  return Math.floor(n);
}

export function deriveAccuracy(total: TotalStats, job: JobKo) {
  const dex = total.DEX ?? 0;
  const luk = total.LUK ?? 0;
  const bonusAcc = total.ACC ?? 0;
  const [a, b] = job === "전사" || job === "마법사" ? [0.8, 0.5] : [0.6, 0.3];
  return floor(dex * a + luk * b + bonusAcc);
}

export function deriveAvoid(total: TotalStats) {
  const dex = total.DEX ?? 0;
  const luk = total.LUK ?? 0;
  const bonusAvoid = total.AVOID ?? 0;
  return floor(dex * 0.25 + luk * 0.5 + bonusAvoid);
}

function getMainSub(total: TotalStats, job: JobKo, weaponType: WeaponKey | null) {
  const str = total.STR ?? 0;
  const dex = total.DEX ?? 0;
  const luk = total.LUK ?? 0;

  // 무기별로 주/부스탯이 달라지는 케이스(도적 단검/아대)
  if (weaponType === "dagger" || weaponType === "claw") {
    // 도적 공식: Primary = LUK * 3.6, Secondary = STR + DEX
    return { main: luk, sub: str + dex, special: "thief" as const };
  }

  // 직업 기본
  if (job === "전사") return { main: str, sub: dex, special: "normal" as const };
  if (job === "궁수") return { main: dex, sub: str, special: "normal" as const };
  if (job === "도적") return { main: luk, sub: dex, special: "normal" as const };

  // 마법사는 물리 range를 굳이 안 쓰는 방향이니 main/sub는 0 처리
  return { main: 0, sub: 0, special: "normal" as const };
}

function calcPhysRangeWithConst(
  main: number,
  sub: number,
  weaponAttack: number,
  c: number,
  mastery: number
) {
  // AyumiLove/고전식: MAX = (main*c + sub)*WA/100
  // MIN = (main*c*0.9*mastery + sub)*WA/100
  const max = floor(((main * c + sub) * weaponAttack) / 100);
  const min = floor(((main * c * 0.9 * mastery + sub) * weaponAttack) / 100);
  return { min, max };
}

export function derivePhysicalRange(
  total: TotalStats,
  job: JobKo,
  weaponType: WeaponKey,
  mastery: number
): PhysRange {
  const watt = total.WATT ?? 0;
  const { main, sub } = getMainSub(total, job, weaponType);

  const wc = WEAPON_CONST[weaponType];
  if (wc.kind === "single") {
    const r = calcPhysRangeWithConst(main, sub, watt, wc.c, mastery);
    return { ...r };
  }

  // dual: 베기/찌르기 각각 계산해서 보여줌
  const a = calcPhysRangeWithConst(main, sub, watt, wc.a, mastery);
  const b = calcPhysRangeWithConst(main, sub, watt, wc.b, mastery);

  // 전체 min/max는 “둘 중 가능한 범위”로 잡되,
  // UI에서 detail로 각각을 보여주는 게 핵심
  return {
    min: Math.min(a.min, b.min),
    max: Math.max(a.max, b.max),
    detail: [
      { label: wc.aLabel, min: a.min, max: a.max },
      { label: wc.bLabel, min: b.min, max: b.max },
    ],
  };
}

export function deriveMagicRange(
  total: TotalStats,
  spellMastery: number,
  spellAttack: number
) {
  const matt = total.MATT ?? 0;
  const int = total.INT ?? 0;

  const maxBase = ((matt * matt) / 1000 + matt) / 30 + int / 200;
  const minBase = ((matt * matt) / 1000 + matt * spellMastery * 0.9) / 30 + int / 200;

  return {
    max: floor(maxBase * spellAttack),
    min: floor(minBase * spellAttack),
  };
}

export function deriveAll(params: {
  total: TotalStats;
  job: JobKo;
  weaponType?: WeaponKey | null;
  physMastery?: number | null;
  spellMastery?: number | null;
  spellAttack?: number | null;
}): DerivedStats {
  const { total, job } = params;

  const accuracy = deriveAccuracy(total, job);
  const avoidability = deriveAvoid(total);

  const physMastery = params.physMastery ?? 0.6;
  const spellMastery = params.spellMastery ?? 0.6;
  const spellAttack = params.spellAttack ?? 100;

  const out: DerivedStats = { accuracy, avoidability };

  if (params.weaponType) {
    out.physical = derivePhysicalRange(total, job, params.weaponType, physMastery);
  }

  // 마법 데미지는 직업이 마법사일 때 기본 노출하면 좋고,
  // 다른 직업도 “MATT가 있으면 참고값”으로 보여줘도 됨
  out.magic = deriveMagicRange(total, spellMastery, spellAttack);

  return out;
}
