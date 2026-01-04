"use client";

import React from "react";
import type { StatKey } from "@/lib/constants/stats";
import type { DerivedStats, TotalStats } from "@/lib/engine/derivedStats";

type StatNum = Record<StatKey, number>;

const L: Record<string, string> = {
  name: "이름",
  job: "직업",
  level: "레벨",
  hp: "HP",
  mp: "MP",
};

function fmtPlus(n: number) {
  if (n === 0) return "";
  return n > 0 ? `(+${n})` : `(${n})`;
}

export default function CharacterStatWindow({
  name = "캐릭터",
  jobLabel,
  level,
  base,   // 순스탯(정수화된 것)
  equip,  // 장비스탯(정수화된 것)
  total,  // 총합(정수)
  derived,
}: {
  name?: string;
  jobLabel: string;
  level: number;
  base: StatNum;
  equip: StatNum;
  total: TotalStats;
  derived: DerivedStats;
}) {
  const str = total.STR ?? 0;
  const dex = total.DEX ?? 0;
  const int = total.INT ?? 0;
  const luk = total.LUK ?? 0;

  const hp = total.HP ?? 0;
  const mp = total.MP ?? 0;

  const wdef = total.WDEF ?? 0;
  const mdef = total.MDEF ?? 0;

  const matt = total.MATT ?? 0;

  const equipMatt = equip.MATT ?? 0;
  const pureMatt = matt - equipMatt; // MVP: 아이템 제외 마력

  const speedPct = 100 + (total.SPEED ?? 0);
  const jumpPct = 100 + (total.JUMP ?? 0);

  const attackText = derived.physical
    ? `${derived.physical.min} ~ ${derived.physical.max}`
    : "-";

  return (
    <div className="rounded-2xl border bg-white p-3">
      <div className="text-sm font-semibold mb-2">CHARACTER STAT</div>

      <div className="grid gap-3 md:grid-cols-2">
        {/* 왼쪽 패널 */}
        <div className="rounded-xl border bg-gray-50 p-3 space-y-2">
          <div className="grid grid-cols-[70px_1fr] gap-y-1 text-sm">
            <div className="text-gray-600">{L.name}</div><div className="font-medium">{name}</div>
            <div className="text-gray-600">{L.job}</div><div className="font-medium">{jobLabel}</div>
            <div className="text-gray-600">{L.level}</div><div className="font-medium">{level}</div>
          </div>

          <div className="grid grid-cols-[70px_1fr] gap-y-1 text-sm pt-2 border-t">
            <div className="text-gray-600">{L.hp}</div><div className="font-medium">{hp}</div>
            <div className="text-gray-600">{L.mp}</div><div className="font-medium">{mp}</div>
          </div>

          <div className="pt-2 border-t space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">STR</span>
              <span className="font-medium">
                {str} <span className="text-gray-500">{fmtPlus(equip.STR ?? 0)}</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">DEX</span>
              <span className="font-medium">
                {dex} <span className="text-gray-500">{fmtPlus(equip.DEX ?? 0)}</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">INT</span>
              <span className="font-medium">
                {int} <span className="text-gray-500">{fmtPlus(equip.INT ?? 0)}</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">LUK</span>
              <span className="font-medium">
                {luk} <span className="text-gray-500">{fmtPlus(equip.LUK ?? 0)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* 오른쪽 패널 */}
        <div className="rounded-xl border bg-gray-50 p-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">공격력</span>
            <span className="font-medium">{attackText}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">물리방어력</span>
            <span className="font-medium">{wdef}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">마력</span>
            <span className="font-medium">{matt}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">마법방어력</span>
            <span className="font-medium">{mdef}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">명중</span>
            <span className="font-medium">{derived.accuracy}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">회피</span>
            <span className="font-medium">{derived.avoidability}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">순마력</span>
            <span className="font-medium">{pureMatt}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">이동속도</span>
            <span className="font-medium">{speedPct}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">점프력</span>
            <span className="font-medium">{jumpPct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
