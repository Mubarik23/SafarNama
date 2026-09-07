import './globals.css';
import Header from '../components/Header';
import RoadsTicker from '../components/RoadsTicker';
import Footer from '../components/Footer';

export const metadata = {
  title: "SafarNama PK - Pakistan's Real-Time Tour & Travel Ecosystem",
  description:
    'Discover, plan, and book domestic travel across Pakistan in real-time. Guided tours, hotels, 4x4 rentals, live northern road conditions, and SafarAI Trip Planner powered by Next.js & Supabase.',
  keywords:
    'Pakistan travel, Hunza tours, Skardu 4x4, Swat tourism, Babusar pass status, KKH road conditions, Fairy Meadows trek, Supabase Next.js travel app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        {/* Ambient Spatial Glow Orbs */}
        <div className="bg-ambient-orb orb-1"></div>
        <div className="bg-ambient-orb orb-2"></div>
        <div className="bg-ambient-orb orb-3"></div>

        {/* Sticky App Header */}
        <Header />

        {/* Real-time Northern Roads Ticker */}
        <RoadsTicker />

        {/* Main Routed Content */}
        <main className="app-main">{children}</main>

        {/* Application Footer */}
        <Footer />
      </body>
    </html>
  );
}
