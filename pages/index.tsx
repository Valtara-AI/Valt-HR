import dynamic from 'next/dynamic'
import Head from 'next/head'

// Dynamically import the original App to avoid SSR issues with window usage
const App = dynamic(() => import('../src/App'), { ssr: false })

export default function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Valt HR Suite</title>
      </Head>
      <App />
    </>
  )
}
