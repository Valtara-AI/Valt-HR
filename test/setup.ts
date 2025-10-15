import '@testing-library/jest-dom';

// Polyfill window.matchMedia for jsdom environment (used by useIsMobile)
if (typeof window !== 'undefined' && !window.matchMedia) {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: (query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: () => {},
			removeEventListener: () => {},
			addListener: () => {}, // deprecated
			removeListener: () => {}, // deprecated
			dispatchEvent: () => false,
		}),
	});
}

// Ensure React is available globally for tests that are compiled to use React.* helpers
import * as React from 'react';
(globalThis as any).React = React;

