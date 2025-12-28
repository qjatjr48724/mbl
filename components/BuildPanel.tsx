"use client";

import React from "react";
import { ITEMS } from "@/lib/items";
import type { BuildState, ItemMaster, JobKo } from "@/lib/types";
import { SLOT_KEYS, SLOT_LABEL_KO, type SlotKey } from "@/lib/constants/slots";
import { STAT_KEYS, addStats, normalizeStats, type StatKey, type Stats } from "@/lib/constants/stats";

import CombatPowerCard from "@/components/CombatPowerCard";
import { deriveCombatPower } from "@/lib/engine/combatPower";
import { getJobOptionsByGroup, formatJobLabel } from "@/lib/jobs";
import { WEAPON_KEYS, WEAPON_LABEL_KO, type WeaponKey } from "@/lib/constants/weapons";
import DerivedStatsCard from "@/components/DerivedStatsCard";
import { deriveAll } from "@/lib/engine/derivedStats";




const JOBS: JobKo[] = ["전사", "마법사", "궁수", "도적"];

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

// ring1~4 어느 슬롯에서든 반지 아이템 검색되게
function slotMatches(activeSlot: SlotKey, itemSlot: SlotKey) {
  if (activeSlot.startsWith("ring")) return itemSlot.startsWith("ring");
  return activeSlot === itemSlot;
}

function jobAllowed(job: JobKo, restrictions: Array<JobKo | "ALL">) {
  return restrictions.includes("ALL") || restrictions.includes(job);
}

