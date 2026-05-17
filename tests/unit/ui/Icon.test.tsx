import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icon } from '@/components/ui/Icon';

describe('<Icon>', () => {
  it('renders an svg with the default 24x24 viewBox and h-5 w-5 size', () => {
    const { container } = render(<Icon name="check" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    const klass = svg?.getAttribute('class') ?? '';
    expect(klass).toContain('h-5');
    expect(klass).toContain('w-5');
  });

  it('is aria-hidden by default (decorative)', () => {
    const { container } = render(<Icon name="check" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards extra className overrides', () => {
    const { container } = render(<Icon name="check" className="h-8 w-8 text-red-500" />);
    const klass = container.querySelector('svg')?.getAttribute('class') ?? '';
    expect(klass).toContain('h-8');
    expect(klass).toContain('text-red-500');
  });

  it('applies custom strokeWidth', () => {
    const { container } = render(<Icon name="check" strokeWidth={3} />);
    expect(container.querySelector('svg')).toHaveAttribute('stroke-width', '3');
  });

  it('renders the check icon as a single path', () => {
    const { container } = render(<Icon name="check" />);
    expect(container.querySelectorAll('path')).toHaveLength(1);
  });

  it('renders the home icon with 3 paths', () => {
    const { container } = render(<Icon name="home" />);
    expect(container.querySelectorAll('path')).toHaveLength(3);
  });

  it('renders the scan-eye icon with 4 paths + 1 circle', () => {
    const { container } = render(<Icon name="scan-eye" />);
    expect(container.querySelectorAll('path').length).toBeGreaterThanOrEqual(4);
    expect(container.querySelectorAll('circle')).toHaveLength(1);
  });

  it('renders the close icon as 2 lines (X mark)', () => {
    const { container } = render(<Icon name="close" />);
    expect(container.querySelectorAll('line')).toHaveLength(2);
  });

  it('renders the image icon with a rect background', () => {
    const { container } = render(<Icon name="image" />);
    expect(container.querySelectorAll('rect')).toHaveLength(1);
  });
});
