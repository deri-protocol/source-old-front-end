import { useState } from 'react'
import classNames from "classnames";
import Slider from '../Slider/Slider';

export default function TradeInfo(){
  const [direction, setDirection] = useState('long');
  const {IndexPrice,FundingRate,position,btc,coin,balanceContract,tit,margin} = {};

  const directionClazz = classNames('checked-long','check-long-short',' long-short',{' checked-short' : direction === 'short'})

  const onKeyUp= event => {

  }
  
  return (
    <div className='trade-info' v-show='tradeShow'>
    <div className='trade-peration'>
      <div className='check-baseToken'>
        <div className='btn-group check-baseToken-btn'>
          <button
            type='button'
            className='btn chec'
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='false'
          >
            {/* { symbol } / { baseToken } (10X) */}
            BTCUSD / USDT (10X)
            <span
              className='check-base-down'
            ><svg
              t='1616752321986'
              className='icon'
              viewBox='0 0 1024 1024'
              version='1.1'
              xmlns='http://www.w3.org/2000/svg'
              p-id='1700'
              width='16'
              height='16'
            >
                <path
                  d='M843.946667 285.866667L512 617.386667 180.053333 285.866667 119.893333 346.026667l331.946667 331.946666L512 738.133333l392.106667-392.106666-60.16-60.16z'
                  p-id='1701'
                  fill='#cccccc'
                ></path></svg
            ></span>
          </button>
          <div className='dropdown-menu' >
            <div className='dropdown-box'>
              <span
              className='dropdown-item'
            >
              {/* { list.base } (10X) */}
            </span>
            </div>
            
          </div>
        </div>

        <div className='price-fundingRate'>
          <div className='index-prcie'>
            Index Price: <span className='this.rose-fall'>&nbsp; { IndexPrice }</span>
          </div>
          <div className='funding-rate'>
            <span>Funding Rate Annual: &nbsp;</span>
            <span className='funding-per' title=''>{ FundingRate }</span> 
          </div>
        </div>
      </div>
      <div className={directionClazz}>
        <div className='check-long' onClick={() => setDirection('long')}>LONG / BUY</div>
        <div className='check-short' onClick={() => setDirection('short')}>SHORT / SELL</div>
      </div>
      <div className='the-input'>
        <div className='left'>
          <div className='current-position'>
            <span>Current Position</span>
            <span className='position-text'>{ position }</span>
          </div>
          <div className='contrant'>
            
            <input
              type='number'
              onKeyUp={onKeyUp}
              className='contrant-input inputFamliy'
              placeholder='Contract Volume'
            />
            <div className='title-volume' >
              Contract Volume
            </div>
          </div>
          <div className='btc' v-show='isVolume'>= { btc } {btc-coin}</div>
        </div>
        <div className='right-info'>
          <div className='contrant-info'>
            <div className='balance-contract'>
              <span className='balance-contract-text'>
                Balance in Contract<br/>
                (Dynamic Balance)
              </span>
              <span className='balance-contract-num'>
                { balanceContract }
              </span>
            </div>
            <div className='box-margin'>
              <span> Margin </span>
              <span className='margin'>
                {/* { Margin } */}
              </span>
            </div>
            <div className='available-balance'>
              <span> Available Balance </span>
              <span className='available-balance-num'>
                {/* { availableBalance } */}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='slider mt-13'>
        <Slider/>
      </div>
      <div className='title-margin'>Margin</div>
      <div className='enterInfo' v-show='isVolume'>
        <div className='text-info'>
          <div className='title-enter pool'>Pool Liquidity</div>
          <div className='text-enter poolL'>
            {/* { total-liquidity } { baseToken } */}
          </div>
        </div>
        <div className='text-info'>
          <div className='title-enter'>Liquidity Used</div>
          <div className='text-enter'>
            {/* { liq-used } -> { liq-used-after } */}
          </div>
        </div>
        <div className='text-info'>
          <div className='title-enter'>Funding Rate Impact</div>
          <div className='text-enter'>
            {/* { FundingRate } -> { fund-rate-after } */}
          </div>
        </div>
        <div className='text-info'>
          <div className='title-enter'>Transaction Fee</div>
          <div className='text-enter'>
            {/* { mfee } { baseToken } */}
          </div>
        </div>
      </div>
      <div className='noMargin-text' v-show='!isMargin'>
        { tit-margin }
      </div>
      <div className='submit-btn'>
        {/* <div v-if='isConnect'>
          <div v-if='isApprove'>
            <div v-show='isMargin'>
              <div v-show='isVolume'>
                <button
                  data-toggle='modal'
                  data-target='#addContract'
                  className='long-submit'
                  v-if='long-short'
                >
                  TRADE
                </button>
                <button
                  data-toggle='modal'
                  data-target='#removeContract'
                  className='short-submit'
                  v-else
                >
                  TRADE
                </button>
              </div>
              <div v-show='!isVolume'>
                <button className='btn btn-danger short-submit' disabled>
                  ENTER VOLUME
                </button>
              </div>
            </div>
            <div v-show='!isMargin'>
              <button
                className='short-submit'
                data-toggle='modal'
                data-target='#addMargin'
              >
                DEPOSIT
              </button>
            </div>
          </div>
          <div v-else>
            <button id='Unlock' className='approve' click='unlock()'>
              APPROVE
            </button>
          </div>
        </div> */}
        <div v-else>
          <button
            click='connectWallet()'
            className='btn btn-danger connect'
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}