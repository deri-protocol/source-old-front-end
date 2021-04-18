import Nav from './components/Header/Nav'
import Body from './components/Body/Body'
import Footer from './components/Footer/Footer'
import './style/index.css'

export default function Desktop (){
  console.log('welcome Deri desktop app')
  return (
    <div className='desktop'>
      <Nav></Nav>
      <Body></Body>
      <Footer></Footer>
    </div>
  )
}