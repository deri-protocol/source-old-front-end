export default function History(){
  const list = {}
  
  return (
    <div className='history-info' v-show='historyShow'>
      <div
        className='history-box'
      >
        <div className='direction-bToken-price'>
          <span>
            <span className='list.direction'>{ list.direction }</span>
            <span>{ list.baseToken }</span>
          </span>
          <span className='history-text time'>{ list.time }</span>
        </div>
        <div className='time-price-volume'>
          <div className='history-price'>
            <div className='history-title'>Volume @ Price</div>
            <div className='history-text'>{ list.volume } @ { list.price }</div>
          </div>
        <div className='notional'>
            <div className='history-title'>Notional</div>
            <div className='history-text'>{ list.notional }</div>
          </div>
          <div className='history-fee'>
            <div className='history-title'>Transaction Fee</div>
            <div className='history-text'>{ list.transactionFee }</div>
          </div>
        </div>
        
      </div>
    </div>
  )
}