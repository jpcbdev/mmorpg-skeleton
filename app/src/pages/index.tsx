import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DynamicComponentWithNoSSR = dynamic(() => import('../component/Game'), { ssr: false });

export default function Index() {

  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <>
      <Head>
        <title></title>
        <meta name='description' content='' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        {pageLoaded ? <DynamicComponentWithNoSSR /> : null}
      </main>
    </>
  )
}
