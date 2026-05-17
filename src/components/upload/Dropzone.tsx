'use client';

/**
 * Dropzone — IDLE and SELECTED render branches.
 * Pencil reference: `ekBlR` Component/UploadZone — solid green border,
 * `#F0FDF4` bg, cornerRadius 24, padding 40, gap 20.
 */
import { useState } from 'react';
import type { DragEvent, RefObject } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';
import { formatFileSize } from '@/lib/format-file-size';
import type { UploadState } from '@/lib/upload/machine';
import { HiddenFileInputs } from './HiddenFileInputs';

export interface DropzoneProps {
  state: Extract<UploadState, { kind: 'IDLE' | 'SELECTED' }>;
  onFileSelected: (file: File) => void;
  onSubmit: () => void;
  onClear: () => void;
  cameraInputRef: RefObject<HTMLInputElement | null>;
  galleryInputRef: RefObject<HTMLInputElement | null>;
  pdfInputRef: RefObject<HTMLInputElement | null>;
}

export function Dropzone({
  state,
  onFileSelected,
  onSubmit,
  onClear,
  cameraInputRef,
  galleryInputRef,
  pdfInputRef,
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const selected = state.kind === 'SELECTED' ? state.file : null;

  return (
    <div
      data-testid="dropzone"
      onDragOver={(e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFileSelected(f);
      }}
      style={{ minHeight: 420 }}
      className={cn(
        'flex flex-col items-center justify-center gap-5 rounded-[24px] border-2 p-10 text-center transition-colors',
        isDragging
          ? 'border-[var(--color-primary-strong)] bg-[var(--color-risk-low-bg)]'
          : 'border-[var(--color-primary-border)] bg-[var(--color-primary-soft)]',
      )}
    >
      <CloudUploadBadge />

      {selected ? (
        <SelectedFilePreview file={selected} onSubmit={onSubmit} onClear={onClear} />
      ) : (
        <IdleControls
          onCamera={() => cameraInputRef.current?.click()}
          onGallery={() => galleryInputRef.current?.click()}
          onPdf={() => pdfInputRef.current?.click()}
        />
      )}

      <HiddenFileInputs
        cameraRef={cameraInputRef}
        galleryRef={galleryInputRef}
        pdfRef={pdfInputRef}
        onFileSelected={onFileSelected}
      />
    </div>
  );
}

function CloudUploadBadge() {
  // Pencil `kx3k0` — 88x88 white circle, drop shadow rgba(22,163,74,0.2) blur 12 y 4.
  return (
    <div
      className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-white"
      style={{ boxShadow: '0 4px 12px 0 rgba(22, 163, 74, 0.2)' }}
    >
      <Icon name="cloud-upload" strokeWidth={2} className="h-10 w-10 text-[var(--color-primary)]" />
    </div>
  );
}

function IdleControls({
  onCamera,
  onGallery,
  onPdf,
}: {
  onCamera: () => void;
  onGallery: () => void;
  onPdf: () => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-[var(--color-text)] md:text-xl">
          Arrastrá una foto o PDF acá
        </h2>
        <p className="text-[13px] text-[var(--color-text-muted)]">
          O elegí cómo cargar la etiqueta
        </p>
      </div>

      <div
        className="flex flex-wrap items-center justify-center gap-3 pt-2"
        data-testid="upload-cta-group"
      >
        <Button onClick={onCamera}>
          <Icon name="camera" strokeWidth={2.25} className="h-4 w-4" />
          Cámara
        </Button>
        <Button variant="ghost" onClick={onGallery}>
          <Icon name="image" strokeWidth={2.25} className="h-4 w-4" />
          Galería
        </Button>
        <Button variant="ghost" onClick={onPdf}>
          <Icon name="file-text" strokeWidth={2.25} className="h-4 w-4" />
          PDF
        </Button>
      </div>
    </>
  );
}

function SelectedFilePreview({
  file,
  onSubmit,
  onClear,
}: {
  file: File;
  onSubmit: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4" data-testid="selected-file">
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-[var(--color-text)]">Archivo cargado</p>
        <p className="text-sm text-[var(--color-text-muted)]">{file.name}</p>
        <p className="text-xs text-[var(--color-text-muted)]">
          {formatFileSize(file.size)} · {file.type}
        </p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-2">
        <Button onClick={onSubmit}>Analizar producto</Button>
        <Button variant="ghost" onClick={onClear}>
          Elegir otro archivo
        </Button>
      </div>
    </div>
  );
}
