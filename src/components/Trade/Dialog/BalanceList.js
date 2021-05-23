export function BalanceList({onClose}){
  return(
    <div className='modal fade'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <div className='title'>Balance in contract</div>
            <div className='close' data-dismiss='modal' onClick={onClose}>
              <span>&times;</span>
            </div>
          </div>
          <div className='modal-body'>
            <div className='balance-list'>
              <div className='row'><span>Base Token</span><span>Wallet Balance</span><span>Available Balance</span></div>
              <div className='row'><span>UNI</span><span>9,000</span><span>200</span></div>
              <div className='row'><span>BUSD</span><span>3,000</span><span>200</span></div>
              <div  className='row'><span>USDT</span><span>3,000</span><span>200</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}