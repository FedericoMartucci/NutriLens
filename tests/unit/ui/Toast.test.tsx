import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Toast } from '@/components/ui/Toast';

describe('<Toast>', () => {
  it('renders the title and (optional) description', () => {
    render(<Toast variant="success" title="Listo" description="Producto guardado" />);
    expect(screen.getByText('Listo')).toBeInTheDocument();
    expect(screen.getByText('Producto guardado')).toBeInTheDocument();
  });

  it('exposes role=status for screen readers', () => {
    render(<Toast variant="info" title="Cargando" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('matches the variant via data-testid and data-variant', () => {
    const { rerender } = render(<Toast variant="success" title="ok" />);
    expect(screen.getByTestId('toast-success')).toHaveAttribute('data-variant', 'success');

    rerender(<Toast variant="error" title="x" />);
    expect(screen.getByTestId('toast-error')).toHaveAttribute('data-variant', 'error');

    rerender(<Toast variant="warning" title="x" />);
    expect(screen.getByTestId('toast-warning')).toHaveAttribute('data-variant', 'warning');

    rerender(<Toast variant="info" title="x" />);
    expect(screen.getByTestId('toast-info')).toHaveAttribute('data-variant', 'info');
  });

  it('applies the variant CSS-vars class so all variants share the same markup', () => {
    const { rerender } = render(<Toast variant="success" title="t" />);
    expect(screen.getByTestId('toast-success').className).toContain('toast-variant-success');

    rerender(<Toast variant="error" title="t" />);
    expect(screen.getByTestId('toast-error').className).toContain('toast-variant-error');
  });

  it('every variant renders the same w-full root so toasts stack uniformly', () => {
    const variants = ['success', 'error', 'warning', 'info'] as const;
    for (const variant of variants) {
      const { container, unmount } = render(<Toast variant={variant} title="x" />);
      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain('w-full');
      unmount();
    }
  });

  it('renders dismiss button only when onDismiss is provided', () => {
    const { rerender } = render(<Toast variant="success" title="t" />);
    expect(screen.queryByRole('button', { name: /Cerrar/i })).not.toBeInTheDocument();

    const onDismiss = vi.fn();
    rerender(<Toast variant="success" title="t" onDismiss={onDismiss} />);
    expect(screen.getByRole('button', { name: /Cerrar/i })).toBeInTheDocument();
  });

  it('clicking dismiss fires the callback', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Toast variant="success" title="t" onDismiss={onDismiss} />);
    await user.click(screen.getByRole('button', { name: /Cerrar/i }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
