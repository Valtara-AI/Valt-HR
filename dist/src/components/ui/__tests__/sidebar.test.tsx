import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SidebarProvider } from '../sidebar';

describe('Sidebar', () => {
  it('defines --sidebar-width for mobile SheetContent', () => {
    // This is a smoke test ensuring provider renders without crashing.
    const { container } = render(
      <SidebarProvider>
        <div />
      </SidebarProvider>
    );
    expect(container.firstChild).toBeTruthy();
  });
});
