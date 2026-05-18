/**
 * `<ChatPageClient>` — client component que orquesta la pantalla `/chat`.
 *
 * Mantiene en memoria la lista de mensajes (spec §9.3: NO persistimos en DB),
 * el estado del pipeline (IDLE/THINKING/ERROR) y el último mensaje del usuario
 * para reintento.
 *
 * AC cubiertos:
 *   - US-27 §1: input → user bubble → thinking → respuesta del asistente.
 *   - US-27 §2: mensajes previos se mantienen visibles en la sesión.
 *   - US-27 §3: botón "Nueva conversación" limpia el thread.
 *   - US-32: chips de productos referenciados aparecen debajo de la respuesta.
 *   - US-30 §2: CTA "Analizar nuevo producto" cuando fallback.showAnalyzeCta.
 *   - §9.4: estados visuales IDLE / THINKING / ERROR con retry.
 *   - §9.5: sugerencias iniciales cuando el thread está vacío.
 */
'use client';

import { useCallback, useReducer } from 'react';
import { ApiError } from '@schemas/errors';
import { AppShell } from '@/components/layout/AppShell';
import { ChatErrorBanner } from '@/components/chat/ChatErrorBanner';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatHero } from '@/components/chat/ChatHero';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatThread } from '@/components/chat/ChatThread';
import type { ChatMessage, ChatStatus } from '@/components/chat/types';
import { fetchChat } from '@/lib/chat/fetch-chat';
import type { ChatApiResponse } from '@/lib/chat/response';

interface ChatPageClientProps {
  productsInBase: number;
  historialCount: number;
  /** Inyectable para tests; default usa `fetchChat` real. */
  fetchImpl?: typeof fetchChat;
}

interface State {
  messages: ChatMessage[];
  status: ChatStatus;
  error: string | null;
  lastUserQuestion: string | null;
}

type Action =
  | { type: 'submit'; userMessage: ChatMessage; question: string }
  | { type: 'success'; assistant: ChatMessage }
  | { type: 'error'; message: string }
  | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'submit':
      return {
        messages: [...state.messages, action.userMessage],
        status: 'THINKING',
        error: null,
        lastUserQuestion: action.question,
      };
    case 'success':
      return {
        messages: [...state.messages, action.assistant],
        status: 'IDLE',
        error: null,
        lastUserQuestion: state.lastUserQuestion,
      };
    case 'error':
      return { ...state, status: 'ERROR', error: action.message };
    case 'reset':
      return { messages: [], status: 'IDLE', error: null, lastUserQuestion: null };
    default:
      return state;
  }
}

const INITIAL_STATE: State = {
  messages: [],
  status: 'IDLE',
  error: null,
  lastUserQuestion: null,
};

export function ChatPageClient({
  productsInBase,
  historialCount,
  fetchImpl = fetchChat,
}: ChatPageClientProps) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const handleSubmit = useCallback(
    async (question: string) => {
      const userMessage: ChatMessage = {
        role: 'user',
        id: makeId(),
        text: question,
      };
      dispatch({ type: 'submit', userMessage, question });

      try {
        const res: ChatApiResponse = await fetchImpl(question);
        dispatch({
          type: 'success',
          assistant: {
            role: 'assistant',
            id: makeId(),
            text: res.answer,
            products: res.products,
            fallback: res.fallback,
          },
        });
      } catch (err) {
        const reason =
          err instanceof ApiError ? err.reason : 'Algo salió mal. Probá de nuevo en unos segundos.';
        dispatch({ type: 'error', message: reason });
      }
    },
    [fetchImpl],
  );

  const handleRetry = useCallback(() => {
    if (state.lastUserQuestion) void handleSubmit(state.lastUserQuestion);
  }, [state.lastUserQuestion, handleSubmit]);

  const handleReset = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  const hasMessages = state.messages.length > 0;
  const inputDisabled = state.status === 'THINKING';

  return (
    <AppShell active="chat" historialCount={historialCount}>
      {/*
        Spec E06 §6.3: mobile usa el thread full-width; desktop centra el
        chat con max-width 720px para que las burbujas no queden estiradas
        a lo ancho del viewport.
      */}
      <div
        data-testid="chat-container"
        className="mx-auto flex h-full min-h-[calc(100vh-8rem)] w-full max-w-[720px] flex-col gap-4 md:min-h-[calc(100vh-2rem)]"
      >
        <ChatHeader
          productsInBase={productsInBase}
          hasMessages={hasMessages}
          onReset={handleReset}
        />

        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto pb-2">
            {!hasMessages && state.status !== 'THINKING' ? (
              <ChatHero onPick={handleSubmit} />
            ) : (
              <ChatThread messages={state.messages} status={state.status} />
            )}
          </div>

          {state.error && state.status === 'ERROR' && (
            <ChatErrorBanner
              message={state.error}
              onRetry={handleRetry}
              canRetry={state.lastUserQuestion !== null}
            />
          )}

          <div className="sticky bottom-0 bg-[var(--color-bg)] pt-2">
            <ChatInput onSubmit={handleSubmit} disabled={inputDisabled} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `m-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}
