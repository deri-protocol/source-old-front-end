import Content from '../../../components/Home/Content';
import './home.less'
import Footer from '../../components/Header/Footer'
export default function Home({lang}){
  return (
    <div className='home_box'>
      <Content lang={lang} />
      <Footer lang={lang} />
    </div>
  )
}