import type { AppProps } from 'next/app';
import Script from 'next/script';
import '../src/index.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* LeadConnector chat widget */}
      <Script
        src="https://widgets.leadconnectorhq.com/loader.js"
        strategy="afterInteractive"
        data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
        data-widget-id="67ff121f119caa7e6578236b"
        onLoad={() => {
          console.log('LeadConnector widget loaded successfully');
        }}
        onError={(e) => {
          console.warn('LeadConnector widget failed to load:', e);
          // Add fallback behavior if needed
          if (typeof window !== 'undefined') {
            // Could show a fallback contact form or hide chat button
            console.info('Chat widget unavailable - consider showing fallback contact options');
          }
        }}
      />
      <Component {...pageProps} />
    </>
  )
}
