
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
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Skill Match',
  description: 'Home Page',
}


export default function App({ Component, pageProps }: AppProps) {
  return( 
    <SessionProvider session={pageProps.session}>
    <Toaster/>
    <EditPostModal/>
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
