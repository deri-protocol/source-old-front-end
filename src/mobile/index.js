import  {useEffect } from 'react'
import Header from './components/Header/Header'
import Body from './components/Body/Body'
import Footer from './components/Footer/Footer'
import './style/index.less'
import useWindowSize from '../hooks/useWindowSize';

export default function Mobile (){
  const winSize = useWindowSize();
  
  useEffect(() => {
    document.querySelector('html').setAttribute('style',`font-size : ${winSize.width /375 * 100}px`) 
    return () => {}
  }, [winSize])

  return (
    <div className='mobile'>
      <Header></Header>
      <Body></Body>
      <Footer></Footer>
    </div>
  )
}