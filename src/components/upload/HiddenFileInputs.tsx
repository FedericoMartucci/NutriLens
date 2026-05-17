'use client';

import type { ChangeEvent, RefObject } from 'react';

export interface HiddenFileInputsProps {
  cameraRef: RefObject<HTMLInputElement | null>;
  galleryRef: RefObject<HTMLInputElement | null>;
  pdfRef: RefObject<HTMLInputElement | null>;
  onFileSelected: (file: File) => void;
}

/**
 * Three separate inputs so each CTA gets the right mobile semantics:
 *   - Cámara uses `capture="environment"` (back camera on phones)
 *   - Galería filters to images
 *   - PDF filters to PDFs
 * On desktop they all behave like a normal file picker.
 */
export function HiddenFileInputs({
  cameraRef,
  galleryRef,
  pdfRef,
  onFileSelected,
}: HiddenFileInputsProps) {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFileSelected(f);
    // Reset so the same file can be re-selected if needed (e.g. after RETRY).
    e.target.value = '';
  };
  return (
    <>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        aria-label="Tomar foto con la cámara"
        onChange={onChange}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        aria-label="Subir foto o PDF"
        onChange={onChange}
      />
      <input
        ref={pdfRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        aria-label="Subir PDF"
        onChange={onChange}
      />
    </>
  );
}
