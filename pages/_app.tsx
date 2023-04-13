
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '@/components/Layout/Layout'
import LoginModal from '@/components/Modals/LoginModal'
import RegistrationModal from '@/components/Modals/RegistrationModal'


export default function App({ Component, pageProps }: AppProps) {
  return( 
    <>
<LoginModal/>
<RegistrationModal/>
    <Layout>
    <Component {...pageProps} />
    </Layout>
    </>


  )
}
