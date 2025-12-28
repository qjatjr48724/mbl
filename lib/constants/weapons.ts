export type WeaponKey =
  | "oneHandSword"
  | "twoHandSword"
  | "oneHandAxe"
  | "twoHandAxe"
  | "oneHandMace"
  | "twoHandMace"
  | "spear"
  | "polearm"
  | "claw"
  | "dagger"
  | "bow"
  | "crossbow"
  | "staff"
  | "wand";

export const WEAPON_KEYS: WeaponKey[] = [
  "oneHandSword",
  "twoHandSword",
  "oneHandAxe",
  "twoHandAxe",
  "oneHandMace",
  "twoHandMace",
  "spear",
  "polearm",
  "claw",
  "dagger",
  "bow",
  "crossbow",
  "staff",
  "wand",
];

export const WEAPON_LABEL_KO: Record<WeaponKey, string> = {
  oneHandSword: "한손검",
  twoHandSword: "두손검",
  oneHandAxe: "한손도끼",
  twoHandAxe: "두손도끼",
  oneHandMace: "한손둔기",
  twoHandMace: "두손둔기",
  spear: "창",
  polearm: "폴암",
  claw: "아대",
  dagger: "단검",
  bow: "활",
  crossbow: "석궁",
  staff: "스태프",
  wand: "완드",
};

type WeaponConstSingle = { kind: "single"; c: number };
type WeaponConstDual = {
  kind: "dual";
  aLabel: string; // 예: "베기(스윙)"
  a: number;
  bLabel: string; // 예: "찌르기(스탭)"
  b: number;
};

export type WeaponConst = WeaponConstSingle | WeaponConstDual;

/**
 * 고전(Pre-BB) 계열에서 널리 사용되는 무기상수/데미지 공식 기반.
 * - 한손도끼/둔기: 베기 4.4, 찌르기 3.2
 * - 두손도끼/둔기: 베기 4.8, 찌르기 3.4
 * - 창: 베기 3.0, 찌르기 5.0 (창은 찌르기가 더 큼)
 * - 폴암: 베기 5.0, 찌르기 3.0 (폴암은 베기가 더 큼)
 * - 도적 단검/아대: 3.6 (부스탯 STR+DEX)
 * - 활 3.4 / 석궁 3.6 / 한손검 4.0 / 두손검 4.6
 */
export const WEAPON_CONST: Record<WeaponKey, WeaponConst> = {
  oneHandSword: { kind: "single", c: 4.0 },
  twoHandSword: { kind: "single", c: 4.6 },

  oneHandAxe: { kind: "dual", aLabel: "베기(스윙)", a: 4.4, bLabel: "찌르기(스탭)", b: 3.2 },
  oneHandMace:{ kind: "dual", aLabel: "베기(스윙)", a: 4.4, bLabel: "찌르기(스탭)", b: 3.2 },

  twoHandAxe: { kind: "dual", aLabel: "베기(스윙)", a: 4.8, bLabel: "찌르기(스탭)", b: 3.4 },
  twoHandMace:{ kind: "dual", aLabel: "베기(스윙)", a: 4.8, bLabel: "찌르기(스탭)", b: 3.4 },

  spear:   { kind: "dual", aLabel: "베기(스윙)", a: 3.0, bLabel: "찌르기(스탭)", b: 5.0 },
  polearm: { kind: "dual", aLabel: "베기(스윙)", a: 5.0, bLabel: "찌르기(스탭)", b: 3.0 },

  claw:   { kind: "single", c: 3.6 },
  dagger: { kind: "single", c: 3.6 },

  bow:      { kind: "single", c: 3.4 },
  crossbow: { kind: "single", c: 3.6 },

  // 물리로 휘두르는 값은 의미가 약하지만(법사는 마법공식 사용),
  // 상수는 자료에 같이 언급되는 케이스가 많아 포함해 둠.
  staff: { kind: "dual", aLabel: "베기(스윙)", a: 4.4, bLabel: "찌르기(스탭)", b: 3.2 },
  wand:  { kind: "dual", aLabel: "베기(스윙)", a: 4.4, bLabel: "찌르기(스탭)", b: 3.2 },
};
