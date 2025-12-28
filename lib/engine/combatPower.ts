// mbl/lib/engine/combatPower.ts
import type { StatKey } from "@/lib/constants/stats";

export type TotalStats = Record<StatKey, number>;

export type CombatPower = {
  attackPower: number; // 총합 공격력(WATT)
  magicPower: number;  // 총합 마력(MATT)
};

/**
 * v1: 무기종류/공식 없이 "표기용 전투력"만 제공
 * - 공격력 = WATT
 * - 마력   = MATT
 *
 * v2+: 무기종류/직업/스킬을 받는 "데미지 범위" 계산으로 확장 가능
 */
export function deriveCombatPower(total: TotalStats): CombatPower {
  return {
    attackPower: total.WATT ?? 0,
    magicPower: total.MATT ?? 0,
  };
}
