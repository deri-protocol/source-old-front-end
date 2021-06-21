import Team from '../../../components/Team/Team';
import './team.less'
import './de-team.less'
import './zh-team.less'
export default function Team_desktop({lang}){
  return(
    <div className='team_box'>
      <Team lang={lang} />
    </div>
  )
}