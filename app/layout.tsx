import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'InflationLens',
  description: 'Track your personal inflation rate',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
