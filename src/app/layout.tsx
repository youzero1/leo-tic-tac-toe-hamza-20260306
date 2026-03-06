import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Leo Tic Tac Toe',
  description: 'A social media-oriented tic-tac-toe game',
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
