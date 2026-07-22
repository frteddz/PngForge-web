const VALID_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'] as const;

export type ImageMimeType = typeof VALID_TYPES[number];

export interface FileMeta {
  id: string;
  name: string;
  size: number;
  type: ImageMimeType;
  file: File;
  thumbnail: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const factor = 1024;
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(factor)), units.length - 1);
  const value = bytes / Math.pow(factor, unitIndex);
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function validateImageType(file: File): file is File & { type: ImageMimeType } {
  return VALID_TYPES.includes(file.type as ImageMimeType);
}

export function generateThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getFormatFromMime(mime: ImageMimeType): 'PNG' | 'JPG' | 'WebP' | 'AVIF' {
  const map: Record<ImageMimeType, 'PNG' | 'JPG' | 'WebP' | 'AVIF'> = {
    'image/png': 'PNG',
    'image/jpeg': 'JPG',
    'image/webp': 'WebP',
    'image/avif': 'AVIF',
  };
  return map[mime];
}

export function getMimeFromFormat(format: 'PNG' | 'JPG' | 'WebP' | 'AVIF'): ImageMimeType {
  const map: Record<'PNG' | 'JPG' | 'WebP' | 'AVIF', ImageMimeType> = {
    PNG: 'image/png',
    JPG: 'image/jpeg',
    WebP: 'image/webp',
    AVIF: 'image/avif',
  };
  return map[format];
}

export function getExtensionFromFormat(format: 'PNG' | 'JPG' | 'WebP' | 'AVIF'): string {
  const map: Record<'PNG' | 'JPG' | 'WebP' | 'AVIF', string> = {
    PNG: '.png',
    JPG: '.jpg',
    WebP: '.webp',
    AVIF: '.avif',
  };
  return map[format];
}
