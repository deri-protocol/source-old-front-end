import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import Button from '../Button/Button';
function DipTwo({ wallet = {}, lang }) {
  const [optionOne, setOptionOne] = useState(false)
  const [optionTwo, setOptionTwo] = useState(false)
  const [optionThree, setOptionThree] = useState(false)
  const [checkedOption, setCheckedOption] = useState('')
  const connect = () => {
    wallet.connect()
  }
  const [elemButton, setElemButton] = useState(<Button click={connect} className='vote' btnText={lang['connet-wallet']} ></Button>)
  const radioChange = (e) => {
    let { value } = e.target
    setCheckedOption(value)
  }
  const vote = async () => {
    if(!checkedOption){
      alert('aaa')
      return
    }
  }
  useEffect(() => {
    let elem;
    if (wallet.isConnected()) {
      elem = <Button className='vote' lang={lang} btnText={lang['vote']} click={vote}></Button>
    } else {
      elem = <Button click={connect} className='vote' btnText={lang['connet-wallet']} ></Button>
    }
    setElemButton(elem)
  }, [wallet.detail.account])
  return (
    <div className='dip_two_box'>
      <div className='H2 DIP1'>
        {lang['governance-title']}
        <br />
        <br />
      </div>
      <div className='flex'>
        I.
        {lang['governance-options-one-describe']}
        <br />
        <br />
        II.
        {lang['governance-options-two-describe']}
        <br />
        <br />
        III.{lang['governance-options-three']}
        <br />
      </div>
      <div className='radio'>
        <div>
          <div className='fle'>
            <div className='rad'>
              <input
                type="radio"
                name='option'
                value='0'
                id='I'
                onChange={event => radioChange(event)}
                defaultChecked={optionOne}
              /> <label for="I">I</label>
            </div>
            <div className='prele_eth'>
              <div className="pre_eth">
              </div>
              <span>158,544 DERI</span>
            </div>
          </div>
          <div className='fle'>
            <div className='rad'>
              <input
                type="radio"
                name='option'
                value='0'
                id='II'
                onChange={event => radioChange(event)}
                defaultChecked={optionTwo}
              /> <label for="II">II</label>
            </div>
            <div className='prele_bsc'>
              <div className="pre_bsc">
              </div>
              <span>334,253 DERI</span>
            </div>
          </div>
          <div className='fle'>
            <div className='rad'>
              <input
                type="radio"
                name='option'
                value='0'
                id='III'
                onChange={event => radioChange(event)}
                defaultChecked={optionThree}
              /> <label for="III">III</label>
            </div>
            <div className='prele_heco'>
              <div className="pre_heco">
              </div>
              <span>0 DERI</span>
            </div>
          </div>
        </div>
        <div>
          {elemButton}
        </div>
        <br />
        <div>
          {lang['your-voting-power']}
        </div>
        <br />
        <div>
          <span class="H2">Voting rules:</span>
          <br /><br />
          1.{lang['vote-rules-one']}
          <br />
          <br />
          {lang['vote-rules-one-describe']}
          <br />
          {lang['vote-rules-one-describe-two']}
          <br /><br />
          2. {lang['vote-rules-two']}
          <br /><br />
          3. {lang['vote-rules-three']}
          <br /><br />
          4. {lang['vote-rules-four']}
        </div>
      </div>
    </div>
  )
}
export default inject('wallet')(observer(DipTwo))