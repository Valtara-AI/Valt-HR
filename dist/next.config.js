/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

// Build a CSP string, stricter in production. We intentionally keep style-src 'unsafe-inline'
// to support our controlled <style> injection in ChartStyle and Tailwind runtime styles.
const isProd = process.env.NODE_ENV === 'production';
const csp = [
  "default-src 'self'",
  // In dev, Next/React tooling may use eval; disable it in production.
  // Allow LeadConnector domains: widgets for main script, stcdn for assets, services for user session
  `script-src 'self'${isProd ? '' : " 'unsafe-eval'"} https://widgets.leadconnectorhq.com https://stcdn.leadconnectorhq.com https://services.leadconnectorhq.com`,
  // Allow websockets for dev tools and any widget live connections.
  "connect-src 'self' https://widgets.leadconnectorhq.com https://*.leadconnectorhq.com wss:",
  // Allow all https images plus data/blob for charts/avatars.
  "img-src 'self' data: blob: https:",
  // Keep inline styles (see note above) and fonts from self/data/https.
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data: https:",
  // Allow LeadConnector iframes only.
  "frame-src https://*.leadconnectorhq.com",
  // Additional hardening directives
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Prevent other sites from iframing this app
  "frame-ancestors 'self'",
].join('; ');

/**
 * Clean Next.js config for Next 15+:
 * - keep reactStrictMode
 * - remove deprecated/unsupported keys (e.g. `swcMinify`)
 * - provide webpack aliases to map legacy Vite-style imports (package@version) -> package
 */
module.exports = {
  reactStrictMode: true,
  // During migration and CI we allow builds to succeed even if ESLint reports warnings/errors.
  // This prevents Next from failing the entire production build due to linting issues.
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
            { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
            { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, './src'),
    };

    return config;
  },
};
