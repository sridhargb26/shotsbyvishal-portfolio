export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="font-body min-h-screen"
      style={{ background: "var(--ink)", color: "var(--bone)" }}
    >
      {children}
    </div>
  );
}
