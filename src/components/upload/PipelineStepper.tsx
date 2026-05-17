/**
 * <PipelineStepper> — vertical 5-step panel used inside <AnalyzingPanel>.
 *
 * Pencil reference: `D02 — Loading` right column (`sI4Fp` dlSide2):
 *   - Done step: bg `var(--color-success-bg)`, white check on `--color-success-strong` 32px circle
 *   - Active step: white bg + `#22c55e` stroke 2px + spinning arc
 *   - Pending step: white bg + ink-200 border + muted icon
 *
 * Order matches the spec (E06 §3 / pipelineTrace.StepName).
 */
import { Icon, type IconName } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

export type PipelineStepStatus = 'done' | 'active' | 'pending';

export interface PipelineStep {
  id: string;
  title: string;
  /** Optional secondary line — used by the active step in the wireframe. */
  subtitle?: string;
  pendingIcon: IconName;
}

const STEPS: ReadonlyArray<PipelineStep> = [
  { id: 'validate', title: 'Validación de etiqueta', pendingIcon: 'check' },
  { id: 'extract', title: 'OCR + extracción multimodal', pendingIcon: 'check' },
  {
    id: 'allergens',
    title: 'Clasificando alérgenos…',
    subtitle: 'Identificando ingredientes y sellos.',
    pendingIcon: 'check',
  },
  { id: 'risk', title: 'Cálculo de riesgo', pendingIcon: 'shield-check' },
  { id: 'explain', title: 'Generar explicación + guardar', pendingIcon: 'sparkles' },
];

export const PIPELINE_STEPS_COUNT = STEPS.length;

export interface PipelineStepperProps {
  /**
   * Index of the step currently in progress.
   * 0..STEPS.length-1 → that step is `active`, all before are `done`, all after are `pending`.
   * `STEPS.length` → every step is `done` (terminal flash before redirect).
   */
  currentStepIndex: number;
}

export function PipelineStepper({ currentStepIndex }: PipelineStepperProps) {
  return (
    <div
      data-testid="pipeline-stepper"
      className="flex flex-col gap-3.5 rounded-[20px] border border-[var(--color-border)] bg-white p-5 md:p-6"
    >
      <header className="flex flex-col gap-0.5">
        <h2 className="text-[16px] font-bold text-[var(--color-text)]">Pipeline en curso</h2>
        <p className="text-[12px] text-[var(--color-text-muted)]">8–15s estimado</p>
      </header>

      <ol className="flex flex-col gap-3">
        {STEPS.map((step, idx) => (
          <StepCard key={step.id} step={step} status={statusFor(idx, currentStepIndex)} />
        ))}
      </ol>
    </div>
  );
}

function statusFor(stepIdx: number, currentIdx: number): PipelineStepStatus {
  if (currentIdx >= STEPS.length) return 'done';
  if (stepIdx < currentIdx) return 'done';
  if (stepIdx === currentIdx) return 'active';
  return 'pending';
}

interface StepCardProps {
  step: PipelineStep;
  status: PipelineStepStatus;
}

function StepCard({ step, status }: StepCardProps) {
  return (
    <li
      data-testid={`pipeline-step-${step.id}`}
      data-status={status}
      className={cn(
        'flex items-center gap-3 rounded-[14px] p-3.5 transition-colors',
        status === 'done' && 'bg-[var(--color-success-bg)]',
        status === 'active' && 'border-2 border-[var(--color-primary)] bg-white',
        status === 'pending' && 'border border-[var(--color-border)] bg-white',
      )}
    >
      <StepIconBubble status={status} pendingIcon={step.pendingIcon} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p
          className={cn(
            'truncate text-[13px] font-bold',
            status === 'pending' ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text)]',
          )}
        >
          {step.title}
        </p>
        {status === 'done' && <p className="text-[10px] text-[var(--color-text-muted)]">Listo</p>}
        {status === 'active' && step.subtitle && (
          <p className="text-[10px] font-medium text-[var(--color-primary-strong)]">
            {step.subtitle}
          </p>
        )}
      </div>
    </li>
  );
}

function StepIconBubble({
  status,
  pendingIcon,
}: {
  status: PipelineStepStatus;
  pendingIcon: IconName;
}) {
  if (status === 'done') {
    return (
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-success-strong)] text-white">
        <Icon name="check" strokeWidth={2.5} className="h-4 w-4" />
      </span>
    );
  }
  if (status === 'active') {
    return (
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
        <SpinnerArc />
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-muted)]">
      <Icon name={pendingIcon} strokeWidth={2} className="h-4 w-4" />
    </span>
  );
}

function SpinnerArc() {
  // 270° arc, animate-spin. Matches Pencil `dlSt3i` (ellipse startAngle 90, sweepAngle 270).
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-spin">
      <path
        d="M21 12a9 9 0 1 1-3-6.7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
