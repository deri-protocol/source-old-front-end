import React, { useState, useEffect } from 'react'
import Button from "../../Button/Button";
import NumberFormat from 'react-number-format';
import { tradeWithMargin } from "../../../lib/web3js/indexV2";
import type from '../../../model/Type'
import version from '../../../model/Version'
import { bg, DeriEnv } from '../../../lib/web3js/indexV2'

export default function TradeConfirm({ wallet, spec, onClose, direction, volume, position = 0, indexPrice, leverage, afterLeverage, transFee, afterTrade, lang, markPriceAfter, trading, liquidationPrice }) {
  const [pending, setPending] = useState(false);

  const trade = async () => {
    setPending(true)
    volume = bg(volume).div(bg(trading.contract.multiplier)).toString()
    volume = direction === 'long' ? volume : -(+volume)
    const res = await tradeWithMargin(wallet.detail.chainId, spec.pool, wallet.detail.account, volume, spec.symbolId)
    if (res.success) {
      afterTrade()
      onClose()
    } else {
      const msg = typeof res.error === 'string' ? res.error : res.error.errorMessage || res.error.message
      alert(msg)
    }
    setPending(false)
  }

  const close = () => {
    if (!pending) {
      onClose()
    }
  }

  const afterTradePosition = direction === 'long' ? bg(volume).plus(bg(position)).toString() : bg(position).minus(bg(volume)).toString()

  return (
    <div className='modal-dialog'>
      <div className='modal-content'>
        <div className='modal-header'>
          <div className='title'>{lang['confirm']}</div>
          <div className='close' data-dismiss='modal' onClick={close}>
            <span>&times;</span>
          </div>
        </div>
        <div className='modal-body'>
          <div className='contract-box-info'>
            <div className='top'>
              <div className='text'>
                <div className='text-title'>{lang['of-contracts']}</div>
                <div className='text-num'>{direction === 'long' ? volume : `-${volume}`} {trading.config.unit}</div>
              </div>
              <div className='text'>
                <div className='text-title'>{lang['position-after-execution']}</div>
                <div className='text-num'>{afterTradePosition}</div>
              </div>
              <div className='text'>
                <div className='text-title'>{lang['direction']}</div>
                <div className='text-num'><span className={direction}>{lang[direction.toLowerCase()]}</span></div>
              </div>
              {type.isFuture && <>
                {(version.isOpen || version.isV1) && <>
                  <div className='text'>
                    <div className='text-title'> {lang['trade-price-estimated']}</div>
                    <div className='text-num'><NumberFormat value={indexPrice} decimalScale={2} displayType='text' /></div>
                  </div>
                </>}
                { !version.isOpen && !version.isV1  && <>
                  <div className='text'>
                    <div className='text-title'>{lang['confirm-trade-price']}</div>
                    <div className='text-num'><NumberFormat value={markPriceAfter} decimalScale={2} displayType='text' /></div>
                  </div>
                </>}

              </>}
              {type.isOption && <>
                <div className='text'>
                  <div className='text-title'>{lang['confirm-trade-price']}</div>
                  <div className='text-num'><NumberFormat value={markPriceAfter} decimalScale={2} displayType='text' /></div>
                </div>
              </>}
              {type.isFuture && <>
                <div className='text'>
                  <div className='text-title'>{lang['cur-pos-leverage']}</div>
                  <div className='text-num'>{leverage}X</div>
                </div>
                <div className='text'>
                  <div className='text-title'>{lang['leverage-after-execution']}</div>
                  <div className='text-num'>{afterLeverage}X</div>
                </div>
              </>}
              {type.isFuture && <div className='text'>
                <div className='text-title'>{lang['liquidation-price']}</div>
                <div className='text-num'>
                  <NumberFormat value={liquidationPrice} decimalScale={2} displayType='text' />
                </div>
              </div>}
              <div className='text'>
                <div className='text-title'>{lang['transaction-fee']}</div>
                <div className='text-num'>
                  <NumberFormat value={transFee} decimalScale={2} suffix={` ${spec.bTokenSymbol}`} displayType='text' />
                </div>
              </div>

            </div>
            <div className='modal-footer'>
              <div className='long-btn' v-if='confirm'>
                <button className='cancel' onClick={close}>{lang['cancel']}</button>
                <Button className='confirm' btnText={lang['ok']} click={trade} lang={lang} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}