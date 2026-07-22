import { useState, lazy, Suspense, useCallback } from 'react';
import { useTheme } from './hooks/useTheme';
import { LicenseProvider, useLicense } from './licensing/LicenseProvider';
import { AnimatedBackground } from './components/AnimatedBackground';

const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage })),
);
const ConvertPage = lazy(() =>
  import('./pages/ConvertPage').then((m) => ({ default: m.ConvertPage })),
);

type Page = 'home' | 'convert';

const NAV_ITEMS: { key: Page; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'convert', label: 'Convert', icon: '🔄' },
];

function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        padding: '3rem',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <LicenseProvider productKey="PngForge">
      <AppInner />
    </LicenseProvider>
  );
}

function AppInner() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isPro, loading: proLoading, setShowProModal } = useLicense();

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      <AnimatedBackground />
      <button
        className="mobile-hamburger"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
        style={{
          position: 'fixed',
          top: '0.75rem',
          left: '0.75rem',
          zIndex: 110,
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
          cursor: 'pointer',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {mobileMenuOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          background: 'var(--color-background)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 90,
            }}
            className="mobile-overlay"
          />
        )}
        <nav
          style={{
            width: '220px',
            flexShrink: 0,
            background: 'var(--color-surface)',
            borderRight: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem',
            gap: '0.5rem',
          }}
          className={'sidebar-nav' + (mobileMenuOpen ? ' open' : '')}
        >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 0.5rem',
            marginBottom: '0.5rem',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-text)' }}>
              PngForge
            </span>
            {!proLoading && (
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  padding: '0.125rem 0.375rem',
                  borderRadius: 'var(--radius-sm)',
                  background: isPro ? 'var(--color-success-light)' : 'var(--color-warning-light)',
                  color: isPro ? 'var(--color-success)' : 'var(--color-warning)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {isPro ? 'Pro' : 'Free'}
              </span>
            )}
          </div>
        </div>

        {NAV_ITEMS.map((item) => {
          const active = currentPage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.625rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: active ? 'var(--color-primary-light)' : 'transparent',
                color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: active ? 600 : 400,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}

        <div style={{ flex: 1 }} />

        {!isPro && (
          <button
            onClick={() => setShowProModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.625rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'var(--color-primary)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all var(--transition-normal)',
              width: '100%',
            }}
          >
            <span>⭐</span>
            Upgrade to Pro
          </button>
        )}

        <button
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.625rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-secondary)',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all var(--transition-normal)',
            width: '100%',
          }}
        >
          {isDark ? '☀️' : '🌙'}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </nav>

      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {currentPage === 'home' && <HomePage onNavigate={() => navigate('convert')} />}
          {currentPage === 'convert' && <ConvertPage />}
        </Suspense>
      </main>
    </div>
    </>
  );
}
