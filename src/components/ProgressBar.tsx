import type { ConversionProgress } from '../hooks/useConversion';

interface ProgressBarProps {
  progress: ConversionProgress;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.875rem',
        }}
      >
        <span style={{ color: 'var(--color-text)' }}>
          Converting <strong>{progress.currentFile}</strong>
        </span>
        <span style={{ color: 'var(--color-text-secondary)' }}>
          {progress.completed}/{progress.total} &middot; {progress.percent}%
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: '8px',
          borderRadius: '4px',
          background: 'var(--color-border)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress.percent}%`,
            borderRadius: '4px',
            background: 'var(--color-primary)',
            transition: 'width var(--transition-normal)',
          }}
        />
      </div>
    </div>
  );
}
