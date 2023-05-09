
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {Toaster} from "react-hot-toast"
import {SessionProvider} from "next-auth/react"
import Layout from '@/components/Layout/Layout'
import LoginModal from '@/components/Modals/LoginModal'
import RegistrationModal from '@/components/Modals/RegistrationModal'
import EditModal from '@/components/Modals/EditModal'
import EditPostModal from '@/components/Modals/EditPostModal'
import ReplayModal from '@/components/Modals/ReplayModal'
import NestedModal from '@/components/Modals/NestedModal'
import SkillModal from '@/components/Modals/SkillModal'
import ProjectModal from '@/components/Modals/ProjectModal'
import VerifyModal from '@/components/Modals/VerifyModal'
import VerifyNumber from '@/components/Modals/VerifyNumber'





export default function App({ Component, pageProps }: AppProps) {
  return( 
    <SessionProvider session={pageProps.session}>
    <Toaster/>
    <EditPostModal/>
    <VerifyModal/>
    <VerifyNumber/>
    <SkillModal/>
    <ProjectModal/>
    <NestedModal/>
    <EditModal/>
    <ReplayModal/>
  <LoginModal/>
  <RegistrationModal/>
    <Layout>
    <Component {...pageProps} />
    </Layout>
    </SessionProvider>


  )
}
