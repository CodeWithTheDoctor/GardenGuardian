import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'GardenGuardian AI - Your AI-Powered Garden Health Detective',
  description: 'Instantly diagnose plant diseases & pests and get Australian-compliant treatments tailored to your garden. Save 30-40% of your produce with professional-grade AI diagnosis.',
  authors: [{ name: 'GardenGuardian Team' }],
  keywords: [
    'garden', 'plant disease', 'AI', 'Australia', 'plant health', 'gardening',
    'APVMA', 'pest control', 'organic gardening', 'plant diagnosis', 'mobile app'
  ],
  openGraph: {
    title: 'GardenGuardian AI - Your AI-Powered Garden Health Detective',
    description: 'Instantly diagnose plant diseases & pests and get Australian-compliant treatments tailored to your garden.',
    url: 'https://gardenguardian.com.au',
    siteName: 'GardenGuardian AI',
    images: [
      {
        url: 'https://images.pexels.com/photos/7728078/pexels-photo-7728078.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        width: 1260,
        height: 750,
        alt: 'GardenGuardian AI - Healthy garden vegetables',
      },
    ],
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GardenGuardian AI - Your AI-Powered Garden Health Detective',
    description: 'Instantly diagnose plant diseases & pests and get Australian-compliant treatments tailored to your garden.',
    images: ['https://images.pexels.com/photos/7728078/pexels-photo-7728078.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GardenGuardian AI',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#386641" />
        <meta name="color-scheme" content="light" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/svg+xml" sizes="16x16" href="/icon-16.svg" />
        <link rel="icon" type="image/svg+xml" sizes="32x32" href="/icon-32.svg" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.svg" />
        
        {/* PWA Icons for different sizes */}
        <link rel="icon" type="image/svg+xml" sizes="192x192" href="/icon-192.svg" />
        <link rel="icon" type="image/svg+xml" sizes="512x512" href="/icon-512.svg" />
        
        {/* Apple PWA Configuration */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GardenGuardian AI" />
        
        {/* Mobile PWA Configuration */}
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#386641" />
        <meta name="msapplication-TileImage" content="/icon-144.svg" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col w-full overflow-x-hidden`}>

        
        <ThemeProvider attribute="class" defaultTheme="light">
          {/* Navigation with proper ARIA role */}
          <header role="banner">
            <Navbar />
          </header>
          
          {/* Main content area with proper landmark */}
          <main 
            id="main-content" 
            role="main" 
            className="flex-1 focus:outline-none" 
            tabIndex={-1}
          >
            {children}
          </main>
          
          {/* Footer with proper landmark */}
          <footer role="contentinfo">
            <Footer />
          </footer>
          <Toaster />
        </ThemeProvider>
        
        {/* Live region for announcements */}
        <div 
          id="live-region" 
          aria-live="polite" 
          aria-atomic="true" 
          className="sr-only"
        ></div>
      </body>
    </html>
  );
}