import type { ConvertFileItem } from '../hooks/useConversion';
import { formatFileSize } from '../utils/imageUtils';

interface QualityPreviewProps {
  item: ConvertFileItem;
}

export function QualityPreview({ item }: QualityPreviewProps) {
  const originalUrl = item.thumbnail;
  const compressedUrl = item.outputBlob ? URL.createObjectURL(item.outputBlob) : null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        padding: '1rem',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <PreviewCard label="Original" src={originalUrl} size={item.size} />
      {compressedUrl ? (
        <PreviewCard label="Compressed" src={compressedUrl} size={item.outputSize ?? 0} />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface-secondary)',
            color: 'var(--color-text-tertiary)',
            fontSize: '0.875rem',
            aspectRatio: '16 / 9',
          }}
        >
          No compressed preview yet
        </div>
      )}
    </div>
  );
}

interface PreviewCardProps {
  label: string;
  src: string;
  size: number;
}

function PreviewCard({ label, src, size }: PreviewCardProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: 'var(--color-surface-secondary)',
          aspectRatio: '16 / 9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={src}
          alt={label}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
        <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{label}</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>{formatFileSize(size)}</span>
      </div>
    </div>
  );
}
