import type { SlotKey } from "./constants/slots";
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
};

export type EquippedItem = {
  slot: SlotKey;
  itemId: string;
  itemName: string;
  customStats: Stats; // number | null
};

export type BuildState = {
  job: JobKo;
  jobDetail?: string | null; // ✅ 추가: 예) "클레릭", "프리스트", "비숍" ...
  level: number;
  baseStats: Stats;
  equipped: Partial<Record<SlotKey, EquippedItem>>;
};


