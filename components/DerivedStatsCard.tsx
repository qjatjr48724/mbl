"use client";

import React from "react";
import type { DerivedStats } from "@/lib/engine/derivedStats";
import { WEAPON_LABEL_KO, type WeaponKey } from "@/lib/constants/weapons";
import type { JobKo } from "@/lib/types";

export default function DerivedStatsCard({
  job,
  weaponType,
  physMastery,
  spellMastery,
  spellAttack,
  value,
}: {
  job: JobKo;
  weaponType: WeaponKey | null;
  physMastery: number;
  spellMastery: number;
  spellAttack: number;
  value: DerivedStats;
}) {
  return (
    <section className="rounded-2xl border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">파생/공마 계산(무기상수 반영)</h3>
        <span className="text-xs text-gray-500">v1.6</span>
      </div>

      <div className="grid gap-2 md:grid-cols-2 text-sm">
        <div className="flex justify-between rounded-xl bg-gray-50 px-3 py-2">
          <span className="text-gray-600">명중(계산)</span>
          <span className="font-medium">{value.accuracy}</span>
        </div>
        <div className="flex justify-between rounded-xl bg-gray-50 px-3 py-2">
          <span className="text-gray-600">회피(계산)</span>
          <span className="font-medium">{value.avoidability}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-gray-50 p-3 space-y-2">
        <div className="text-sm font-medium">물리 데미지 범위(스텟공격력)</div>
        <div className="text-xs text-gray-600">
          무기: {weaponType ? WEAPON_LABEL_KO[weaponType] : "(선택 안 함)"} · 숙련도: {physMastery}
        </div>

        {value.physical ? (
          <>
            <div className="text-sm">
              전체 범위: <span className="font-semibold">{value.physical.min}</span> ~{" "}
              <span className="font-semibold">{value.physical.max}</span>
            </div>

            {value.physical.detail?.length ? (
              <div className="space-y-1 text-xs text-gray-700">
                {value.physical.detail.map((d) => (
                  <div key={d.label} className="flex justify-between">
                    <span>{d.label}</span>
                    <span>
                      {d.min} ~ {d.max}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-xs text-gray-600">무기를 선택하면 계산됩니다.</div>
        )}
      </div>

      <div className="rounded-2xl bg-gray-50 p-3 space-y-2">
        <div className="text-sm font-medium">마법 데미지 범위</div>
        <div className="text-xs text-gray-600">
          마법숙련도: {spellMastery} · 스킬공격력: {spellAttack}
        </div>
        {value.magic ? (
          <div className="text-sm">
            {value.magic.min} ~ {value.magic.max}
          </div>
        ) : (
          <div className="text-xs text-gray-600">마력/INT가 있으면 계산됩니다.</div>
        )}
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <div>* 물리 MAX/MIN은 무기상수·숙련도를 반영한 고전식 데미지 공식 기반입니다.</div>
        <div>* 마법 데미지는 마력/INT 기반 고전식 공식(숙련도·스킬공격력 반영) 기준입니다.</div>
        </div>

    </section>
  );
}
