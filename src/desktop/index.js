import Header from './components/Header/Header'
import Body from './components/Body/Body'
import Footer from './components/Footer/Footer'
import './style/index.css'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'

export default function Desktop (props){
  console.log('welcome Deri desktop app')
  const location = useLocation();
  const curRouterClass = location.pathname.substring(1)
  return (
    <div className={`desktop ${curRouterClass}`}>
      <Header {...props}></Header>
      <Body></Body>
      <Footer></Footer>
    </div>
  )
}