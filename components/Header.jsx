'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import SupabaseStatusBadge from './SupabaseStatusBadge';

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: 'fa-house' },
    { href: '/tours', label: 'Guided Tours', icon: 'fa-map-location-dot' },
    { href: '/hotels', label: 'Mountain Resorts', icon: 'fa-hotel' },
    { href: '/transport', label: '4x4 Jeeps', icon: 'fa-truck-monster' },
    { href: '/road-status', label: 'Live Highway Alerts', icon: 'fa-triangle-exclamation' },
    { href: '/ai-planner', label: 'SafarAI Planner', icon: 'fa-wand-magic-sparkles' }
  ];

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <Link href="/" className="header-brand" style={{ textDecoration: 'none' }}>
          <div className="brand-logo-icon">
            <i className="fa-solid fa-mountain-sun"></i>
          </div>
          <div className="brand-text">
            <div className="brand-name">
              SafarNama <span className="brand-badge-pk">PK 🇵🇰</span>
            </div>
            <div className="brand-tagline">Next.js + Supabase Ecosystem</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`next-nav-link ${isActive ? 'active' : ''}`}
              >
                <i className={`fa-solid ${link.icon}`}></i>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Live Supabase Connection Badge */}
          <SupabaseStatusBadge />

          {/* Theme Toggler */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title="Toggle Dark/Light Spatial Mode"
            aria-label="Toggle theme"
          >
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
}
