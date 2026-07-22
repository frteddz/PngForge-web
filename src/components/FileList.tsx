import { useCallback } from 'react';
import type { ConvertFileItem } from '../hooks/useConversion';
import { formatFileSize } from '../utils/imageUtils';

interface FileListProps {
  files: ConvertFileItem[];
  onRemove: (id: string) => void;
  onDownload: (item: ConvertFileItem) => void;
  disabled?: boolean;
}

const STATUS_CONFIG: Record<
  ConvertFileItem['status'],
  { label: string; color: string; bg: string }
> = {
  pending: { label: 'Pending', color: 'var(--color-text-tertiary)', bg: 'var(--color-surface-secondary)' },
  converting: { label: 'Converting...', color: 'var(--color-info)', bg: 'var(--color-info-light)' },
  done: { label: 'Done', color: 'var(--color-success)', bg: 'var(--color-success-light)' },
  error: { label: 'Error', color: 'var(--color-error)', bg: 'var(--color-error-light)' },
};

export function FileList({ files, onRemove, onDownload, disabled = false }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {files.map((item, index) => (
        <FileRow
          key={item.id}
          item={item}
          onRemove={onRemove}
          onDownload={onDownload}
          disabled={disabled}
          delay={index * 0.05}
        />
      ))}
    </div>
  );
}

interface FileRowProps {
  item: ConvertFileItem;
  onRemove: (id: string) => void;
  onDownload: (item: ConvertFileItem) => void;
  disabled: boolean;
  delay: number;
}

function FileRow({ item, onRemove, onDownload, disabled, delay }: FileRowProps) {
  const handleRemove = useCallback(() => onRemove(item.id), [onRemove, item.id]);
  const handleDownload = useCallback(() => onDownload(item), [onDownload, item]);
  const cfg = STATUS_CONFIG[item.status];

  return (
    <div
      className="animate-slide-up"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        animationDelay: `${delay}s`,
        animationFillMode: 'both',
        transition: 'all var(--transition-normal)',
      }}
    >
      <img
        src={item.thumbnail}
        alt={item.name}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-sm)',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            color: 'var(--color-text)',
            fontWeight: 500,
            fontSize: '0.875rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.name}
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
          <span>{formatFileSize(item.size)}</span>
          {item.outputSize != null && (
            <>
              <span>&rarr;</span>
              <span style={{ color: 'var(--color-success)' }}>{formatFileSize(item.outputSize)}</span>
            </>
          )}
        </div>
      </div>
      <span
        style={{
          padding: '0.125rem 0.5rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          fontWeight: 500,
          color: cfg.color,
          background: cfg.bg,
          whiteSpace: 'nowrap',
        }}
      >
        {cfg.label}
      </span>
      {item.status === 'error' && item.error && (
        <span
          style={{ fontSize: '0.75rem', color: 'var(--color-error)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={item.error}
        >
          {item.error}
        </span>
      )}
      {item.status === 'done' && (
        <button
          onClick={handleDownload}
          style={{
            background: 'var(--color-primary)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            transition: 'all var(--transition-fast)',
          }}
          title="Download converted file"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
      )}
      <button
        onClick={handleRemove}
        disabled={disabled}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-text-tertiary)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          padding: '0.25rem',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color var(--transition-fast)',
          opacity: disabled ? 0.5 : 1,
        }}
        title="Remove file"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
