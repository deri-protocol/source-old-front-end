import Header from './components/Header/Header'
import Body from './components/Body/Body'
import Footer from './components/Footer/Footer'
import { useLocation } from 'react-router-dom'
import './style/index.css'

export default function Desktop({ locale }) {
  console.log('welcome Deri desktop app')
  const location = useLocation();
  const curRouterClass = location.pathname.split('/')[1]
  const isV1Router = location.pathname.split('/')[3]
  let v1Class = ''
  if(isV1Router === 'v1'){
    v1Class = 'futures-hide'
  }else{
    v1Class = ''
  }
  return (
    <div className={`desktop ${curRouterClass} ${locale} ${v1Class}`}>
      <Header></Header>
      <Body></Body>
      <Footer></Footer>
    </div>
  )
}