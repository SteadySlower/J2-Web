import Link from "next/link";

const navItems = [
  { label: "대시보드", href: "/" },
  { label: "단어장", href: "/word-books" },
  { label: "한자", href: "/kanji-books" },
  { label: "프로필", href: "/profile" },
];

export default function SideBar() {
  return (
    <aside
      style={{
        width: 200,
        padding: "1rem",
        borderRight: "1px solid #e5e7eb",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              textAlign: "center",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
