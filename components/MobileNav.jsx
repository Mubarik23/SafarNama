'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function MobileNav() {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
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

  const navItems = [
    { href: '/', label: 'Home', icon: 'fa-house' },
    { href: '/explore', label: 'Explore', icon: 'fa-compass' },
    { href: '/map', label: 'Map', icon: 'fa-map' },
    { href: '/hotels', label: 'Stays', icon: 'fa-hotel' },
    { href: '/saved', label: 'Saved', icon: 'fa-bookmark', badge: savedCount }
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <div className="mobile-bottom-nav-inner">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="mobile-nav-icon-wrap">
                <i className={`fa-solid ${item.icon}`}></i>
                {item.badge > 0 && (
                  <span className="mobile-nav-badge">{item.badge}</span>
                )}
              </div>
              <span className="mobile-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
