// mbl/lib/types.ts
import type { SlotKey } from "./constants/slots";
import type { StatKey, Stats } from "./constants/stats";

export type JobKo = "전사" | "마법사" | "궁수" | "도적" | "ALL";

export type ItemMaster = {
  id: string;
  name: string;
  slot: SlotKey;
  requiredLevel: number;
  jobRestrictions: JobKo[];          // ["ALL"] 또는 ["마법사"] 같은 형태
  statTemplate: StatKey[];           // 모달에 보여줄 스탯 목록
  defaultStats?: Partial<Record<StatKey, number>>; // 있으면 정옵션
};

export type EquippedItem = {
  slot: SlotKey;
  itemId: string;
  itemName: string;
  customStats: Stats; // number | null (defaultStats 없으면 null로 시작)
};

export type BuildState = {
  job: JobKo;
  level: number;
  baseStats: Stats;
  equipped: Partial<Record<SlotKey, EquippedItem>>;
};
