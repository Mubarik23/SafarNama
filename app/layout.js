import './globals.css';
import Header from '../components/Header';
import RoadsTicker from '../components/RoadsTicker';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';

export const metadata = {
  metadataBase: new URL('https://safarnama.pk'),
  title: 'SafarNama PK | Discover Pakistan Tourism, Valleys, Stays & Maps',
  description:
    'Discover Pakistan domestic travel: verified valleys, mountain passes, alpine lakes, verified stays, interactive spatial maps, and live NHMP highway clearance.',
  keywords:
    'SafarNama Pakistan, Pakistan domestic tourism, Hunza Valley, Skardu, Fairy Meadows, Swat, Naran Kaghan, Neelum Valley Kashmir, Pakistan map, KKH road status, Babusar Pass clearance',
  alternates: {
    canonical: 'https://safarnama.pk',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'SafarNama PK | Discover Pakistan Tourism, Valleys, Stays & Maps',
    description:
      'Pakistan domestic travel directory: verified valleys, mountain passes, verified stays, interactive maps, and live highway clearance.',
    url: 'https://safarnama.pk',
    siteName: 'SafarNama PK',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SafarNama PK | Discover Pakistan Tourism',
    description:
      'Verified valleys, mountain passes, verified stays, interactive maps, and live highway clearance.',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* Leaflet CSS for Pakistan Map */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        {/* Leaflet JS */}
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
          defer
        ></script>
      </head>
      <body>
        {/* Application Header */}
        <Header />

        {/* Real-time Northern Roads Ticker */}
        <RoadsTicker />

        {/* Main Application Content */}
        <main className="app-main">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </body>
    </html>
  );
}
