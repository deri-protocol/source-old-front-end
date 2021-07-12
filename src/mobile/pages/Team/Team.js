import Team from '../../../components/Team/Team';
import './team.less'
import Footer from '../../components/Header/Footer'
export default function Team_desktop({lang}){
  return(
    <div className='team_box'>
      <Team lang={lang} />
      <Footer lang={lang} />
    </div>
  )
}