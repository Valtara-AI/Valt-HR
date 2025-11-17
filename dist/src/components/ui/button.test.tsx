import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('renders with default variant and size', () => {
    const { container } = render(<Button>Click me</Button>);
    const btn = container.querySelector('button');
    expect(btn).toBeInTheDocument();
    // Has data-slot attribute to ensure our component renders the expected element
    expect(btn).toHaveAttribute('data-slot', 'button');
  });
});
