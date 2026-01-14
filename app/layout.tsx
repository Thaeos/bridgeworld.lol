import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Bridgeworld Portal | Atlas Mines',
  description: 'Interactive web experience for Bridgeworld that unlocks a portal at the Atlas Mines when the Key and Map are aligned.',
  keywords: ['bridgeworld', 'treasuredao', 'atlas mines', 'portal', 'covenant', 'arbitrum', 'ens', 'uniswap'],
  authors: [{ name: 'tig0_0bitties' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Bridgeworld Portal | Atlas Mines',
    description: 'Unlock the portal at the Atlas Mines',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bridgeworld Portal | Atlas Mines',
    description: 'Unlock the portal at the Atlas Mines',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="antialiased">
        <Navigation />
        <div className="pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
