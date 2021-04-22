import Header from './components/Header/Nav'
import Body from './components/Body/Body'
import Footer from './components/Footer/Footer'
import './style/index.less'

export default function mobile (){
  console.log('welcome Deri desktop app')
  return (
    <div className='mobile'>
      <Header></Header>
      <Body></Body>
      <Footer></Footer>
    </div>
  )
}