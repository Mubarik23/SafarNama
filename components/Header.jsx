'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(currentTheme);

    const updateCount = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('yt_saved_places') || '[]');
        setSavedCount(Array.isArray(saved) ? saved.length : 0);
      } catch {
        setSavedCount(0);
      }
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('yt_saved_updated', updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('yt_saved_updated', updateCount);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: 'fa-house' },
    { href: '/explore', label: 'Explore', icon: 'fa-compass' },
    { href: '/map', label: 'Map', icon: 'fa-map' },
    { href: '/hotels', label: 'Stays', icon: 'fa-hotel' },
    { href: '/road-status', label: 'Road Status', icon: 'fa-route' },
    { href: '/saved', label: 'Saved', icon: 'fa-bookmark', badge: savedCount },
    { href: '/trips', label: 'Plan Trip', icon: 'fa-calendar-days' },
  ];

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* SafarNama PK Brand Logo */}
        <Link href="/" className="header-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-logo-icon">
            <i className="fa-solid fa-mountain-sun"></i>
          </div>
          <div className="brand-text">
            <span className="brand-name">
              SafarNama <span className="brand-badge-pk">PK</span>
            </span>
            <span className="brand-tagline">Pakistan Domestic Tourism Directory</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav" aria-label="Main Navigation">
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
                {link.badge > 0 && (
                  <span className="nav-badge-tag">{link.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Quick CTA to Plan Trip */}
          <Link href="/trips" className="btn-plan-header">
            <i className="fa-solid fa-route"></i>
            <span>Plan Journey</span>
          </Link>

          {/* Theme Toggler */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-menu" role="dialog" aria-modal="true">
          <nav className="mobile-drawer-nav">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`mobile-drawer-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="mobile-drawer-link-content">
                    <i className={`fa-solid ${link.icon}`}></i>
                    <span>{link.label}</span>
                  </div>
                  {link.badge > 0 && (
                    <span className="nav-badge-tag">{link.badge}</span>
                  )}
                </Link>
              );
            })}
            <Link
              href="/trips"
              className="btn-primary"
              style={{ marginTop: '12px', textAlign: 'center', justifyContent: 'center' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fa-solid fa-route"></i> Plan a Trip
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
