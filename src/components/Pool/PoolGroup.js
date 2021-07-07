import './poolGroup.less'

export default function PoolGroup({info,lang}){
  return (
    <div className='pool'>
      <div className='pool-header'>
        <div className='left'>
          <div className='network'></div>
          <div className='info'></div>
        </div>
        <div className='right'></div>
      </div>
      <div className='pool-body'>
        <div className='card'>
          <div className='symbol'>
            <span className='icon'></span>
            <span className='symbol-name'></span>
          </div>
          <div className='pool-detail'>
            <div className='liq'></div>
            <div className='apy'></div>
          </div>
        </div>
        <div className='action'> </div>
      </div>
    </div>
  )
}