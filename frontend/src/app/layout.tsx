// This root layout is required for Next.js with i18n routing
// Do not add html/body tags here - they are in [locale]/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
