import Header from './components/Header'
import Body from './components/Body'
import Footer from './components/Footer'
import './style/index.css'

export default function Desktop (){
  console.log('welcome Deri desktop app')
  return (
    <div className='desktop'>
      <Header></Header>
      <Body></Body>
      <Footer></Footer>
    </div>
  )
}