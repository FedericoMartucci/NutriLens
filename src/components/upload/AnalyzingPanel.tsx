'use client';

/**
 * AnalyzingPanel — UPLOADING and PROCESSING render branches.
 * Pencil reference: `D02 — Loading` two-column body:
 *   - Left: dark preview with scan line (`#0F172A` bg + `#A3E635` line)
 *   - Right: <PipelineStepper>
 */
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { formatFileSize } from '@/lib/format-file-size';
import { PipelineStepper } from './PipelineStepper';
import { useFilePreviewUrl } from './hooks/use-file-preview-url';
import { useSimulatedPipelineStep } from './hooks/use-simulated-pipeline-step';

export interface AnalyzingPanelProps {
  file: File;
  progress: number;
  stage: 'UPLOADING' | 'PROCESSING';
}

export function AnalyzingPanel({ file, progress, stage }: AnalyzingPanelProps) {
  const previewUrl = useFilePreviewUrl(file);
  const percent = Math.round(progress * 100);
  const isImage = file.type.startsWith('image/');
  const currentStepIndex = useSimulatedPipelineStep(stage);

  return (
    <div
      className="flex flex-col gap-4"
      data-testid={stage === 'UPLOADING' ? 'uploading-state' : 'processing-state'}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-bold text-[var(--color-text)]">Analizando etiqueta</h2>
        <p className="text-[13px] text-[var(--color-text-muted)]">
          {file.name} · {formatFileSize(file.size)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
        <PreviewCanvas
          file={file}
          previewUrl={previewUrl}
          isImage={isImage}
          stage={stage}
          percent={percent}
        />
        <PipelineStepper currentStepIndex={currentStepIndex} />
      </div>
    </div>
  );
}

interface PreviewCanvasProps {
  file: File;
  previewUrl: string | null;
  isImage: boolean;
  stage: 'UPLOADING' | 'PROCESSING';
  percent: number;
}

function PreviewCanvas({ file, previewUrl, isImage, stage, percent }: PreviewCanvasProps) {
  return (
    <div
      className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[20px] bg-[var(--color-ink-900)] p-6 md:p-8"
      data-testid="analyzing-preview"
    >
      {isImage && previewUrl ? (
        <Image
          src={previewUrl}
          alt="Vista previa de la etiqueta"
          width={400}
          height={300}
          unoptimized
          className="max-h-72 max-w-full rotate-[-3deg] rounded-[12px] bg-white object-contain p-3 shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
        />
      ) : (
        <div className="flex h-56 w-72 rotate-[-3deg] flex-col items-start gap-2 rounded-[12px] bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
          <p className="text-lg font-bold text-[var(--color-text)]">{file.name}</p>
          <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
            PDF · {formatFileSize(file.size)}
          </p>
        </div>
      )}

      <div className="animate-scanline pointer-events-none absolute inset-x-10 top-1/2 h-[3px] origin-center rounded-full bg-[var(--color-accent-lime)] shadow-[0_0_12px_rgba(163,230,53,0.6)]" />

      {stage === 'UPLOADING' && <UploadProgressOverlay percent={percent} />}
    </div>
  );
}

function UploadProgressOverlay({ percent }: { percent: number }) {
  return (
    <div className="absolute inset-x-6 bottom-6 flex flex-col gap-2">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-white/80">
        <span>Subiendo archivo</span>
        <span>{percent}%</span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-white/20"
        role="progressbar"
        aria-label="Progreso del upload"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn('h-full bg-white transition-[width] duration-300')}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
