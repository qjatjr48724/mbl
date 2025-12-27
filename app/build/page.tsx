"use client";

import React from "react";
import BuildPanel from "@/components/BuildPanel";
import type { BuildState } from "@/lib/types";

export default function Page() {
  const [state, setState] = React.useState<BuildState>({
    job: "마법사",
    level: 1,
    baseStats: { STR: 0, DEX: 0, INT: 0, LUK: 0, HP: null, MP: null },
    equipped: {},
  });

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">MBL /build</h1>
      <BuildPanel title="세팅" state={state} setState={setState} />
    </main>
  );
}
