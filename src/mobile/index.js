import  {useEffect } from 'react'
import Header from './components/Header/Nav'
import Body from './components/Body/Body'
import Footer from './components/Footer/Footer'
import './style/index.less'
import useWindowSize from '../hooks/useWindowSize';

export default function Mobile (){
  console.log('welcome Deri desktop app')
  const winSize = useWindowSize();
  useEffect(() => {
    document.querySelector('html').setAttribute('style',`font-size : ${winSize.width /375 * 100}px`) 
  }, [winSize])

  return (
    <div className='mobile'>
      <Header></Header>
      <Body></Body>
      <Footer></Footer>
    </div>
  )
}