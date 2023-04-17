
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {Toaster} from "react-hot-toast"
import {SessionProvider} from "next-auth/react"
import Layout from '@/components/Layout/Layout'
import LoginModal from '@/components/Modals/LoginModal'
import RegistrationModal from '@/components/Modals/RegistrationModal'
import EditModal from '@/components/Modals/EditModal'
import EditPostModal from '@/components/Modals/EditPostModal'



export default function App({ Component, pageProps }: AppProps) {
  return( 
    <SessionProvider session={pageProps.session}>
    <Toaster/>
    <EditPostModal/>
<EditModal/>
  <LoginModal/>
  <RegistrationModal/>
    <Layout>
    <Component {...pageProps} />
    </Layout>
    </SessionProvider>


  )
}
