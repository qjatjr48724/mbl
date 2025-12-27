"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/build", label: "빌드" },
  { href: "/compare", label: "비교(A/B)" },
  { href: "/items", label: "아이템" },
];

function isActivePath(pathname: string, href: string) {
  // 루트(/)를 build로 취급(원하면 나중에 /를 /build로 리다이렉트해도 됨)
  if (href === "/build" && (pathname === "/" || pathname.startsWith("/build"))) return true;
  if (href !== "/build" && pathname.startsWith(href)) return true;
  return false;
}

export default function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2">
      {NAV.map((item) => {
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "rounded-xl border px-3 py-2 text-sm transition-colors",
              active
                ? "bg-black text-white border-black"
                : "bg-white hover:bg-gray-50",
            ].join(" ")}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
