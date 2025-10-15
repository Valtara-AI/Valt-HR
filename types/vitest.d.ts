declare module 'vitest' {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void): void;
  export function expect(actual: any): {
    toBeTruthy(): void;
    toBeInTheDocument(): void;
    toHaveClass(className: string): void;
    toHaveAttribute(attr: string, value?: string): void;
  };
}

declare module 'vitest/config' {
  export function defineConfig(config: any): any;
}