function toNumberOrNull(raw: string): number | null {
  const t = raw.trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calcTotal(state: BuildState) {
  let equipSum: Stats = {};
  for (const slot of SLOT_KEYS) {
    const e = state.equipped[slot];
    if (!e) continue;
    equipSum = addStats(equipSum, e.customStats);
  }

  const a = normalizeStats(state.baseStats);
  const b = normalizeStats(equipSum);

  const out: Record<StatKey, number> = { ...a };
  for (const k of STAT_KEYS) out[k] = (out[k] ?? 0) + (b[k] ?? 0);
  return out;
}

export default function BuildPanel({
  title,
  state,
  setState,
}: {
  title: string;
  state: BuildState;
  setState: React.Dispatch<React.SetStateAction<BuildState>>;
}) {
  const [activeSlot, setActiveSlot] = React.useState<SlotKey>("weapon");
  const [query, setQuery] = React.useState("");

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalItem, setModalItem] = React.useState<ItemMaster | null>(null);
  const [modalStats, setModalStats] = React.useState<Stats>({});

  const filteredItems = React.useMemo(() => {
    const q = query.trim();
    return ITEMS.filter((it) => {
      if (!slotMatches(activeSlot, it.slot)) return false;
      if (it.requiredLevel > (state.level ?? 1)) return false;
      if (!jobAllowed(state.job, it.jobRestrictions)) return false;
      if (q.length === 0) return true;
      return it.name.includes(q);
    }).slice(0, 50);
  }, [activeSlot, query, state.job, state.level]);

// ### total 계산
  const total = React.useMemo(() => calcTotal(state), [state]);
  const combatPower = React.useMemo(() => deriveCombatPower(total), [total]);
  const jobOptions = React.useMemo(() => getJobOptionsByGroup(state.job), [state.job]);
  const derived = React.useMemo(
    () =>
      deriveAll({
        total,
        job: state.job,
        weaponType: state.weaponType ?? null,
        physMastery: state.physMastery ?? 0.6,
        spellMastery: state.spellMastery ?? 0.6,
        spellAttack: state.spellAttack ?? 100,
      }),
    [total, state.job, state.weaponType, state.physMastery, state.spellMastery, state.spellAttack]
  );
  


  function openItemModal(item: ItemMaster) {
    setModalItem(item);
    setModalStats(makeInitialModalStats(item));
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setModalItem(null);
    setModalStats({});
  }

  function confirmEquip() {
    if (!modalItem) return;

    const targetSlot = activeSlot; // v1.2: 현재 선택 슬롯에 장착

    setState((prev) => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [targetSlot]: {
          slot: targetSlot,
          itemId: modalItem.id,
          itemName: modalItem.name,
          customStats: modalStats,
        },
      },
    }));

    closeModal();
  }

  function unequip(slot: SlotKey) {
    setState((prev) => {
      const next = { ...prev.equipped };
      delete next[slot];
      return { ...prev, equipped: next };
    });
  }

  return (
    <section className="rounded-2xl border p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="text-xs text-gray-500">v1.2</div>
      </header>

      {/* 상단: 직업/레벨, 순스탯, 총합 */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-3 space-y-3">
          <div className="font-semibold">직업 / 레벨</div>
            
          <div className="space-y-1">
            <div className="text-xs text-gray-600">직업</div>
            <select
              className="w-full rounded-xl border px-3 py-2"
              value={state.job}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  job: e.target.value as JobKo,
                  jobDetail: null,
                }))
              }
              
            >
              {JOBS.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
              
            </select>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-gray-600">직업 상세(1~4차)</div>
            <select
              className="w-full rounded-xl border px-3 py-2"
              value={state.jobDetail ?? ""}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  jobDetail: e.target.value === "" ? null : e.target.value,
                }))
              }
            >
              <option value="">(선택 안 함)</option>
              {jobOptions.map((opt) => (
                <option key={opt.id} value={opt.label}>
                  {formatJobLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-gray-600">무기 종류(무기상수)</div>
            <select
              className="w-full rounded-xl border px-3 py-2"
              value={(state.weaponType ?? "") as any}
              onChange={(e) =>
                setState((p) => ({
                  ...p,
                  weaponType: (e.target.value || null) as WeaponKey | null,
                }))
              }
            >
              <option value="">(선택 안 함)</option>
              {WEAPON_KEYS.map((k) => (
                <option key={k} value={k}>
                  {WEAPON_LABEL_KO[k]}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-gray-500">
              * 도끼/둔기/창/폴암은 베기/찌르기에 따라 상수가 달라져서 둘 다 계산해 표시합니다.
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* <div className="space-y-1">
              <div className="text-xs text-gray-600">물리 숙련도</div>
              <input
                className="w-full rounded-xl border px-3 py-2"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={state.physMastery ?? 0.6}
                onChange={(e) =>
                  setState((p) => ({ ...p, physMastery: Number(e.target.value) }))
                }
              />
            </div>

            <div className="space-y-1">
              <div className="text-xs text-gray-600">마법 숙련도</div>
              <input
                className="w-full rounded-xl border px-3 py-2"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={state.spellMastery ?? 0.6}
                onChange={(e) =>
                  setState((p) => ({ ...p, spellMastery: Number(e.target.value) }))
                }
              />
            </div> */}

            <div className="space-y-1">
              <div className="text-xs text-gray-600">스킬공격력</div>
              <input
                className="w-full rounded-xl border px-3 py-2"
                type="number"
                step="1"
                min="1"
                value={state.spellAttack ?? 100}
                onChange={(e) =>
                  setState((p) => ({ ...p, spellAttack: Number(e.target.value) }))
                }
              />
            </div>
          </div>


          <div className="space-y-1">
            <div className="text-xs text-gray-600">레벨</div>
            <input
              className="w-full rounded-xl border px-3 py-2"
              type="number"
              min={1}
              value={state.level}
              onChange={(e) => setState((p) => ({ ...p, level: Number(e.target.value) || 1 }))}
            />
          </div>
        </div>

        <div className="rounded-2xl border p-3 space-y-3">
          <div className="font-semibold">순스탯</div>

          <div className="grid grid-cols-2 gap-2">
            {(["STR", "DEX", "INT", "LUK", "HP", "MP"] as StatKey[]).map((k) => (
              <div key={k} className="space-y-1">
                <div className="text-xs text-gray-600">{STAT_LABEL_KO[k]}</div>
                <input
                  className="w-full rounded-xl border px-3 py-2"
                  type="number"
                  value={state.baseStats[k] ?? ""}
                  placeholder={k === "HP" || k === "MP" ? "빈칸 가능" : "0"}
                  onChange={(e) =>
                    setState((p) => ({
                      ...p,
                      baseStats: { ...p.baseStats, [k]: toNumberOrNull(e.target.value) },
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border p-3 space-y-3">
          <div className="font-semibold">총합 스탯</div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            {STAT_KEYS.map((k) => {
              const v = total[k] ?? 0;
              if (v === 0) return null;
              return (
                <div key={k} className="flex justify-between rounded-xl bg-gray-50 px-3 py-2">
                  <span className="text-gray-600">{STAT_LABEL_KO[k]}</span>
                  <span className="font-medium">{v}</span>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-gray-500">* 빈칸(null)은 계산 시 0으로 취급</div>
        </div>
      </div>

      {/* v1 공격력/마력 표기 */}
      <CombatPowerCard value={combatPower} title="공격력/마력(표기)" />

      {/* v1.6 파생/공마 계산(무기상수 반영) */}
      <DerivedStatsCard
        job={state.job}
        weaponType={(state.weaponType ?? null) as any}
        physMastery={state.physMastery ?? 0.6}
        spellMastery={state.spellMastery ?? 0.6}
        spellAttack={state.spellAttack ?? 100}
        value={derived}
      />

      {/* 슬롯 + 검색 */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-3 space-y-2 md:col-span-1">
          <div className="font-semibold">슬롯</div>
          <div className="grid grid-cols-2 gap-2">
            {SLOT_KEYS.map((slot) => {
              const active = slot === activeSlot;
              const has = !!state.equipped[slot];
              return (
                <button
                  key={slot}
                  className={[
                    "rounded-xl border px-3 py-2 text-left text-sm",
                    active ? "bg-black text-white" : "bg-white",
                  ].join(" ")}
                  onClick={() => setActiveSlot(slot)}
                >
                  <div className="flex items-center justify-between">
                    <span>{SLOT_LABEL_KO[slot]}</span>
                    {has ? <span className={active ? "text-white/80" : "text-gray-500"}>장착</span> : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border p-3 space-y-2 md:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div className="font-semibold">아이템 검색</div>
            <input
              className="w-full max-w-md rounded-xl border px-3 py-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="아이템 이름 검색"
            />
          </div>

          <div className="text-sm text-gray-500">
            슬롯: <b>{SLOT_LABEL_KO[activeSlot]}</b> · 레벨 ≤ <b>{state.level}</b> · 직업: <b>{state.job}</b>
          </div>

          <div className="grid gap-2">
            {filteredItems.length === 0 ? (
              <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">조건에 맞는 아이템이 없습니다.</div>
            ) : (
              filteredItems.map((it) => (
                <button
                  key={it.id}
                  className="rounded-xl border px-3 py-3 text-left hover:bg-gray-50"
                  onClick={() => openItemModal(it)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-gray-500">Lv{it.requiredLevel}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    필드: {it.statTemplate.join(", ")}
                    {it.defaultStats ? " · 정옵션 있음" : " · 정옵션 없음(빈칸 시작)"}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 장착 목록 */}
      <div className="rounded-2xl border p-3 space-y-2">
        <div className="font-semibold">장착 목록</div>
        <div className="grid gap-2 md:grid-cols-2">
          {SLOT_KEYS.map((slot) => {
            const e = state.equipped[slot];
            return (
              <div key={slot} className="rounded-xl bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{SLOT_LABEL_KO[slot]}</div>
                  {e ? (
                    <button className="text-xs text-red-600" onClick={() => unequip(slot)}>
                      해제
                    </button>
                  ) : null}
                </div>
                {e ? (
                  <div className="mt-1 text-sm">
                    <div className="font-medium">{e.itemName}</div>
                  </div>
                ) : (
                  <div className="mt-1 text-xs text-gray-500">미장착</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 모달 */}
      {modalOpen && modalItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-4 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">{modalItem.name}</div>
                <div className="text-sm text-gray-500">
                  {SLOT_LABEL_KO[activeSlot]}에 장착 · Lv{modalItem.requiredLevel}
                </div>
              </div>
              <button className="text-sm text-gray-600" onClick={closeModal}>
                닫기
              </button>
            </div>

            <div className="space-y-2">
              {modalItem.statTemplate.map((k) => {
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
              <button className="rounded-xl border px-4 py-2" onClick={closeModal}>
                취소
              </button>
              <button className="rounded-xl bg-black px-4 py-2 text-white" onClick={confirmEquip}>
                확인(장착)
              </button>
            </div>

            <p className="text-xs text-gray-500">
              * 정옵션이 없는 아이템은 빈칸(null)으로 시작합니다. 빈칸은 계산 시 0으로 처리됩니다.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
