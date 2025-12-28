// mbl/components/CombatPowerCard.tsx
"use client";

import React from "react";
import type { CombatPower } from "@/lib/engine/combatPower";

export default function CombatPowerCard({
  value,
  title = "전투력(표기용)",
}: {
  value: CombatPower;
  title?: string;
}) {
  return (
    <section className="rounded-2xl border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xs text-gray-500">v1</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex justify-between rounded-xl bg-gray-50 px-3 py-2">
          <span className="text-gray-600">공격력</span>
          <span className="font-medium">{value.attackPower}</span>
        </div>
        <div className="flex justify-between rounded-xl bg-gray-50 px-3 py-2">
          <span className="text-gray-600">마력</span>
          <span className="font-medium">{value.magicPower}</span>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        * v1에서는 무기 종류/공식 없이 총합 WATT/MATT를 그대로 표기합니다.
      </p>
    </section>
  );
}
