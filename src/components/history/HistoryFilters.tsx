'use client';

/**
 * <HistoryFilters> — toolbar de filtros del historial (US-24, spec E04 §6.4).
 *
 * Client Component porque maneja inputs interactivos. Cada cambio dispara
 * `router.push(buildHistoryUrl(nextFilters))` con `scroll: false` para que
 * back/forward del navegador funcione naturalmente. Page se resetea a 1 en
 * cualquier cambio (lo hace `setFilter` por nosotros).
 */
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';
import {
  buildHistoryUrl,
  setFilter,
  type HistoryFilters as HistoryFiltersValue,
} from '@/lib/products/history-filters';
import {
  ALERGENOS,
  CATEGORIAS,
  type Alergeno,
  type Categoria,
  type Riesgo,
} from '@schemas/product';
import { type Apto } from '@/lib/products/query-schema';

export interface HistoryFiltersProps {
  /** Current filter state, derived from the URL on the server. */
  value: HistoryFiltersValue;
}

const APTO_OPTIONS: ReadonlyArray<{ value: Apto; label: string }> = [
  { value: 'vegano', label: 'Apto vegano' },
  { value: 'celiaco', label: 'Apto celíaco' },
  { value: 'sin_lactosa', label: 'Sin lactosa' },
];

const RIESGO_OPTIONS: ReadonlyArray<{ value: Riesgo; label: string }> = [
  { value: 'bajo', label: 'Bajo' },
  { value: 'medio', label: 'Medio' },
  { value: 'alto', label: 'Alto' },
];

export function HistoryFilters({ value }: HistoryFiltersProps) {
  const router = useRouter();
  // Local `q` state so the input doesn't re-render the entire grid on each
  // keystroke. We push the URL only on form submit (Enter / Search).
  const [qDraft, setQDraft] = useState(value.q ?? '');

  // If the URL changes externally (e.g. clicking a chip), keep the input in sync.
  useEffect(() => {
    setQDraft(value.q ?? '');
  }, [value.q]);

  function go(next: HistoryFiltersValue) {
    router.push(buildHistoryUrl(next), { scroll: false });
  }

  function onSelectCategoria(e: ChangeEvent<HTMLSelectElement>) {
    const v = (e.target.value || undefined) as Categoria | undefined;
    go(setFilter(value, 'categoria', v));
  }
  function onSelectRiesgo(e: ChangeEvent<HTMLSelectElement>) {
    const v = (e.target.value || undefined) as Riesgo | undefined;
    go(setFilter(value, 'riesgo', v));
  }
  function onSelectAlergeno(e: ChangeEvent<HTMLSelectElement>) {
    const v = (e.target.value || undefined) as Alergeno | undefined;
    go(setFilter(value, 'alergeno', v));
  }
  function onSelectApto(e: ChangeEvent<HTMLSelectElement>) {
    const v = (e.target.value || undefined) as Apto | undefined;
    go(setFilter(value, 'apto', v));
  }
  function onSubmitSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    go(setFilter(value, 'q', qDraft.trim() || undefined));
  }

  return (
    <section
      aria-labelledby="history-filters-title"
      data-testid="history-filters"
      className="flex flex-col gap-3"
    >
      <h2 id="history-filters-title" className="sr-only">
        Filtros del historial
      </h2>

      <form
        role="search"
        action="/historial"
        method="get"
        onSubmit={onSubmitSearch}
        className="flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2"
      >
        <Icon name="scan-line" className="h-4 w-4 text-[var(--color-text-muted)]" />
        <input
          type="text"
          name="q"
          value={qDraft}
          onChange={(e) => setQDraft(e.target.value)}
          placeholder="Buscar producto…"
          aria-label="Buscar producto"
          data-testid="history-search-input"
          className="flex-1 bg-transparent text-[14px] placeholder:text-[var(--color-text-muted)] focus:outline-none"
        />
        {/* Preserve the rest of the filters as hidden inputs so submitting
            the form without JS reaches the same URL shape. */}
        {value.categoria && <input type="hidden" name="categoria" value={value.categoria} />}
        {value.riesgo && <input type="hidden" name="riesgo" value={value.riesgo} />}
        {value.alergeno && <input type="hidden" name="alergeno" value={value.alergeno} />}
        {value.apto && <input type="hidden" name="apto" value={value.apto} />}
      </form>

      <div
        className="flex flex-wrap gap-2"
        role="toolbar"
        aria-label="Filtros"
        data-testid="history-filter-toolbar"
      >
        <FilterSelect
          name="categoria"
          label="Categoría"
          value={value.categoria ?? ''}
          onChange={onSelectCategoria}
          testId="history-filter-categoria"
          options={CATEGORIAS.map((c) => ({ value: c, label: c }))}
        />
        <FilterSelect
          name="riesgo"
          label="Riesgo"
          value={value.riesgo ?? ''}
          onChange={onSelectRiesgo}
          testId="history-filter-riesgo"
          options={RIESGO_OPTIONS}
        />
        <FilterSelect
          name="alergeno"
          label="Alérgeno"
          value={value.alergeno ?? ''}
          onChange={onSelectAlergeno}
          testId="history-filter-alergeno"
          options={ALERGENOS.map((a) => ({ value: a, label: a }))}
        />
        <FilterSelect
          name="apto"
          label="Aptitud"
          value={value.apto ?? ''}
          onChange={onSelectApto}
          testId="history-filter-apto"
          options={APTO_OPTIONS}
        />
      </div>
    </section>
  );
}

interface FilterSelectProps {
  name: string;
  label: string;
  value: string;
  testId: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: ReadonlyArray<{ value: string; label: string }>;
}

function FilterSelect({ name, label, value, testId, onChange, options }: FilterSelectProps) {
  const active = value !== '';
  return (
    <label className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
      {label}
      <select
        name={name}
        value={value}
        onChange={onChange}
        data-testid={testId}
        aria-label={label}
        className={cn(
          'min-h-[44px] min-w-[140px] rounded-full border bg-white px-3 py-2 text-[13px] font-medium capitalize transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
          active
            ? 'border-[var(--color-primary)] text-[var(--color-primary-strong)]'
            : 'border-[var(--color-border)] text-[var(--color-text)]',
        )}
      >
        <option value="">Todas</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
