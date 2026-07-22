import type { OutputFormat } from '../services/conversionService';
import { useLicense } from '../licensing/LicenseProvider';

interface FormatSelectorProps {
  value: OutputFormat;
  onChange: (format: OutputFormat) => void;
  disabled?: boolean;
}

const FORMATS: { value: OutputFormat; label: string; icon: string; pro?: boolean }[] = [
  { value: 'PNG', label: 'PNG', icon: '🖼' },
  { value: 'JPG', label: 'JPG', icon: '📷' },
  { value: 'WebP', label: 'WebP', icon: '🌐', pro: true },
  { value: 'AVIF', label: 'AVIF', icon: '🚀', pro: true },
];

export function FormatSelector({ value, onChange, disabled = false }: FormatSelectorProps) {
  const { isPro, setShowProModal } = useLicense();

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {FORMATS.map((fmt) => {
        const selected = fmt.value === value;
        const locked = fmt.pro && !isPro;
        return (
          <button
            key={fmt.value}
            onClick={() => {
              if (locked) { setShowProModal(true); return; }
              onChange(fmt.value);
            }}
            disabled={disabled}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
              background: selected ? 'var(--color-primary)' : 'var(--color-surface)',
              color: selected ? '#fff' : (locked ? 'var(--color-text-tertiary)' : 'var(--color-text)'),
              fontWeight: selected ? 600 : 400,
              fontSize: '0.875rem',
              cursor: locked ? 'pointer' : (disabled ? 'not-allowed' : 'pointer'),
              transition: 'all var(--transition-normal)',
              opacity: disabled ? 0.6 : (locked ? 0.7 : 1),
              position: 'relative',
            }}
          >
            {locked && (
              <span style={{ fontSize: '0.75rem', position: 'absolute', top: '-4px', right: '-4px' }}>🔒</span>
            )}
            <span style={{ fontSize: '1rem' }}>{fmt.icon}</span>
            {fmt.label}
          </button>
        );
      })}
    </div>
  );
}
