export default function RemoveBalance(){
  return (
    <div
      className='modal fade'
      id='removeMargin'
      tabindex='-1'
      role='dialog'
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <div className='title'>WITHDRAW MARGIN</div>
            <div className='close' data-dismiss='modal'>
              <span>&times;</span>
            </div>
          </div>
          <div className='modal-body'>
            <div className='margin-box-info'>
              <div>Available Balance</div>
              <div className='money'>
                <span>
                  <span className='bt-balance'>
                    {/* {{ modalMarginNum }}.<span style='font-size:12px'>{{removeMarginSub}}</span>  */}
                    </span>

                  </span
                >
                <span className='remove'></span>
              </div>
              <div className='enter-margin remv'>
                <div className='input-margin'>
                  <div className='box'>
                    <div className='amount' v-show='isEnterMargin'>AMOUNT</div>
                    <input
                      type='number'
                      className='margin-value'
                      placeholder='Amount'
                      v-model='withdrawMargin'
                    />
                  </div>
                </div>
                <div>{{ baseToken }}</div>
              </div>
              <div className='max' v-show='isPosition'>
                {/* MAX: <span className='max-num'>{{ this.maxMargin }}</span> */}
                <span className='max-btn-left'>REMOVE ALL</span>
              </div>
              <div
                className='add-margin-btn'
              >
                <button
                  className='margin-btn'
                  id='withdrawMarginButton'
                >
                  <span
                    className='spinner spinner-border spinner-border-sm'
                    role='status'
                    aria-hidden='true'
                    style='display: none'
                  ></span>
                  WITHDRAW
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}