import './poolPlacehold.less'
import { Link } from 'react-router-dom'
import {isMobile,isBrowser} from 'react-device-detect'

export default function PoolPlacehold({lang}){
  return(
    <div className='pool-placehold'>
      <div className='header'>
        <div className='title'>{lang['add-pool']}</div>
      </div>
      <div className='pool-body'>
        <div className='info'>
          {/* <div className='coming-soon'>{lang['coming-soon']}</div> */}
          <div>{lang['add-pool-text']}</div>
        </div>
        <div className='btn-c'>
        {isMobile &&<>
          <button onClick={()=>{alert(lang['please-operate'])}}>{lang['add']}</button>
        </>}
        {isBrowser &&
          <Link to='/addpool'><button>{lang['add']}</button></Link> 
        }
        </div>
      </div>
    </div>
  )
}