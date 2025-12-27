"use client";

import React from "react";
import BuildPanel, { calcTotal } from "@/components/BuildPanel";
import type { BuildState } from "@/lib/types";
import { STAT_KEYS, type StatKey } from "@/lib/constants/stats";

const STAT_LABEL_KO: Record<StatKey, string> = {
  STR: "STR",
  DEX: "DEX",
  INT: "INT",
  LUK: "LUK",
  HP: "HP",
  MP: "MP",
  WATT: "공격력",
  MATT: "마력",
  ACC: "명중",
  AVOID: "회피",
  SPEED: "이속",
  JUMP: "점프",
  WDEF: "물방",
  MDEF: "마방",
};

function makeEmpty(): BuildState {
  return {
    job: "마법사",
    level: 1,
    baseStats: { STR: 0, DEX: 0, INT: 0, LUK: 0, HP: null, MP: null },
    equipped: {},
  };
}

export default function Page() {
  const [a, setA] = React.useState<BuildState>(makeEmpty());
  const [b, setB] = React.useState<BuildState>(makeEmpty());

  const totalA = React.useMemo(() => calcTotal(a), [a]);
  const totalB = React.useMemo(() => calcTotal(b), [b]);

  const delta = React.useMemo(() => {
    const out: Record<StatKey, number> = { ...totalB };
    for (const k of STAT_KEYS) out[k] = (totalB[k] ?? 0) - (totalA[k] ?? 0);
    return out;
  }, [totalA, totalB]);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">MBL /compare (세팅 A/B 비교)</h1>

      <section className="rounded-2xl border p-4 space-y-3">
        <h2 className="font-semibold">총합 스탯 비교 (B - A)</h2>
        <div className="grid gap-2 md:grid-cols-3">
          {STAT_KEYS.map((k) => {
            const d = delta[k] ?? 0;
            if (d === 0) return null;
            const sign = d > 0 ? "+" : "";
            return (
              <div key={k} className="flex justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm">
                <span className="text-gray-600">{STAT_LABEL_KO[k]}</span>
                <span className="font-medium">
                  {sign}
                  {d}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500">* A 대비 B의 변화량입니다.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <BuildPanel title="세팅 A" state={a} setState={setA} />
        <BuildPanel title="세팅 B" state={b} setState={setB} />
      </section>
    </main>
  );
}
