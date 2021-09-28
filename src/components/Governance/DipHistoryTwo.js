import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'

function DipHistoryTwo({ wallet = {}, lang }) {
  const [chainId, setChainId] = useState(56)
  const [name, setClass] = useState('bsc')
  const [obj, setObj] = useState({
    one: '23',
    two: '11',
    three: '10',
    four: '10',
    five: '0',
    six: '1',
    seven: '0',
    eight: '0',
    nine: '0',
    ten: '0',
  })

  const onFocus = event => {
    const target =event.target;
    target.setAttribute('class','deri-num inputFamliy')
  }
 
  const onBlur = event => {
    const target = event.target;
    if(target.value === '') {
      target.setAttribute('class','deri-num')
    }
  }

  useEffect(() => {
    setChainId(wallet.detail.chainId)
  }, [wallet.detail])
  useEffect(() => {
    if (chainId == '56') {
      setClass('bsc')
      setObj({
        one: '23',
        two: '11',
        three: '10',
        four: '10',
        five: '0',
        six: '1',
        seven: '0',
        eight: '0',
        nine: '0',
        ten: '0',
      })
    } else if (chainId == '1') {
      setClass('eth')
      setObj({
        one: '0',
        two: '0',
        three: '0',
        four: '0',
        five: '0',
        six: '0',
        seven: '0',
        eight: '0',
        nine: '0',
        ten: '0',
      })
    } else if (chainId == '128') {
      setClass('heco')
      setObj({
        one: '1',
        two: '0',
        three: '0',
        four: '0',
        five: '0',
        six: '0',
        seven: '0',
        eight: '0',
        nine: '0',
        ten: '0',
      })
    }
  }, [chainId, wallet.detail])
  return (
    <div className='governance_box'>
      <div className='H2 DIP1'>
        {lang['governance-title']}
      </div>
      <div className='flex'>
        {lang['governance-describe']}
        <br />
        <br />
        {lang['opction-title']}
      </div>
      <div className='radio'>
        <div className='left'>
          <div className='fle'>
            <div className='rad'>
              <input type="radio" name='option' value='0' id='I' /> <label for="I">I: $AKITA</label>
            </div>
            <div className={name}>
              <div className="I-per">
                <span>{obj.one} DERI</span>
              </div>
            </div>
          </div>
          <div className='fle'>
            <div className='rad'>
              <input type="radio" name="network" value="1" id='II' /> <label for="II">II: $ASS</label>
            </div>
            <div className={name}>
              <div className="II-per">
                <span>{obj.two} DERI</span>
              </div>
            </div>
          </div>
          <div className='fle'>
            <div className='rad'>
              <input type="radio" name="network" value="2" id='III' /> <label for="III">III: $BAN</label>
            </div>
            <div className={name}>
              <div className="III-per">
                <span>{obj.three} DERI</span>
              </div>
            </div>
          </div>
          <div className='fle'>
            <div className='rad'>
              <input type="radio" name="network" value="3" id='IV' /> <label for="IV">IV: $CUMMIES</label>
            </div>
            <div className={name}>
              <div className="IV-per">
                <span>{obj.four} DERI</span>
              </div>
            </div>
          </div>
          <div className='fle'>
            <div className='rad'>
              <input type="radio" name="network" value="4" id='V' /> <label for="V">V: $ERC20</label>
            </div>
            <div className={name}>
              <div className="V-per">
                <span>{obj.five} DERI</span>
              </div>
            </div>
          </div>
        </div>
        <div className='right'>
          <div className='fle'>
            <div className='rad'>
              <input type="radio" name="network" value="5" id='VI' /> <label for="VI">VI: $HOGE</label>
            </div>
            <div className={name}>
              <div className="VI-per">
                <span>{obj.six} DERI</span>
              </div>
            </div>
          </div>
          <div className='fle'>
            <div className='rad'>
              <input type="radio" name="network" value="6" id='VII' /> <label for="VII">VII: $HOKK</label>
            </div>
            <div className={name}>
              <div className="VII-per">
                <span>{obj.seven} DERI</span>
              </div>
            </div>
          </div>
          <div className='fle'>
            <div className='rad'>
              <input type="radio" name="network" value="7" id='VIII' /> <label for="VIII">VIII: $KISHU</label>
            </div>
            <div className={name}>
              <div className="VIII-per">
                <span>{obj.eight} DERI</span>
              </div>
            </div>
          </div>
          <div className='fle'>
            <div className='rad'>
              <input type="radio" name="network" value="8" id='IX' /> <label for="IX">IX: $LABRA</label>
            </div>
            <div className={name}>
              <div className="IX-per">
                <span>{obj.nine} DERI</span>
              </div>
            </div>
          </div>
          <div className='fle'>
            <div className='rad'>
              <input type="radio" name="network" value="9" id='X' /> <label for="X">X: $SAFEMARS </label>
            </div>
            <div className={name}>
              <div className="X-per">
                <span>{obj.ten} DERI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className='width'>
        {lang['wallet-balance']}: -- DERI
      </div> */}
      <div className='width input_c'>
        <div className='contrant'>
          <input 
          type="number" 
          className="deri-num" 
          placeholder={lang['amount']} 
          onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"
          onFocus={onFocus}
          onBlur={onBlur}
           />
          <span className="input_message">{lang['wallet-balance']}(DERI)</span>
        </div>
      </div>
      <div className='width'>
        <button className="vote" disabled>
          {lang['vote']}
        </button>
      </div>
      <div className='width rules'>
        <span className="H2 rules-title">{lang['vote-rules']}:</span>
        <br />
        <br/>
        1.{lang['vote-rules-one']}
        <br />
        2.{lang['vote-rules-two']}
        <br />
        3.{lang['vote-rules-three']}
        <br />
        4.{lang['vote-rules-four']}
        <br />
        {lang['all-the-deri-co-wi-be-re-to-be-min-again']}
      </div>
      <br />
      <br />
      <br />
      <br />
      
    </div>
  )
}
export default inject('wallet')(observer(DipHistoryTwo))