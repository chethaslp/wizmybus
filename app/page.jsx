import dynamic from 'next/dynamic'
import Loading from './loading'
 
export default function Home() {
    const MainPage = dynamic(() => import('./mainPage'), { 
        loading: ()=> <Loading/>,
        ssr: false 
    })
  return <MainPage />
}