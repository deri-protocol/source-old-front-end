import Header from './components/Header/Header'
import Body from './components/Body/Body'
import Footer from './components/Footer/Footer'
import { useLocation } from 'react-router-dom'
import './style/index.css'

export default function Desktop ({lang}){
  console.log('welcome Deri desktop app')
  const location = useLocation();
  const curRouterClass = location.pathname.substring(1)
  return (
    <div className={`desktop ${curRouterClass} ${lang}`}>
      <Header></Header>
      <Body></Body>
      <Footer></Footer>
    </div>
  )
}