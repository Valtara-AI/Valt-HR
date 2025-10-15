declare module '@testing-library/react' {
  export function render(component: React.ReactElement): {
    container: HTMLElement;
    rerender: (component: React.ReactElement) => void;
    unmount: () => void;
  };
  export function screen(): any;
}