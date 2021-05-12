import {useHistory} from 'react-router-dom'

export default function Tab(){
  const history = useHistory();

  const redirect = path => {
    history.push(path)
  }
  

  return (
    <div className="check-lite-pro">
      <div className='lite' onClick={() => redirect('/lite')} >LITE</div>
      <div className='pro' onClick={() => redirect('/pro')}> PRO
      </div>
    </div>
  )
}