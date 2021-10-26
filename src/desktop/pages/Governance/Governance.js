import Governance from '../../../components/Governance/Governance';
import './governance.less'
import './diptwo.less'
export default function GovernanceDes({lang}){
  return(
    <div className='governance'>
      <Governance lang={lang} />
    </div>
  )
}