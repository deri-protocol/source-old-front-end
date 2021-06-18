import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
function Governance({ wallet = {}, lang }) {
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
  useEffect(() => {
    setChainId(wallet.detail.chainId)
  }, [wallet.detail])
  useEffect(()=>{
    if(chainId == '56'){
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
    }else if(chainId == '1'){
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
    }else if(chainId == '128'){
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
  },[chainId,wallet.detail])
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
        <div>
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
      <div className='width'>
        {lang['wallet-balance']}: -- DERI
      </div>
      <div className='width'>
        <input type="number" className="deri-num" placeholder="Amount" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" /> 
        <span className="basetoken">DERI</span> 
      </div>
      <div className='width'>
        <button  className="vote" disabled>
          {lang['vote']}
        </button>
      </div>
      <div className='width'>
        <span className="H2">{lang['vote-rules']}:</span>
        <br/>
        <br/>
        1.{lang['vote-rules-one']}
        <br/>
        <br/>
        2.{lang['vote-rules-two']}
        <br/>
        <br/>
        3.{lang['vote-rules-three']}
        <br/>
        <br/>
        4.{lang['vote-rules-four']}
        <br/>
        <br/>
        {lang['all-the-deri-co-wi-be-re-to-be-min-again']}
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
      <div className='dip-list'>
        <div className='list-title'>
          <div>
            <span className="title">{lang['dip-list']}</span><br />
            <span>{lang['dip-list-title']}</span>
          </div>
        </div>
        <div className='list-text'>
          <span>{lang['dip-list-dip1']}</span>
          <Link to='/diphistory'><button>{lang['detail']}</button></Link>
        </div>
      </div>
    </div>
  )
}
export default inject('wallet')(observer(Governance))