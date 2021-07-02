import  {useEffect } from 'react'
import Header from './components/Header/Header'
import Body from './components/Body/Body'
import Footer from './components/Footer/WalletPanel'
import './style/index.less'
import useWindowSize from '../hooks/useWindowSize';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
export default function Mobile ({locale}){
  const winSize = useWindowSize();
  const location = useLocation();
  const curRouterClass = location.pathname.substring(1)
  useEffect(() => {
    document.querySelector('html').setAttribute('style',`font-size : ${winSize.width /375 * 100}px`) 
    return () => {}
  }, [winSize])

  return (
    <div className={`mobile ${curRouterClass} ${locale}`}>
      <Header></Header>
      <Body></Body>
      <Footer></Footer>
    </div>
  )
}