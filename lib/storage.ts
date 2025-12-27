import type { BuildState } from "./types";

const KEY_A = "mbl.savedBuildA.v1";
const KEY_B = "mbl.savedBuildB.v1";

type Payload = {
  version: 1;
  savedAt: string;
  build: BuildState;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function save(key: string, build: BuildState) {
  if (!isBrowser()) return;
  const payload: Payload = { version: 1, savedAt: new Date().toISOString(), build };
  localStorage.setItem(key, JSON.stringify(payload));
}

function load(key: string): { build: BuildState; savedAt: string } | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<Payload>;
    if (parsed.version !== 1 || !parsed.build || !parsed.savedAt) return null;
    return { build: parsed.build as BuildState, savedAt: parsed.savedAt as string };
  } catch {
    return null;
  }
}

export function saveBuildA(build: BuildState) {
  save(KEY_A, build);
}
export function saveBuildB(build: BuildState) {
  save(KEY_B, build);
}
export function loadBuildA() {
  return load(KEY_A);
}
export function loadBuildB() {
  return load(KEY_B);
}
export function clearBuildA() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEY_A);
}
export function clearBuildB() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEY_B);
}
