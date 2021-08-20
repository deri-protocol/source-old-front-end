import './poolPlacehold.less'

export default function PoolPlacehold({lang}){
  return(
    <div className='pool-placehold'>
      <div className='header'>
        <div className='title'>{lang['add-pool']}</div>
      </div>
      <div className='pool-body'>
        <div className='info'>
          <div className='coming-soon'>{lang['coming-soon']}</div>
          <div>{lang['add-pool-text']}</div>
        </div>
        <div className='btn-c'>
          <button onClick={() => alert(lang['coming-soon'])}>{lang['add']}</button>
        </div>
      </div>
    </div>
  )
}