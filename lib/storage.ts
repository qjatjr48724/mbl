// mbl/lib/storage.ts
import type { BuildState } from "./types";

const KEY = "mbl.savedBuild.v1";

type Payload = {
  version: 1;
  savedAt: string; // ISO
  build: BuildState;
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveBuildToStorage(build: BuildState) {
  if (!isBrowser()) return;

  const payload: Payload = {
    version: 1,
    savedAt: new Date().toISOString(),
    build,
  };
  localStorage.setItem(KEY, JSON.stringify(payload));
}

export function loadBuildFromStorage(): { build: BuildState; savedAt: string } | null {
  if (!isBrowser()) return null;

  const raw = localStorage.getItem(KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<Payload>;
    if (parsed.version !== 1 || !parsed.build || !parsed.savedAt) return null;
    return { build: parsed.build as BuildState, savedAt: parsed.savedAt as string };
  } catch {
    return null;
  }
}

export function clearSavedBuild() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEY);
}
