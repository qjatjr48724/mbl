import type { SlotKey } from "./constants/slots";
import type { WeaponKey } from "@/lib/constants/weapons";
import type { StatKey, Stats } from "./constants/stats";

export type JobKo = "전사" | "마법사" | "궁수" | "도적";

export type ItemMaster = {
  id: string;
  name: string;
  slot: SlotKey;
  requiredLevel: number;
  jobRestrictions: Array<JobKo | "ALL">;
  statTemplate: StatKey[];
  defaultStats?: Partial<Record<StatKey, number>>;
  weaponType?: WeaponKey; // ✅ 무기(slot="weapon")일 때만 사용
  
};

export type EquippedItem = {
  slot: SlotKey;
  itemId: string;
  itemName: string;
  customStats: Stats; // number | null
  weaponType?: WeaponKey | null; // ✅ 무기일 때만 채움

};


export type BuildState = {
  job: JobKo;
  jobDetail?: string | null;
  level: number;
  baseStats: Stats;
  equipped: Partial<Record<SlotKey, EquippedItem>>;
  skills?: Record<string, number>; // 스킬ID -> 레벨

  // ✅ 기본값을 UI에서 설정(없으면 아래 엔진에서 fallback)
  physMastery?: number | null;   // 0~1, 예: 0.6
  spellMastery?: number | null;  // 0~1, 예: 0.6
  spellAttack?: number | null;   // 스킬공격력(기준값) 예: 100
};


