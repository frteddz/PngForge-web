import { useCallback } from 'react';

interface CompressionSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function getQualityLabel(level: number): string {
  if (level >= 90) return 'Lossless';
  if (level >= 70) return 'High';
  if (level >= 40) return 'Medium';
  return 'Low';
}

function getQualityColor(level: number): string {
  if (level >= 80) return 'var(--color-success)';
  if (level >= 40) return 'var(--color-warning)';
  return 'var(--color-error)';
}

export function CompressionSlider({ value, onChange, disabled = false }: CompressionSliderProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange],
  );

  const percent = ((value - 0) / (100 - 0)) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ color: 'var(--color-text)', fontWeight: 500, fontSize: '0.875rem' }}>
          Compression
        </span>
        <span
          style={{
            color: getQualityColor(value),
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          {value}% &mdash; {getQualityLabel(value)}
        </span>
      </div>
      <div style={{ position: 'relative', height: '1.5rem', display: 'flex', alignItems: 'center' }}>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            appearance: 'none',
            background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percent}%, var(--color-border) ${percent}%, var(--color-border) 100%)`,
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          onMouseMove={(e) => {
            const target = e.currentTarget;
            target.style.background = `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percent}%, var(--color-border) ${percent}%, var(--color-border) 100%)`;
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--color-text-tertiary)',
        }}
      >
        <span>Smaller file</span>
        <span>Best quality</span>
      </div>
    </div>
  );
}
