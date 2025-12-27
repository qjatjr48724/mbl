"use client";

import React from "react";
import BuildPanel from "@/components/BuildPanel";
import type { BuildState } from "@/lib/types";
import { saveBuildToStorage, loadBuildFromStorage } from "@/lib/storage";
import Link from "next/link";

export default function Page() {
  const [state, setState] = React.useState<BuildState>({
    job: "마법사",
    level: 1,
    baseStats: { STR: 0, DEX: 0, INT: 0, LUK: 0, HP: null, MP: null },
    equipped: {},
  });

  const [savedInfo, setSavedInfo] = React.useState<string | null>(null);

  function onSave() {
    saveBuildToStorage(state);
    setSavedInfo("저장 완료!");
    setTimeout(() => setSavedInfo(null), 1500);
  }

  function onLoad() {
    const loaded = loadBuildFromStorage();
    if (!loaded) {
      setSavedInfo("저장된 세팅이 없어요.");
      setTimeout(() => setSavedInfo(null), 1500);
      return;
    }
    setState(loaded.build);
    setSavedInfo("저장된 세팅 불러옴!");
    setTimeout(() => setSavedInfo(null), 1500);
  }

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">MBL /build</h1>

        <div className="flex items-center gap-2">
          <button className="rounded-xl border px-4 py-2" onClick={onLoad}>
            저장된 세팅 불러오기
          </button>
          <button className="rounded-xl bg-black px-4 py-2 text-white" onClick={onSave}>
            이 세팅 저장(A용)
          </button>
          <Link className="rounded-xl border px-4 py-2" href="/compare">
            compare로 이동
          </Link>
        </div>
      </div>

      {savedInfo ? <div className="text-sm text-gray-600">{savedInfo}</div> : null}

      <BuildPanel title="세팅" state={state} setState={setState} />
    </main>
  );
}
