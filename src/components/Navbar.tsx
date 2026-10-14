import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Our Story', href: '#story' },
    { label: 'Blessings', href: '#blessings' },
    { label: 'Celebrations', href: '#celebrations' },
    { label: 'Timeline', href: '#timeline' },
    { label: 'Venue', href: '#venue' },
    { label: 'RSVP', href: '#rsvp', isButton: true },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const topOffset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 80,
          transition: 'all 0.4s var(--ease-editorial)',
          backgroundColor: isScrolled ? 'rgba(248, 243, 236, 0.94)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(196, 163, 106, 0.25)' : '1px solid transparent',
          boxShadow: isScrolled ? '0 4px 20px rgba(84, 38, 55, 0.04)' : 'none',
          paddingTop: isScrolled ? '14px' : '22px',
          paddingBottom: isScrolled ? '14px' : '22px',
        }}
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Couple Monogram */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            aria-label={`${weddingData.brideName} and ${weddingData.groomName} Home`}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: 'var(--text-primary)',
                transition: 'color 0.3s ease',
              }}
            >
              {weddingData.monogram}
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '32px',
            }}
            className="desktop-nav-menu"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                style={
                  link.isButton
                    ? {
                        textDecoration: 'none',
                        padding: '8px 20px',
                        backgroundColor: 'var(--text-primary)',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'all 0.3s ease',
                      }
                    : {
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        position: 'relative',
                        padding: '4px 0',
                        transition: 'color 0.25s ease',
                      }
                }
                className={link.isButton ? 'nav-rsvp-btn' : 'nav-link'}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '4px',
            }}
            className="mobile-nav-toggle"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            top: '64px',
            backgroundColor: 'rgba(248, 243, 236, 0.98)',
            backdropFilter: 'blur(16px)',
            zIndex: 79,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            padding: '40px 24px',
            animation: 'fadeInMenu 0.3s var(--ease-editorial) forwards',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.8rem',
              color: 'var(--accent-gold)',
              marginBottom: '12px',
            }}
          >
            {weddingData.monogram}
          </div>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                letterSpacing: '0.08em',
                transition: 'color 0.2s ease',
              }}
            >
              {link.label}
            </a>
          ))}

          <div
            style={{
              marginTop: '24px',
              width: '40px',
              height: '1px',
              backgroundColor: 'var(--accent-gold)',
            }}
          />

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            {weddingData.formattedWeddingDate}
          </p>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav-menu {
            display: flex !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
        .nav-link:hover {
          color: var(--accent-gold) !important;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background-color: var(--accent-gold);
          transition: width 0.25s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-rsvp-btn:hover {
          background-color: var(--text-accent) !important;
          transform: translateY(-1px);
        }
        @keyframes fadeInMenu {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};
