import raw from "@/data/jobs.ko.json";
import type { JobKo } from "@/lib/types";

type JobNode = {
  id: string;
  label: string;
  tier?: number;
  children?: JobNode[];
};

type JobsKo = {
  version: number;
  groups: Array<{
    id: string;
    label: JobKo; // "전사" | "마법사" | "궁수" | "도적"
    children: JobNode[];
  }>;
};

const JOBS = raw as unknown as JobsKo;

export type JobOption = {
  id: string;
  label: string;
  tier: number;
};

function flatten(nodes: JobNode[], out: JobOption[] = []): JobOption[] {
  for (const n of nodes) {
    out.push({ id: n.id, label: n.label, tier: n.tier ?? 0 });
    if (n.children?.length) flatten(n.children, out);
  }
  return out;
}

export function getJobOptionsByGroup(group: JobKo): JobOption[] {
  const g = JOBS.groups.find((x) => x.label === group);
  if (!g) return [];
  return flatten(g.children);
}

// 표시용: tier에 따라 살짝 들여쓰기 느낌
export function formatJobLabel(opt: JobOption): string {
  const indent = opt.tier >= 2 ? "— " : "";
  const indent2 = opt.tier >= 3 ? "—— " : "";
  return `${indent2 || indent}${opt.label}`;
}
