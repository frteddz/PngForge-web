import { useState, lazy, Suspense, useCallback } from 'react';
import { useTheme } from './hooks/useTheme';

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
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { isDark, toggleTheme } = useTheme();

  const navigate = useCallback((page: Page) => setCurrentPage(page), []);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--color-background)',
      }}
    >
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
          <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-text)' }}>
            PngForge
          </span>
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
  );
}
