/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useEffect } from 'react'
import { closePosition, getWalletBalance } from '../../../../lib/web3js/indexV2';
import closePosImg from '../../../img/close-position.png'
import withModal from '../../../../components/hoc/withModal';
import DepositMargin from '../../../../components/Trade/Dialog/DepositMargin';
import WithdrawMagin from '../../../../components/Trade/Dialog/WithdrawMargin';
import { eqInNumber } from '../../../../utils/utils';
import DeriNumberFormat from '../../../../utils/DeriNumberFormat';
import { inject, observer } from 'mobx-react';
import removeMarginIcon from '../../../../assets/img/remove-margin.svg'
import addMarginIcon from '../../../../assets/img/add-margin.svg'
import marginDetailIcon from '../../../../assets/img/margin-detail.png'
import { BalanceList } from '../../../../components/Trade/Dialog/BalanceList';
import { bg } from '../../../../lib/web3js/indexV2';
import pnlIcon from '../../../../assets/img/pnl-detail.png'
import TipWrapper from '../../../../components/TipWrapper/TipWrapper';




const DepositDialog = withModal(DepositMargin);
const WithDrawDialog = withModal(WithdrawMagin)
const BalanceListDialog = withModal(BalanceList)


function Position({ wallet, trading, version, lang, type }) {
  const [direction, setDirection] = useState('LONG');
  const [closing, setClosing] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false);
  const [balanceListModalIsOpen, setBalanceListModalIsOpen] = useState(false);
  const [balance, setBalance] = useState('');
  const [balanceContract, setBalanceContract] = useState('');
  const [availableBalance, setAvailableBalance] = useState('');

  const afterWithdraw = () => {
    refreshBalance();
  }

  const afterDeposit = afterWithdraw

  const onCloseDeposit = () => setAddModalIsOpen(false)
  const onCloseWithdraw = () => setRemoveModalIsOpen(false);
  const onCloseBalanceList = () => setBalanceListModalIsOpen(false);
  const afterDepositAndWithdraw = () => {
    refreshBalance();
  }

  const refreshBalance = () => {
    loadBalance();
    trading.refresh();
  }

  const loadBalance = async () => {
    if (wallet.isConnected() && trading.config) {
      const balance = await getWalletBalance(wallet.detail.chainId, trading.config.pool, wallet.detail.account, trading.config.bTokenId).catch(e => console.log(e))
      if (balance) {
        setBalance(balance)
      }
    }
  }

  const onClosePosition = async () => {
    setClosing(true)
    const res = await closePosition(wallet.detail.chainId, trading.config.pool, wallet.detail.account, trading.config.symbolId).finally(() => setClosing(false))
    if (res.success) {
      refreshBalance();
    } else {
      if (typeof res.error === 'string') {
        alert(res.error || lang['close-position-failed'])
      } else if (typeof res.error === 'object') {
        alert(res.error.errorMessage || lang['close-position-failed'])
      } else {
        alert(lang['close-position-failed'])
      }
    }
  }

  useEffect(() => {
    if (trading.position) {
      const { position } = trading
      const direction = (+position.volume) > 0 ? 'LONG' : (!position.volume || eqInNumber(position.volume, 0) || !position.volume ? '--' : 'SHORT')
      setDirection(direction)
      setBalanceContract(bg(position.margin).plus(position.unrealizedPnl).toString())
      setAvailableBalance(bg(position.margin).plus(position.unrealizedPnl).minus(position.marginHeld).toString())
    }
    return () => { };
  }, [trading.position.volume, trading.position.margin, trading.position.unrealizedPnl]);


  useEffect(() => {
    loadBalance();
    return () => { };
  }, [wallet.detail.account, trading.config, trading.amount.dynBalance])

  // useEffect(() => {    
  //   if(trading.position.volume && trading.position.margin && trading.position.unrealizedPnl){
  //     const direction = (+trading.position.volume) > 0 ? 'LONG' : (!trading.position.volume || eqInNumber(trading.position.volume , 0) ? '--' : 'SHORT')       
  //     setDirection(direction);
  //   }
  //   return () => {};
  // }, [trading.position.volume,trading.position.margin,trading.position.unrealizedPnl]);

  return (
    <div className='position-box' >
      <div className='p-box theader'>
        <div className='position'>{lang['position']}</div>
        <div className='ave-entry-price'>{lang['average-entry-price']}</div>
        <div className='direction'>{lang['direction']}</div>
        <div className='dyn-eff-bal'>
          {(version.isV1 || version.isV2Lite || version.isOpen) ? <>{lang['balance-in-contract']} <br /> ({lang['dynamic-balance']})</> : lang['dynamic-effective-balance']}
        </div>
        <div className='margin'>{lang['margin']}</div>
        <div className='unrealized-pnl'>{lang['unrealized-pnl']}</div>
        <div><TipWrapper block={false}><span className='funding-fee' title={lang['funding-fee-tip'] || ''} >{lang['funding-fee']}</span></TipWrapper></div>
        <div className='liquidation-price'>
          {lang['liquidation-price']}
        </div>
      </div>
      <div className='p-box tbody'>
        <div className='position'>
          {type.isOption ? <DeriNumberFormat value={bg(trading.position.volume).times(bg(trading.contract.multiplier)).toString()} allowZero={true} /> : <DeriNumberFormat value={trading.position.volume} allowZero={true} />}
          <span className='close-position'>
            {!closing && <img src={closePosImg} onClick={onClosePosition}  />}
            <span
              className='spinner spinner-border spinner-border-sm'
              style={{ display: closing ? 'block' : 'none', marginLeft: '8px' }}
            ></span>
          </span>
        </div>
        <div className='ave-entry-price'><DeriNumberFormat value={trading.position.averageEntryPrice} decimalScale={2} /></div>
        <div className={direction}>{lang[direction.toLowerCase()] || direction}</div>
        <div className='dyn-eff-bal'>
          <DeriNumberFormat allowZero={true} value={balanceContract} decimalScale={2} />
          {(version.isV1 || version.isV2Lite || type.isOption || version.isOpen) ? <span>
            <span
              className='open-add'
              id='openAddMargin'
              onClick={() => setAddModalIsOpen(true)}
            >
              <img src={removeMarginIcon} alt='add margin' />
            </span>
            <span className='open-remove'
              onClick={() => setRemoveModalIsOpen(true)}>
              <img src={addMarginIcon} alt='add margin' />
            </span>
          </span> : (<span className='balance-list-btn' onClick={() => setBalanceListModalIsOpen(true)}><img src={marginDetailIcon} alt='Remove margin' /> {lang['detail']}</span>)}
        </div>
        <div className='margin'><DeriNumberFormat value={trading.position.marginHeld} decimalScale={2} /></div>
        <div className='pnl'>
          <span className='pnl-list unrealized-pnl'>
            <DeriNumberFormat value={trading.position.unrealizedPnl} decimalScale={6} />{(version.isV2 || version.isV2Lite) && trading.position.unrealizedPnl && <img src={pnlIcon} alt='unrealizePnl' />}
            {(version.isV2 || version.isV2Lite || version.isOpen) && <div className='pnl-box'>
              {trading.position.unrealizedPnlList && trading.position.unrealizedPnlList.map((item, index) => (
                <div className='unrealizePnl-item' key={index}>
                  <span>{item[0]}</span><span><DeriNumberFormat value={item[1]} decimalScale={8} /></span>
                </div>
              ))}
            </div>}
          </span>
        </div>
        <div><DeriNumberFormat value={(-(trading.position.fundingFee))} decimalScale={8} /></div>
        <div className='liquidation-price'><DeriNumberFormat value={trading.position.liquidationPrice} decimalScale={2} /></div>
      </div>
      <div className='p-box tbody'></div>

      <DepositDialog
        wallet={wallet}
        modalIsOpen={addModalIsOpen}
        onClose={onCloseDeposit}
        spec={trading.config}
        afterDeposit={afterDeposit}
        balance={balance}
        className='trading-dialog'
        lang={lang}
      />
      <WithDrawDialog
        wallet={wallet}
        modalIsOpen={removeModalIsOpen}
        onClose={onCloseWithdraw}
        spec={trading.config}
        afterWithdraw={afterWithdraw}
        availableBalance={availableBalance}
        position={trading.position}
        className='trading-dialog'
        lang={lang}
      />

      <BalanceListDialog
        wallet={wallet}
        modalIsOpen={balanceListModalIsOpen}
        onClose={onCloseBalanceList}
        spec={trading.config}
        afterDepositAndWithdraw={afterDepositAndWithdraw}
        position={trading.position}
        overlay={{ background: '#1b1c22', top: 80 }}
        className='balance-list-dialog'
        lang={lang}
      />
    </div>
  )
}


export default inject('wallet', 'trading', 'version', 'type')(observer(Position))