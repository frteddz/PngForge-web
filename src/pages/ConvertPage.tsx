import { useCallback, useMemo } from 'react';
import { DropZone } from '../components/DropZone';
import { FormatSelector } from '../components/FormatSelector';
import { CompressionSlider } from '../components/CompressionSlider';
import { FileList } from '../components/FileList';
import { ProgressBar } from '../components/ProgressBar';
import { useConversion } from '../hooks/useConversion';
import type { ConvertFileItem } from '../hooks/useConversion';

export function ConvertPage() {
  const {
    files,
    addFiles,
    removeFile,
    clearFiles,
    downloadFile,
    downloadAll,
    format,
    setFormat,
    compression,
    setCompression,
    convertAll,
    progress,
    isConverting,
    error,
    setError,
  } = useConversion();

  const handleFilesAdded = useCallback((incoming: File[]) => addFiles(incoming), [addFiles]);
  const handleDownload = useCallback((item: ConvertFileItem) => downloadFile(item), [downloadFile]);
  const doneFiles = useMemo(() => files.filter((f) => f.status === 'done'), [files]);
  const lastDoneFile = useMemo(() => doneFiles[doneFiles.length - 1] ?? null, [doneFiles]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1.5rem',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {files.length === 0 && !isConverting && (
        <div
          className="animate-fade-in"
          style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginBottom: '0.75rem' }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>No images loaded</p>
          <p style={{ fontSize: '0.875rem' }}>Drag and drop images above to get started</p>
        </div>
      )}

      <DropZone onFilesAdded={handleFilesAdded} disabled={isConverting} />

      {files.length > 0 && (
        <>
          <div
            className="animate-slide-up"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9375rem' }}>
                Output Settings
              </span>
              <button
                onClick={clearFiles}
                disabled={isConverting}
                style={{
                  background: 'none',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                  padding: '0.375rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8125rem',
                  cursor: isConverting ? 'not-allowed' : 'pointer',
                  transition: 'all var(--transition-normal)',
                  opacity: isConverting ? 0.5 : 1,
                }}
              >
                Clear All
              </button>
            </div>
            <FormatSelector value={format} onChange={setFormat} disabled={isConverting} />
            <CompressionSlider value={compression} onChange={setCompression} disabled={isConverting} />
          </div>

          <FileList files={files} onRemove={removeFile} onDownload={handleDownload} disabled={isConverting} />

          {lastDoneFile && !isConverting && (
            <div
              className="animate-fade-in"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-success-light)',
                color: 'var(--color-success)',
                fontSize: '0.875rem',
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              <span>Conversion complete! {doneFiles.length}/{files.length} files processed.</span>
              {doneFiles.length > 0 && (
                <button
                  onClick={downloadAll}
                  style={{
                    padding: '0.375rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-success)',
                    color: '#fff',
                    border: 'none',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download All
                </button>
              )}
            </div>
          )}

          {progress && isConverting && <ProgressBar progress={progress} />}

          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-error-light)',
                color: 'var(--color-error)',
                fontSize: '0.875rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-error)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                Dismiss
              </button>
            </div>
          )}

          <button
            onClick={convertAll}
            disabled={isConverting || files.length === 0}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: 'var(--radius-md)',
              background: isConverting ? 'var(--color-border)' : 'var(--color-primary)',
              color: isConverting ? 'var(--color-text-tertiary)' : '#fff',
              border: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: isConverting ? 'not-allowed' : 'pointer',
              transition: 'all var(--transition-normal)',
              alignSelf: 'center',
              minWidth: '200px',
            }}
          >
            {isConverting ? 'Converting...' : `Convert All (${files.length})`}
          </button>
        </>
      )}
    </div>
  );
}
