// mbl/lib/constants/slots.ts
export const SLOT_KEYS = [
    "cap",
    "medal",
    "forehead",
    "ring1",
    "ring2",
    "ring3",
    "ring4",
    "eye_acc",
    "ear_acc",
    "weapon",
    "shield",
    "pendant", // 1개 고정
    "clothes",
    "pants",
    "mantle",
    "gloves",
    "belt",
    "shoes",
    "pet_acc",
  ] as const;
  
  export type SlotKey = (typeof SLOT_KEYS)[number];
  
  export const SLOT_LABEL_KO: Record<SlotKey, string> = {
    cap: "모자",
    medal: "훈장",
    forehead: "얼굴장식",
    ring1: "반지 1",
    ring2: "반지 2",
    ring3: "반지 3",
    ring4: "반지 4",
    eye_acc: "눈장식",
    ear_acc: "귀장식",
    weapon: "무기",
    shield: "보조장비",
    pendant: "목걸이",
    clothes: "상의",
    pants: "하의",
    mantle: "망토",
    gloves: "장갑",
    belt: "벨트",
    shoes: "신발",
    pet_acc: "펫장신구",
  };
  