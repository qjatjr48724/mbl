"use client";

import React from "react";
import { ITEMS } from "@/lib/items";
import { SLOT_KEYS, SLOT_LABEL_KO, type SlotKey } from "@/lib/constants/slots";
import { STAT_KEYS, type StatKey, type Stats } from "@/lib/constants/stats";
import type { BuildState, ItemMaster, JobKo } from "@/lib/types";
import { loadBuildA, loadBuildB, saveBuildA, saveBuildB } from "@/lib/storage";

const JOBS: Array<JobKo | "ALL"> = ["ALL", "전사", "마법사", "궁수", "도적"];

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

// v1.2 정책: defaultStats 없으면 null(빈칸)로 시작
function makeInitialModalStats(item: ItemMaster): Stats {
  const out: Stats = {};
  for (const k of item.statTemplate) out[k] = null;
  if (item.defaultStats) {
    for (const [k, v] of Object.entries(item.defaultStats)) {
      out[k as StatKey] = v;
    }
  }
  return out;
}

function toNumberOrNull(raw: string): number | null {
  const t = raw.trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function jobAllowed(filter: JobKo | "ALL", restrictions: Array<JobKo | "ALL">) {
  if (filter === "ALL") return true;
  return restrictions.includes("ALL") || restrictions.includes(filter);
}

function slotAllowed(filter: SlotKey | "ALL", itemSlot: SlotKey) {
  if (filter === "ALL") return true;
  // 반지 호환: ring1~4는 ring끼리 같이 묶어서 보여주기
  if (filter.startsWith("ring")) return itemSlot.startsWith("ring");
  return filter === itemSlot;
}

function levelAllowed(filter: number | "ALL", req: number) {
  if (filter === "ALL") return true;
  return req <= filter;
}

function ensureBuild(base: BuildState | null): BuildState {
  return (
    base ?? {
      job: "마법사",
      level: 1,
      baseStats: { STR: 0, DEX: 0, INT: 0, LUK: 0, HP: null, MP: null },
      equipped: {},
    }
  );
}

export default function Page() {
  const [query, setQuery] = React.useState("");
  const [slotFilter, setSlotFilter] = React.useState<SlotKey | "ALL">("ALL");
  const [jobFilter, setJobFilter] = React.useState<JobKo | "ALL">("ALL");
  const [levelFilter, setLevelFilter] = React.useState<number | "ALL">("ALL");

  const [selected, setSelected] = React.useState<ItemMaster | null>(null);
  const [modalStats, setModalStats] = React.useState<Stats>({});
  const [toast, setToast] = React.useState<string | null>(null);

  function show(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1400);
  }

  const filtered = React.useMemo(() => {
    const q = query.trim();
    return ITEMS.filter((it) => {
      if (!slotAllowed(slotFilter, it.slot)) return false;
      if (!jobAllowed(jobFilter, it.jobRestrictions)) return false;
      if (!levelAllowed(levelFilter, it.requiredLevel)) return false;
      if (q.length === 0) return true;
      return it.name.includes(q);
    }).slice(0, 200);
  }, [query, slotFilter, jobFilter, levelFilter]);

  function openItem(item: ItemMaster) {
    setSelected(item);
    setModalStats(makeInitialModalStats(item));
  }

  function closeModal() {
    setSelected(null);
    setModalStats({});
  }

  function equipTo(target: "A" | "B") {
    if (!selected) return;

    const loaded = target === "A" ? loadBuildA() : loadBuildB();
    const state = ensureBuild(loaded?.build ?? null);

    // 도감에서 장착 시: "아이템의 원래 slot"에 그대로 장착
    const targetSlot = selected.slot;

    const next: BuildState = {
      ...state,
      equipped: {
        ...state.equipped,
        [targetSlot]: {
          slot: targetSlot,
          itemId: selected.id,
          itemName: selected.name,
          customStats: modalStats,
        },
      },
    };

    if (target === "A") saveBuildA(next);
    else saveBuildB(next);

    show(`${target} 세팅에 장착 저장 완료`);
    closeModal();
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">MBL /items (아이템 도감)</h1>
      </div>

      {toast ? <div className="text-sm text-gray-600">{toast}</div> : null}

      {/* 필터 */}
      <section className="rounded-2xl border p-4 space-y-3">
        <div className="grid gap-2 md:grid-cols-4">
          <input
            className="rounded-xl border px-3 py-2"
            placeholder="아이템 이름 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className="rounded-xl border px-3 py-2"
            value={slotFilter}
            onChange={(e) => setSlotFilter(e.target.value as any)}
          >
            <option value="ALL">전체 슬롯</option>
            {SLOT_KEYS.map((k) => (
              <option key={k} value={k}>
                {SLOT_LABEL_KO[k]}
              </option>
            ))}
          </select>

          <select
            className="rounded-xl border px-3 py-2"
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value as any)}
          >
            {JOBS.map((j) => (
              <option key={j} value={j}>
                {j === "ALL" ? "전체 직업" : j}
              </option>
            ))}
          </select>

          <input
            className="rounded-xl border px-3 py-2"
            type="number"
            placeholder="레벨(이하)"
            value={levelFilter === "ALL" ? "" : levelFilter}
            onChange={(e) => {
              const v = e.target.value.trim();
              setLevelFilter(v === "" ? "ALL" : Number(v));
            }}
          />
        </div>

        <div className="text-xs text-gray-500">
          * 레벨 필터는 “요구 레벨 ≤ 입력값” 기준
        </div>
      </section>

      {/* 목록 */}
      <section className="rounded-2xl border p-4 space-y-3">
        <div className="text-sm text-gray-600">표시: {filtered.length}개 (최대 200)</div>

        <div className="grid gap-2 md:grid-cols-2">
          {filtered.map((it) => (
            <button
              key={it.id}
              className="rounded-xl border px-3 py-3 text-left hover:bg-gray-50"
              onClick={() => openItem(it)}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-500">Lv{it.requiredLevel}</div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                슬롯: {SLOT_LABEL_KO[it.slot]} · 직업: {it.jobRestrictions.join(", ")}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                필드: {it.statTemplate.join(", ")} {it.defaultStats ? "· 정옵션 있음" : "· 정옵션 없음"}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 모달 */}
      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-4 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">{selected.name}</div>
                <div className="text-sm text-gray-500">
                  슬롯: {SLOT_LABEL_KO[selected.slot]} · Lv{selected.requiredLevel} · 직업:{" "}
                  {selected.jobRestrictions.join(", ")}
                </div>
              </div>
              <button className="text-sm text-gray-600" onClick={closeModal}>
                닫기
              </button>
            </div>

            <div className="space-y-2">
              {selected.statTemplate.map((k) => {
                const v = modalStats[k];
                return (
                  <div key={k} className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2">
                    <div className="text-sm text-gray-700 w-24">{STAT_LABEL_KO[k]}</div>

                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-lg border px-3 py-1"
                        onClick={() =>
                          setModalStats((p) => {
                            const cur = p[k] ?? null;
                            const base = cur === null ? 0 : cur;
                            return { ...p, [k]: base - 1 };
                          })
                        }
                      >
                        -
                      </button>

                      <input
                        className="w-28 rounded-lg border px-3 py-1 text-right"
                        inputMode="numeric"
                        value={v ?? ""}
                        onChange={(e) =>
                          setModalStats((p) => ({
                            ...p,
                            [k]: toNumberOrNull(e.target.value),
                          }))
                        }
                      />

                      <button
                        className="rounded-lg border px-3 py-1"
                        onClick={() =>
                          setModalStats((p) => {
                            const cur = p[k] ?? null;
                            const base = cur === null ? 0 : cur;
                            return { ...p, [k]: base + 1 };
                          })
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2">
              <button className="rounded-xl border px-4 py-2" onClick={() => equipTo("A")}>
                A에 장착 저장
              </button>
              <button className="rounded-xl border px-4 py-2" onClick={() => equipTo("B")}>
                B에 장착 저장
              </button>
              <button className="rounded-xl bg-black px-4 py-2 text-white" onClick={closeModal}>
                닫기
              </button>
            </div>

            <p className="text-xs text-gray-500">
              * 정옵션이 없는 아이템은 빈칸(null)으로 시작합니다. 빈칸은 계산 시 0으로 처리됩니다.
            </p>
          </div>
        </div>
      ) : null}
    </main>
  );
}
