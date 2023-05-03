import useToggle from '@/hooks/useToggle';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface Props {
  errorCode: string;
}


const ErrorPage = ({ errorCode }: Props) => {

    const router = useRouter()
    const {login,register}=useToggle()
  return <div className='w-full'>

    <h1 className='text-xl font-bold text-center mt-5'>An Error Occurred</h1>
    <p className='text text-xl font-medium text-center'> Email or Password is incorrect </p>
    <div className='flex justify-center mt-5'>
    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={()=>router.push("/")}>Home</button>
     
    </div>

  

  </div>;
};

ErrorPage.getInitialProps = ({ query }: NextPageContext) => {
  const { error } = query;
  return { errorCode: error };
};

export default ErrorPage;