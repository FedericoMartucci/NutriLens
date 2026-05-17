import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorState } from '@/components/ui/ErrorState';

describe('ErrorState', () => {
  it('renders the title', () => {
    render(<ErrorState title="Algo salió mal" />);
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<ErrorState title="Error" description="No pudimos procesar tu pedido." />);
    expect(screen.getByText('No pudimos procesar tu pedido.')).toBeInTheDocument();
  });

  it('does not render description when omitted', () => {
    const { queryByText } = render(<ErrorState title="Error" />);
    expect(queryByText('No pudimos procesar tu pedido.')).not.toBeInTheDocument();
  });

  it('has role=status for screen reader announcements', () => {
    render(<ErrorState title="Error" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<ErrorState title="Error" icon="🚫" />);
    expect(screen.getByText('🚫')).toBeInTheDocument();
  });

  it('does not render icon wrapper when icon is omitted', () => {
    const { container } = render(<ErrorState title="Error" />);
    const iconWrapper = container.querySelector('.text-4xl');
    expect(iconWrapper).not.toBeInTheDocument();
  });

  it('renders primary action button with correct label', () => {
    render(<ErrorState title="Error" primaryAction={{ label: 'Reintentar', onClick: vi.fn() }} />);
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
  });

  it('primary action button triggers callback on click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ErrorState title="Error" primaryAction={{ label: 'Reintentar', onClick }} />);
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders secondary action button with correct label', () => {
    render(<ErrorState title="Error" secondaryAction={{ label: 'Volver', onClick: vi.fn() }} />);
    expect(screen.getByRole('button', { name: 'Volver' })).toBeInTheDocument();
  });

  it('secondary action button triggers callback on click', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<ErrorState title="Error" secondaryAction={{ label: 'Volver', onClick: onBack }} />);
    await user.click(screen.getByRole('button', { name: 'Volver' }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('renders both actions when both are provided', () => {
    render(
      <ErrorState
        title="Error"
        primaryAction={{ label: 'Reintentar', onClick: vi.fn() }}
        secondaryAction={{ label: 'Volver', onClick: vi.fn() }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver' })).toBeInTheDocument();
  });

  it('renders no buttons when no actions are provided', () => {
    render(<ErrorState title="Error" />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('primary action does not call secondary callback and vice versa', async () => {
    const user = userEvent.setup();
    const onPrimary = vi.fn();
    const onSecondary = vi.fn();
    render(
      <ErrorState
        title="Error"
        primaryAction={{ label: 'Reintentar', onClick: onPrimary }}
        secondaryAction={{ label: 'Volver', onClick: onSecondary }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onPrimary).toHaveBeenCalledOnce();
    expect(onSecondary).not.toHaveBeenCalled();
  });

  it('has aria-live=polite', () => {
    render(<ErrorState title="Error" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('applies error background color', () => {
    const { container } = render(<ErrorState title="Error" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('var(--color-risk-high-bg)');
  });

  it('heading is focusable (tabIndex=-1) so owners can move focus on transition', () => {
    render(<ErrorState title="Error" />);
    const heading = screen.getByRole('heading', { name: 'Error' });
    expect(heading).toHaveAttribute('tabindex', '-1');
  });

  it('accepts a headingRef and lets the owner focus the heading', () => {
    function Owner() {
      const ref = useRef<HTMLHeadingElement>(null);
      return (
        <>
          <button type="button" onClick={() => ref.current?.focus()}>
            focus error
          </button>
          <ErrorState title="Algo salió mal" headingRef={ref} />
        </>
      );
    }
    render(<Owner />);
    const button = screen.getByRole('button', { name: 'focus error' });
    button.click();
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Algo salió mal' }));
  });
});
