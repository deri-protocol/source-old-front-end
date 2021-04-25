export default function Position(){
  const {position,AverageEntryPrice,balanceContract,Direction,Margin,UnrealizedPnL,LiquidationPrice} = {}
  return(

    <div className='position-info' v-show='positionShow'>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text'>Position</div>
        <div className='info-num'>{ position }</div>
      </div>
      <div className='info-right'>
        <div
          className='close-position'
          id='close-p'
          click='closePosition'
        >
          <span
            className='spinner spinner-border spinner-border-sm'
            role='status'
            aria-hidden='true'
            style={{display: 'none'}}
          ></span>
          <svg t='1618369709897' className='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2009' width='14' height='14'><path d='M510.8096 420.3008l335.296-335.296 90.5088 90.5088-335.296 335.296 335.296 335.296-90.5088 90.5088-335.296-335.296-335.296 335.296-90.5088-90.5088 335.296-335.296-335.296-335.296 90.5088-90.5088z' p-id='2010' fill='#ffffff'></path></svg> Close
        </div>
      </div>
    </div>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text'>Average Entry Price</div>
        <div className='info-num'>{ AverageEntryPrice }</div>
      </div>
      <div className='info-right'></div>
    </div>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text balance-con'>
          Balance in Contract
          (Dynamic Balance)
        </div>
        <div className='info-num'>{ balanceContract }</div>
      </div>
      <div className='info-right'>
        <div
          className='add-margin'
          id='openAddMargin'
          data-toggle='modal'
          data-target='#addMargin'
        >
          <svg
            className='svg'
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='18'
            viewBox='0 0 18 18'
          >
            <path
              id='login'
              d='M13,9,7,4V7H0v4H7v3Zm3,7H8v2h8a2.006,2.006,0,0,0,2-2V2a2.006,2.006,0,0,0-2-2H8V2h8Z'
              transform='translate(18) rotate(90)'
              fill='#3ebf38'
            />
          </svg>
          Add
        </div>
        <div
          className='remove-margin'
          data-toggle='modal'
          data-target='#removeMargin'
          id='openRemoveMargin'
        >
          <svg
            className='svg'
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='18'
            viewBox='0 0 18 18'
          >
            <path
              id='log-out'
              data-name='log out'
              d='M18,9,12,4V7H5v4h7v3ZM2,2h8V0H2A2.006,2.006,0,0,0,0,2V16a2.006,2.006,0,0,0,2,2h8V16H2Z'
              transform='translate(0 18) rotate(-90)'
              fill='#e35061'
            />
          </svg>
          Remove
        </div>
      </div>
    </div>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text'>Direction</div>
        <div className='info-num' className='Direction'>{ Direction }</div>
      </div>
      <div className='info-right'></div>
    </div>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text'>Margin</div>
        <div className='info-num'>{ Margin }</div>
      </div>
      <div className='info-right'></div>
    </div>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text'>Unrealized PnL</div>
        <div className='info-num'>{ UnrealizedPnL }</div>
      </div>
      <div className='info-right'></div>
    </div>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text'>Liquidation Price</div>
        <div className='info-num'>{ LiquidationPrice }</div>
      </div>
      <div className='info-right'></div>
    </div>
  </div>
  )
}