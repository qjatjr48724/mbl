// mbl/lib/items.ts
import type { ItemMaster } from "@/lib/types";
import type { WeaponKey } from "@/lib/constants/weapons";
import type { StatKey } from "@/lib/constants/stats";

// ItemMaster에 weaponType이 아직 없을 수 있어서 안전하게 확장 타입을 씁니다.
// (나중에 lib/types.ts의 ItemMaster에 weaponType을 추가하면 이 확장 타입은 그대로 둬도 OK)
export type ItemMasterWithWeapon = ItemMaster & {
  weaponType?: WeaponKey; // slot이 weapon일 때만 사용
};

function item(
  v: ItemMasterWithWeapon & {
    id: string;
    name: string;
    slot: any;
    requiredLevel: number;
    jobRestrictions: any;
    statTemplate: StatKey[];
    defaultStats?: Partial<Record<StatKey, number>>;
  }
): ItemMasterWithWeapon {
  return v;
}

/**
 * ⚠️ 지금은 MVP용 샘플 데이터입니다.
 * 나중에 크롤링/DB로 확장할 때도 "무기(weapon)는 weaponType만 정확히 매핑"하면
 * 무기상수는 자동 적용됩니다.
 */
export const ITEMS: ItemMasterWithWeapon[] = [
  // ─────────────────────────────────────────
  // 무기(weapon) 샘플: weaponType을 꼭 넣기
  // ─────────────────────────────────────────
  item({
    id: "wp_1h_sword_001",
    name: "훈련용 한손검",
    slot: "weapon",
    weaponType: "oneHandSword",
    requiredLevel: 10,
    jobRestrictions: ["전사"],
    statTemplate: ["WATT"],
    defaultStats: { WATT: 20 },
  }),
  item({
    id: "wp_2h_sword_001",
    name: "훈련용 두손검",
    slot: "weapon",
    weaponType: "twoHandSword",
    requiredLevel: 10,
    jobRestrictions: ["전사"],
    statTemplate: ["WATT"],
    defaultStats: { WATT: 22 },
  }),
  item({
    id: "wp_1h_axe_001",
    name: "훈련용 한손도끼",
    slot: "weapon",
    weaponType: "oneHandAxe",
    requiredLevel: 15,
    jobRestrictions: ["전사"],
    statTemplate: ["WATT"],
    defaultStats: { WATT: 24 },
  }),
  item({
    id: "wp_2h_axe_001",
    name: "훈련용 두손도끼",
    slot: "weapon",
    weaponType: "twoHandAxe",
    requiredLevel: 15,
    jobRestrictions: ["전사"],
    statTemplate: ["WATT"],
    defaultStats: { WATT: 26 },
  }),
  item({
    id: "wp_1h_mace_001",
    name: "훈련용 한손둔기",
    slot: "weapon",
    weaponType: "oneHandMace",
    requiredLevel: 20,
    jobRestrictions: ["전사"],
    statTemplate: ["WATT"],
    defaultStats: { WATT: 28 },
  }),
  item({
    id: "wp_2h_mace_001",
    name: "훈련용 두손둔기",
    slot: "weapon",
    weaponType: "twoHandMace",
    requiredLevel: 20,
    jobRestrictions: ["전사"],
    statTemplate: ["WATT"],
    defaultStats: { WATT: 30 },
  }),
  item({
    id: "wp_spear_001",
    name: "훈련용 창",
    slot: "weapon",
    weaponType: "spear",
    requiredLevel: 25,
    jobRestrictions: ["전사"],
    statTemplate: ["WATT"],
    defaultStats: { WATT: 33 },
  }),
  item({
    id: "wp_polearm_001",
    name: "훈련용 폴암",
    slot: "weapon",
    weaponType: "polearm",
    requiredLevel: 25,
    jobRestrictions: ["전사"],
    statTemplate: ["WATT"],
    defaultStats: { WATT: 33 },
  }),
  item({
    id: "wp_dagger_001",
    name: "훈련용 단검",
    slot: "weapon",
    weaponType: "dagger",
    requiredLevel: 10,
    jobRestrictions: ["도적"],
    statTemplate: ["WATT", "LUK"],
    defaultStats: { WATT: 18, LUK: 1 },
  }),
  item({
    id: "wp_claw_001",
    name: "훈련용 아대",
    slot: "weapon",
    weaponType: "claw",
    requiredLevel: 10,
    jobRestrictions: ["도적"],
    statTemplate: ["WATT", "LUK"],
    defaultStats: { WATT: 18, LUK: 1 },
  }),
  item({
    id: "wp_bow_001",
    name: "훈련용 활",
    slot: "weapon",
    weaponType: "bow",
    requiredLevel: 10,
    jobRestrictions: ["궁수"],
    statTemplate: ["WATT", "DEX"],
    defaultStats: { WATT: 19, DEX: 1 },
  }),
  item({
    id: "wp_crossbow_001",
    name: "훈련용 석궁",
    slot: "weapon",
    weaponType: "crossbow",
    requiredLevel: 10,
    jobRestrictions: ["궁수"],
    statTemplate: ["WATT", "DEX"],
    defaultStats: { WATT: 20, DEX: 1 },
  }),
  item({
    id: "wp_wand_001",
    name: "초보자용 완드",
    slot: "weapon",
    weaponType: "wand",
    requiredLevel: 8,
    jobRestrictions: ["마법사"],
    statTemplate: ["MATT", "INT"],
    defaultStats: { MATT: 18, INT: 1 },
  }),
  item({
    id: "wp_staff_001",
    name: "초보자용 스태프",
    slot: "weapon",
    weaponType: "staff",
    requiredLevel: 8,
    jobRestrictions: ["마법사"],
    statTemplate: ["MATT", "INT"],
    defaultStats: { MATT: 20, INT: 1 },
  }),

  // ─────────────────────────────────────────
  // 방패(shield) / 보조장비(전사 등)
  // ─────────────────────────────────────────
  item({
    id: "sh_001",
    name: "나무 방패",
    slot: "shield",
    requiredLevel: 10,
    jobRestrictions: ["전사"],
    statTemplate: ["WDEF", "ACC"],
    defaultStats: { WDEF: 12, ACC: 1 },
  }),

  // ─────────────────────────────────────────
  // 모자(cap)
  // ─────────────────────────────────────────
  item({
    id: "cap_001",
    name: "초보자 모자",
    slot: "cap",
    requiredLevel: 1,
    jobRestrictions: ["ALL"],
    statTemplate: ["STR", "DEX", "INT", "LUK"],
    // defaultStats 없음 → 모달은 빈칸(null) 시작 (요구사항 반영)
  }),

  // ─────────────────────────────────────────
  // 눈장식(eye_acc) / 귀장식(earAcc) / 얼굴장식(forehead)
  // ─────────────────────────────────────────
  item({
    id: "eye_001",
    name: "검은색 눈장식",
    slot: "eye_acc",
    requiredLevel: 15,
    jobRestrictions: ["ALL"],
    statTemplate: ["ACC"],
    defaultStats: { ACC: 2 },
  }),
  item({
    id: "ear_001",
    name: "은 귀고리",
    slot: "ear_acc",
    requiredLevel: 20,
    jobRestrictions: ["ALL"],
    statTemplate: ["INT", "MDEF"],
    defaultStats: { INT: 1, MDEF: 5 },
  }),
  item({
    id: "fh_001",
    name: "얼굴 장식(기본)",
    slot: "forehead",
    requiredLevel: 10,
    jobRestrictions: ["ALL"],
    statTemplate: ["AVOID"],
    defaultStats: { AVOID: 1 },
  }),

  // ─────────────────────────────────────────
  // 반지(ring1~4는 UI에서 슬롯에 따라 장착되지만 아이템 slot은 ring1로 통일해도 됨)
  // ─────────────────────────────────────────
  item({
    id: "ring_001",
    name: "실버 링",
    slot: "ring1",
    requiredLevel: 20,
    jobRestrictions: ["ALL"],
    statTemplate: ["STR", "DEX", "INT", "LUK"],
    defaultStats: { STR: 1, DEX: 1, INT: 1, LUK: 1 },
  }),

  // ─────────────────────────────────────────
  // 펜던트(pendant) — 슬롯은 1개만 쓰는 정책(요구사항)
  // ─────────────────────────────────────────
  item({
    id: "pendant_001",
    name: "행운의 펜던트",
    slot: "pendant",
    requiredLevel: 30,
    jobRestrictions: ["ALL"],
    statTemplate: ["LUK", "AVOID"],
    defaultStats: { LUK: 2, AVOID: 1 },
  }),

  // ─────────────────────────────────────────
  // 상의/하의(clothes/pants)
  // ─────────────────────────────────────────
  item({
    id: "clothes_001",
    name: "초보자 상의",
    slot: "clothes",
    requiredLevel: 1,
    jobRestrictions: ["ALL"],
    statTemplate: ["WDEF", "MDEF"],
    defaultStats: { WDEF: 5, MDEF: 3 },
  }),
  item({
    id: "pants_001",
    name: "초보자 하의",
    slot: "pants",
    requiredLevel: 1,
    jobRestrictions: ["ALL"],
    statTemplate: ["WDEF", "MDEF"],
    defaultStats: { WDEF: 5, MDEF: 3 },
  }),

  // ─────────────────────────────────────────
  // 망토/장갑/벨트/신발(mantle/gloves/belt/shoes)
  // ─────────────────────────────────────────
  item({
    id: "mantle_001",
    name: "작은 망토",
    slot: "mantle",
    requiredLevel: 10,
    jobRestrictions: ["ALL"],
    statTemplate: ["AVOID", "SPEED"],
    defaultStats: { AVOID: 1, SPEED: 1 },
  }),
  item({
    id: "gloves_001",
    name: "가죽 장갑",
    slot: "gloves",
    requiredLevel: 10,
    jobRestrictions: ["ALL"],
    statTemplate: ["ACC"],
    defaultStats: { ACC: 1 },
  }),
  item({
    id: "belt_001",
    name: "얇은 벨트",
    slot: "belt",
    requiredLevel: 15,
    jobRestrictions: ["ALL"],
    statTemplate: ["WDEF"],
    defaultStats: { WDEF: 2 },
  }),
  item({
    id: "shoes_001",
    name: "가벼운 신발",
    slot: "shoes",
    requiredLevel: 10,
    jobRestrictions: ["ALL"],
    statTemplate: ["SPEED", "JUMP"],
    defaultStats: { SPEED: 1, JUMP: 1 },
  }),

  // ─────────────────────────────────────────
  // 훈장(medal) / 펫장신구(petAcc)
  // ─────────────────────────────────────────
  item({
    id: "medal_001",
    name: "초보자의 훈장",
    slot: "medal",
    requiredLevel: 1,
    jobRestrictions: ["ALL"],
    statTemplate: ["STR", "DEX", "INT", "LUK", "WATT", "MATT"],
    defaultStats: { STR: 1, DEX: 1, INT: 1, LUK: 1, WATT: 1, MATT: 1 },
  }),
  item({
    id: "petacc_001",
    name: "펫 장신구(기본)",
    slot: "pet_acc",
    requiredLevel: 1,
    jobRestrictions: ["ALL"],
    statTemplate: ["HP", "MP"],
    // defaultStats 없음 → 빈칸 시작
  }),
];
