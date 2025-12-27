"use client";

import React from "react";
import Link from "next/link";
import BuildPanel from "@/components/BuildPanel";
import type { BuildState } from "@/lib/types";
import { loadBuildA, loadBuildB, saveBuildA, saveBuildB } from "@/lib/storage";

export default function Page() {
  const [state, setState] = React.useState<BuildState>({
    job: "마법사",
    level: 1,
    baseStats: { STR: 0, DEX: 0, INT: 0, LUK: 0, HP: null, MP: null },
    equipped: {},
  });

  const [toast, setToast] = React.useState<string | null>(null);

  function show(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1400);
  }

  function handleSave(target: "A" | "B") {
    if (target === "A") saveBuildA(state);
    else saveBuildB(state);
    show(`${target} 세팅으로 저장했어`);
  }

  function handleLoad(target: "A" | "B") {
    const loaded = target === "A" ? loadBuildA() : loadBuildB();
    if (!loaded) {
      show(`${target}로 저장된 세팅이 없어`);
      return;
    }
    setState(loaded.build);
    show(`${target} 세팅을 불러왔어`);
  }

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">MBL /build</h1>

        <div className="flex items-center gap-2">
          {/* 불러오기 선택 */}
          <select
            className="rounded-xl border px-3 py-2 text-sm"
            defaultValue=""
            onChange={(e) => {
              const v = e.target.value as "A" | "B" | "";
              if (!v) return;
              handleLoad(v);
              e.currentTarget.value = "";
            }}
          >
            <option value="" disabled>
              저장된 세팅 불러오기…
            </option>
            <option value="A">A 불러오기</option>
            <option value="B">B 불러오기</option>
          </select>

          {/* 저장 선택 */}
          <select
            className="rounded-xl border px-3 py-2 text-sm"
            defaultValue=""
            onChange={(e) => {
              const v = e.target.value as "A" | "B" | "";
              if (!v) return;
              handleSave(v);
              e.currentTarget.value = "";
            }}
          >
            <option value="" disabled>
              현재 세팅 저장하기…
            </option>
            <option value="A">A로 저장</option>
            <option value="B">B로 저장</option>
          </select>

          {/* compare 이동 */}
          <Link className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50" href="/compare">
            compare로 이동
          </Link>
        </div>
      </div>

      {toast ? <div className="text-sm text-gray-600">{toast}</div> : null}

      <BuildPanel title="세팅" state={state} setState={setState} />
    </main>
  );
}
