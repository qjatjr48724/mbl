import type { WeaponKey } from "@/lib/constants/weapons";
import type { JobKo } from "@/lib/types";

// 4대 계열 기본 허용 무기(상세 직업을 모를 때 fallback)
export const ALLOWED_WEAPONS_BY_GROUP: Record<JobKo, WeaponKey[]> = {
  전사: [
    "oneHandSword",
    "twoHandSword",
    "oneHandAxe",
    "twoHandAxe",
    "oneHandMace",
    "twoHandMace",
    "spear",
    "polearm",
  ],
  마법사: ["wand", "staff"],
  궁수: ["bow", "crossbow"],
  도적: ["dagger", "claw"],
};

// 상세 직업(표시명) 기준으로 더 좁히기
// ※ jobDetail은 BuildState에 “label(한국어)”로 저장하는 걸 전제로 함(너 지금 그렇게 쓰고 있음)
export const ALLOWED_WEAPONS_BY_DETAIL_LABEL: Record<string, WeaponKey[]> = {
  // 전사 1차
  "파이터": ["oneHandSword", "twoHandSword", "oneHandAxe", "twoHandAxe"],
  "페이지": ["oneHandSword", "twoHandSword", "oneHandMace", "twoHandMace"],
  "스피어맨": ["spear", "polearm"],

  // 전사 2/3차(동일 분기 유지)
  "크루세이더": ["oneHandSword", "twoHandSword", "oneHandAxe", "twoHandAxe"],
  "히어로": ["oneHandSword", "twoHandSword", "oneHandAxe", "twoHandAxe"],
  "나이트": ["oneHandSword", "twoHandSword", "oneHandMace", "twoHandMace"],
  "팔라딘": ["oneHandSword", "twoHandSword", "oneHandMace", "twoHandMace"],
  "드래곤나이트": ["spear", "polearm"],
  "다크나이트": ["spear", "polearm"],

  // 마법사
  "위자드(불/독)": ["wand", "staff"],
  "메이지(불/독)": ["wand", "staff"],
  "아크메이지(불/독)": ["wand", "staff"],
  "위자드(썬/콜)": ["wand", "staff"],
  "메이지(썬/콜)": ["wand", "staff"],
  "아크메이지(썬/콜)": ["wand", "staff"],
  "클레릭": ["wand", "staff"],
  "프리스트": ["wand", "staff"],
  "비숍": ["wand", "staff"],

  // 궁수
  "헌터": ["bow"],
  "레인저": ["bow"],
  "보우마스터": ["bow"],
  "사수": ["crossbow"],
  "저격수": ["crossbow"],
  "신궁": ["crossbow"],

  // 도적
  "어쌔신": ["claw"],
  "허밋": ["claw"],
  "나이트로드": ["claw"],
  "시프": ["dagger"],
  "시프마스터": ["dagger"],
  "섀도어": ["dagger"],
};

export function getAllowedWeapons(job: JobKo, jobDetail?: string | null): WeaponKey[] {
  if (jobDetail && ALLOWED_WEAPONS_BY_DETAIL_LABEL[jobDetail]) {
    return ALLOWED_WEAPONS_BY_DETAIL_LABEL[jobDetail];
  }
  return ALLOWED_WEAPONS_BY_GROUP[job];
}
