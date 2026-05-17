'use client';

import { useEffect, useState } from 'react';

/**
 * Builds an object URL for the image preview shown in the analyzing panel.
 * Skips PDFs (no inline preview). Always revokes the URL on cleanup so we
 * don't leak across re-uploads.
 */
export function useFilePreviewUrl(file: File): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file.type.startsWith('image/')) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return url;
}
