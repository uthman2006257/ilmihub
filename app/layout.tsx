export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ha">
      <body>{children}</body>
    </html>
  );
}
