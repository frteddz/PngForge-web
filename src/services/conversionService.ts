export type OutputFormat = 'PNG' | 'JPG' | 'WebP' | 'AVIF';

export interface ConversionOptions {
  format: OutputFormat;
  quality: number;
}

export interface ConversionResult {
  blob: Blob;
  size: number;
  format: OutputFormat;
}

function simulateConversion(
  file: File,
  options: ConversionOptions,
  onProgress: (progress: number) => void,
): Promise<ConversionResult> {
  return new Promise((resolve, reject) => {
    const totalSteps = 10;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      onProgress(Math.round((step / totalSteps) * 100));

      if (step >= totalSteps) {
        clearInterval(interval);

        const canvas = document.createElement('canvas');
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Failed to get canvas context'));
            return;
          }
          ctx.drawImage(img, 0, 0);

          const mimeType =
            options.format === 'PNG' ? 'image/png' :
            options.format === 'JPG' ? 'image/jpeg' :
            options.format === 'WebP' ? 'image/webp' :
            'image/avif';

          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(objectUrl);
              if (blob) {
                resolve({ blob, size: blob.size, format: options.format });
              } else {
                reject(new Error(`Failed to encode as ${options.format}`));
              }
            },
            mimeType,
            options.format === 'PNG' ? undefined : options.quality / 100,
          );
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Failed to load image for conversion'));
        };

        img.src = objectUrl;
      }
    }, 100);
  });
}

export async function convertFile(
  file: File,
  options: ConversionOptions,
  onProgress: (progress: number) => void,
): Promise<ConversionResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error(`Invalid file type: ${file.type}`);
  }

  try {
    return await simulateConversion(file, options, onProgress);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown conversion error';
    throw new Error(message);
  }
}
