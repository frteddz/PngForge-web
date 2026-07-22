import type { OutputFormat } from '../services/conversionService';

interface FormatSelectorProps {
  value: OutputFormat;
  onChange: (format: OutputFormat) => void;
  disabled?: boolean;
}

const FORMATS: { value: OutputFormat; label: string; icon: string }[] = [
  { value: 'PNG', label: 'PNG', icon: '🖼' },
  { value: 'JPG', label: 'JPG', icon: '📷' },
  { value: 'WebP', label: 'WebP', icon: '🌐' },
  { value: 'AVIF', label: 'AVIF', icon: '🚀' },
];

export function FormatSelector({ value, onChange, disabled = false }: FormatSelectorProps) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {FORMATS.map((fmt) => {
        const selected = fmt.value === value;
        return (
          <button
            key={fmt.value}
            onClick={() => onChange(fmt.value)}
            disabled={disabled}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
              background: selected ? 'var(--color-primary)' : 'var(--color-surface)',
              color: selected ? '#fff' : 'var(--color-text)',
              fontWeight: selected ? 600 : 400,
              fontSize: '0.875rem',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all var(--transition-normal)',
              opacity: disabled ? 0.6 : 1,
            }}
          >
            <span style={{ fontSize: '1rem' }}>{fmt.icon}</span>
            {fmt.label}
          </button>
        );
      })}
    </div>
  );
}
