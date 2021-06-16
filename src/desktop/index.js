import Header from './components/Header/Header'
import Body from './components/Body/Body'
import Footer from './components/Footer/Footer'
import './style/index.css'

export default function Desktop (props){
  console.log('welcome Deri desktop app')
  return (
    <div className='desktop'>
      <Header {...props}></Header>
      <Body></Body>
      <Footer></Footer>
    </div>
  )
}