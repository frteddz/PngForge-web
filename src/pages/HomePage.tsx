const FEATURES = [
  { icon: '🖼️', title: 'PNG', desc: 'Lossless PNG conversion' },
  { icon: '📷', title: 'JPG', desc: 'Compressed JPEG output' },
  { icon: '🌐', title: 'WebP', desc: 'Modern WebP format', pro: true },
  { icon: '🚀', title: 'AVIF', desc: 'Next-gen AVIF images', pro: true },
  { icon: '📂', title: 'Drag & Drop', desc: 'Intuitive file loading' },
  { icon: '📁', title: 'Folder Conversion', desc: 'Batch process folders', pro: true },
  { icon: '📦', title: 'Compression', desc: 'Adjustable quality', pro: true },
  { icon: '👁️', title: 'Quality Preview', desc: 'Side-by-side comparison' },
];

interface HomePageProps {
  onNavigate: () => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3rem 1.5rem',
        maxWidth: '720px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 8px 24px rgba(99,102,241,0.25)',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <h1
          style={{
            fontSize: '2.25rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            letterSpacing: '-0.02em',
            marginBottom: '0.375rem',
          }}
        >
          PngForge
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            fontWeight: 400,
          }}
        >
          Batch Image Converter
        </p>
      </div>

      <div
        className="animate-slide-up"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '0.75rem',
          width: '100%',
          marginBottom: '2rem',
        }}
      >
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              textAlign: 'center',
              transition: 'all var(--transition-normal)',
              position: 'relative',
            }}
          >
            {feature.pro && (
              <span
                style={{
                  position: 'absolute',
                  top: '0.375rem',
                  right: '0.375rem',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  padding: '0.125rem 0.375rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-warning-light)',
                  color: 'var(--color-warning)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Pro
              </span>
            )}
            <div style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>{feature.icon}</div>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)', marginBottom: '0.125rem' }}>
              {feature.title}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>{feature.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onNavigate}
        style={{
          padding: '0.75rem 2rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'all var(--transition-normal)',
          boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
        }}
      >
        Get Started
      </button>
    </div>
  );
}
