'use client';

/**
 * <UploadFlow> — orchestrator for the upload state machine.
 *
 * Spec: `docs/specs/E01-onboarding-y-upload.md §7`.
 * Wireframes: `D01-Home-Upload` (IDLE/SELECTED) and `D02-Loading`
 * (UPLOADING/PROCESSING).
 *
 * Render branches live in sibling components — this file's job is the
 * state machine, the side effects (XHR, hash, router, toasts) and picking
 * which branch to mount.
 */
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { AnalyzingPanel } from '@/components/upload/AnalyzingPanel';
import { Dropzone } from '@/components/upload/Dropzone';
import { HiddenFileInputs } from '@/components/upload/HiddenFileInputs';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { useToast } from '@/components/ui/Toaster';
import { mapErrorCodeToUi, resolveErrorDescription } from '@/lib/upload/error-ui-mapping';
import { computeFileHash } from '@/lib/upload/hash';
import { initialState, transition, type UploadEvent, type UploadState } from '@/lib/upload/machine';
import { validateClientFile } from '@/lib/upload/validate-client';
import { xhrUpload } from '@/lib/upload/xhr-upload';

function reducer(state: UploadState, event: UploadEvent): UploadState {
  return transition(state, event);
}

export function UploadFlow() {
  const router = useRouter();
  const { showToast } = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const errorHeadingRef = useRef<HTMLHeadingElement>(null);

  // Redirect once we hit the terminal COMPLETED state.
  useEffect(() => {
    if (state.kind === 'COMPLETED') {
      router.push(`/analizar/${state.id}`);
    }
  }, [state, router]);

  // A11y: move focus to the error heading when ERROR appears so keyboard
  // and screen-reader users land on the recovery affordances immediately.
  useEffect(() => {
    if (state.kind === 'ERROR') {
      errorHeadingRef.current?.focus();
    }
  }, [state.kind]);

  const handleFileSelected = useCallback(
    (file: File) => {
      const result = validateClientFile(file);
      if (!result.ok) {
        const ui = mapErrorCodeToUi(result.error);
        showToast({ variant: 'error', title: ui.title, description: result.reason });
        dispatch({
          type: 'FAIL',
          error: result.error,
          reason: result.reason,
          requestId: null,
        });
        return;
      }
      dispatch({ type: 'SELECT', file });
    },
    [showToast],
  );

  const handleSubmit = useCallback(async () => {
    if (state.kind !== 'SELECTED') return;
    const file = state.file;

    dispatch({ type: 'SUBMIT' });
    showToast({
      variant: 'info',
      title: 'Analizando…',
      description: 'Esto puede tardar unos segundos.',
    });

    let fileHash: string;
    try {
      fileHash = await computeFileHash(file);
    } catch {
      const reason = 'No pudimos preparar el archivo para subirlo.';
      showToast({ variant: 'error', title: 'Algo salió mal', description: reason });
      dispatch({ type: 'FAIL', error: 'internal_error', reason, requestId: null });
      return;
    }

    const result = await xhrUpload({
      file,
      fileHash,
      onProgress: (progress) => dispatch({ type: 'PROGRESS', progress }),
      onUploadDone: () => dispatch({ type: 'UPLOAD_DONE' }),
    });

    if (result.kind === 'success') {
      showToast({
        variant: 'success',
        title: 'Producto guardado',
        description: 'Lo encontrás en tu historial.',
      });
      dispatch({ type: 'COMPLETE', id: result.id });
    } else {
      const ui = mapErrorCodeToUi(result.error);
      showToast({
        variant: 'error',
        title: ui.title,
        description: resolveErrorDescription(result.error, result.reason),
      });
      dispatch({
        type: 'FAIL',
        error: result.error,
        reason: result.reason,
        requestId: result.requestId,
      });
    }
  }, [state, showToast]);

  const handleRetry = useCallback(() => {
    if (state.kind !== 'ERROR') return;
    const ui = mapErrorCodeToUi(state.error);
    if (ui.actionKind === 'retry_same' && state.file) {
      dispatch({ type: 'SELECT', file: state.file });
      return;
    }
    dispatch({ type: 'RETRY' });
    galleryInputRef.current?.click();
  }, [state]);

  const handleNewFile = useCallback(() => {
    dispatch({ type: 'RETRY' });
    galleryInputRef.current?.click();
  }, []);

  // ---- render branches ---------------------------------------------------

  if (state.kind === 'ERROR') {
    const ui = mapErrorCodeToUi(state.error);
    const description = resolveErrorDescription(state.error, state.reason);
    return (
      <div className="flex flex-col gap-3">
        <ErrorState
          icon="!"
          title={ui.title}
          description={description}
          headingRef={errorHeadingRef}
          primaryAction={{ label: ui.primaryActionLabel, onClick: handleRetry }}
          {...(ui.secondaryActionLabel
            ? { secondaryAction: { label: ui.secondaryActionLabel, onClick: handleNewFile } }
            : {})}
        />
        {state.requestId && (
          <p className="text-center text-xs text-[var(--color-text-muted)]">
            ID de la solicitud: <code className="font-mono">{state.requestId}</code>
          </p>
        )}
        <HiddenFileInputs
          cameraRef={cameraInputRef}
          galleryRef={galleryInputRef}
          pdfRef={pdfInputRef}
          onFileSelected={handleFileSelected}
        />
      </div>
    );
  }

  if (state.kind === 'UPLOADING' || state.kind === 'PROCESSING') {
    return (
      <AnalyzingPanel
        file={state.file}
        progress={state.kind === 'UPLOADING' ? state.progress : 1}
        stage={state.kind}
      />
    );
  }

  if (state.kind === 'COMPLETED') {
    // Brief flash before the router replaces the page.
    return (
      <Card padding="lg">
        <div className="flex flex-col items-center gap-4 text-center" data-testid="completed-state">
          <p className="text-base font-semibold text-[var(--color-text)]">Análisis completado</p>
        </div>
      </Card>
    );
  }

  return (
    <Dropzone
      state={state}
      onFileSelected={handleFileSelected}
      onSubmit={handleSubmit}
      onClear={() => dispatch({ type: 'CLEAR' })}
      cameraInputRef={cameraInputRef}
      galleryInputRef={galleryInputRef}
      pdfInputRef={pdfInputRef}
    />
  );
}
