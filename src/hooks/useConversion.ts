import { useState, useCallback, useRef } from 'react';
import { OutputFormat, convertFile, ConversionOptions } from '../services/conversionService';
import { generateThumbnail, validateImageType, generateId } from '../utils/imageUtils';

export type FileStatus = 'pending' | 'converting' | 'done' | 'error';

export interface ConvertFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  thumbnail: string;
  status: FileStatus;
  error?: string;
  outputSize?: number;
  outputBlob?: Blob;
}

export interface ConversionProgress {
  total: number;
  completed: number;
  current: number;
  percent: number;
  currentFile: string;
}

export function useConversion() {
  const [files, setFiles] = useState<ConvertFileItem[]>([]);
  const [format, setFormat] = useState<OutputFormat>('PNG');
  const [compression, setCompression] = useState(80);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ConversionProgress | null>(null);
  const abortRef = useRef(false);

  const addFiles = useCallback(async (incoming: File[]) => {
    const valid = incoming.filter((f) => validateImageType(f));

    if (valid.length !== incoming.length) {
      setError(`${incoming.length - valid.length} file(s) skipped - unsupported format`);
    }

    const newItems: ConvertFileItem[] = await Promise.all(
      valid.map(async (file) => {
        const thumbnail = await generateThumbnail(file);
        return {
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          thumbnail,
          status: 'pending' as FileStatus,
          error: undefined,
          outputSize: undefined,
          outputBlob: undefined,
        };
      }),
    );

    setFiles((prev) => [...prev, ...newItems]);
    setError(null);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item?.thumbnail) URL.revokeObjectURL(item.thumbnail);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const downloadFile = useCallback((item: ConvertFileItem) => {
    if (!item.outputBlob) return;
    const ext = format.toLowerCase();
    const baseName = item.name.replace(/\.[^.]+$/, '');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(item.outputBlob);
    a.download = `${baseName}.${ext}`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [format]);

  const downloadAll = useCallback(() => {
    files.forEach((item) => {
      if (item.status === 'done' && item.outputBlob) {
        downloadFile(item);
      }
    });
  }, [files, downloadFile]);

  const clearFiles = useCallback(() => {
    files.forEach((f) => {
      if (f.thumbnail.startsWith('blob:')) URL.revokeObjectURL(f.thumbnail);
    });
    setFiles([]);
  }, [files]);

  const convertAll = useCallback(async () => {
    if (files.length === 0 || isConverting) return;

    abortRef.current = false;
    setIsConverting(true);
    setError(null);

    const options: ConversionOptions = { format, quality: compression };
    let completed = 0;

    setProgress({
      total: files.length,
      completed: 0,
      current: 0,
      percent: 0,
      currentFile: '',
    });

    for (const item of files) {
      if (abortRef.current) break;

      if (item.status === 'done') {
        completed++;
        continue;
      }

      setFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'converting' as FileStatus } : f)),
      );

      setProgress((prev) =>
        prev ? { ...prev, currentFile: item.name } : null,
      );

      try {
        const result = await convertFile(item.file, options, (_p: number) => {
          setProgress((prev) =>
            prev ? { ...prev, current: _p } : null,
          );
        });

        completed++;

        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? { ...f, status: 'done' as FileStatus, outputSize: result.size, outputBlob: result.blob }
              : f,
          ),
        );

        setProgress({
          total: files.length,
          completed,
          current: 100,
          percent: Math.round((completed / files.length) * 100),
          currentFile: item.name,
        });
      } catch (err) {
        completed++;
        const message = err instanceof Error ? err.message : 'Conversion failed';

        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id ? { ...f, status: 'error' as FileStatus, error: message } : f,
          ),
        );

        setProgress({
          total: files.length,
          completed,
          current: 0,
          percent: Math.round((completed / files.length) * 100),
          currentFile: item.name,
        });
      }
    }

    setIsConverting(false);
  }, [files, format, compression, isConverting]);

  return {
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
  };
}
