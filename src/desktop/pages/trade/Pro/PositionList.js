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
import removeMarginIcon from '../../../../assets/img/remove_margin.png'
import addMarginIcon from '../../../../assets/img/add_margin.png'
import marginDetailIcon from '../../../../assets/img/margin-detail.png'
import { BalanceList } from '../../../../components/Trade/Dialog/BalanceList';
import { bg } from '../../../../lib/web3js/indexV2';
import pnlIcon from '../../../../assets/img/pnl-detail.png'
import TipWrapper from '../../../../components/TipWrapper/TipWrapper';




const DepositDialog = withModal(DepositMargin);
const WithDrawDialog = withModal(WithdrawMagin)
const BalanceListDialog = withModal(BalanceList)


function PositionList({ wallet, trading, version, lang, type, loading }) {
  const [direction, setDirection] = useState('LONG');
  const [closing, setClosing] = useState(false);
  const [closingIndex, setClosingIndex] = useState(null);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false);
  const [balanceListModalIsOpen, setBalanceListModalIsOpen] = useState(false);
  const [balance, setBalance] = useState('');
  const [balanceContract, setBalanceContract] = useState('');
  const [availableBalance, setAvailableBalance] = useState('');

  const [positions, setPositions] = useState([]);

  useEffect(() => {
    if (wallet.isConnected() && trading.positions) {
      setPositions(trading.positions)
    }
  }, [wallet.detail.account, trading.positions])

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

  const onClosePosition = async (symbolId, volume, index) => {
    setClosing(true)
    setClosingIndex(index)
    const res = await closePosition(wallet.detail.chainId, trading.config.pool, wallet.detail.account, symbolId).finally(() => { setClosing(false); setClosingIndex(null) })
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

  const onSelect = (symbolId) => {
    const selectedConfig = trading.configs.find(config => config.pool === trading.config.pool && symbolId === config.symbolId)
    if (selectedConfig) {
      loading.loading();
      trading.pause();
      trading.setConfig(selectedConfig)
      trading.onSymbolChange(selectedConfig, () => loading.loaded(), type.isOption);
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
      <div className='p1-box theader'>
        <div className='dyn-eff-bal'>
          {lang['dynamic-effective-balance']} : &nbsp;
          <span>
            {(version.isV1 || version.isV2Lite || type.isOption || version.isOpen)
              ? <TipWrapper block={false}>
                <span
                  className='open-add'
                  id='openAddMargin'
                  onClick={() => setRemoveModalIsOpen(true)}
                  tip={lang['remove-margin']}
                >
                  <img src={removeMarginIcon} alt='add margin' />
                </span>
              </TipWrapper>
              : <TipWrapper block={false}>
                <span
                  className='open-add'
                  id='openAddMargin'
                  tip={lang['remove-margin']}
                  onClick={() => setBalanceListModalIsOpen(true)}
                >
                  <img src={removeMarginIcon} alt='add margin' />
                </span>
              </TipWrapper>
            }

            <DeriNumberFormat allowZero={true} value={balanceContract} decimalScale={2} />

            {(version.isV1 || version.isV2Lite || type.isOption || version.isOpen)
              ? <TipWrapper block={false}>
                <span className='open-remove'
                  onClick={() => setAddModalIsOpen(true)}
                  tip={lang['add-margin']}
                >
                  <img src={addMarginIcon} alt='add margin' />
                </span>
              </TipWrapper>

              : <TipWrapper block={false}>
                <span className='open-remove'
                  onClick={() => setBalanceListModalIsOpen(true)}
                  tip={lang['add-margin']}
                  >
                  <img src={addMarginIcon} alt='add margin' />
                </span>
              </TipWrapper>}
            {/* {  (<span className='balance-list-btn' onClick={() => setBalanceListModalIsOpen(true)}><img src={marginDetailIcon} alt='Remove margin' /> {lang['detail']}</span>)} */}
          </span>
        </div>
        {type.isOption && <> <div className='liquidation-price'>
          <TipWrapper block={false}><span className='funding-fee' tip={lang['liq-price-hover-one']}>{lang['liquidation-price']}  </span></TipWrapper>
        : <LiqPrice wallet={wallet} trading={trading} lang={lang} />
        </div>
        </>
        }
      </div>

      <div className='p-box theader'>
        <div className='position-symbol'>{lang['symbol']}</div>
        <div className='position'>{lang['position']}</div>
        <div className='ave-entry-price'>{lang['average-entry-price']}</div>
        <div className='direction'>{lang['direction']}</div>
        <div className='margin'>{lang['margin']}</div>
        <div className='unrealized-pnl'>{lang['unrealized-pnl']}</div>
        <div><TipWrapper><span className='funding-fee' tip={lang['funding-fee-tip']} >{lang['funding-fee']}</span></TipWrapper> </div>
        {type.isFuture && <>
          <div className='unrealized-pnl'>{lang['liquidation-price']} </div>
        </>}
      </div>
      {positions.map((pos, index) => {
        return (
          <div className='p-box tbody' key={index}>
            <div className='position-symbol' onClick={() => onSelect(pos.symbolId)}>{pos.symbol}</div>
            <div className='position'>
              <DeriNumberFormat value={pos.volume} allowZero={true} />
              <span className='close-position'>
                {/* {closingIndex !== index &&<>
              tip={lang['close-is-position']}
                <TipWrapper block={false}> */}
                <img style={{ display: closingIndex !== index ? 'inline-block' : 'none' }} src={closePosImg} onClick={() => { onClosePosition(pos.symbolId, pos.volume, index) }} />
                {/* </TipWrapper>
              </>}  */}
                <span
                  className='spinner spinner-border spinner-border-sm'
                  role='status'
                  aria-hidden='true'
                  style={{ display: closing && closingIndex === index ? 'block' : 'none' }}
                ></span>
              </span>
            </div>
            <div className='ave-entry-price'><DeriNumberFormat value={pos.averageEntryPrice} decimalScale={4} /></div>
            <div className={pos.direction}>{lang[pos.direction.toLowerCase()] || pos.direction}</div>
            <div className='margin'><DeriNumberFormat value={pos.marginHeldBySymbol} decimalScale={2} /></div>
            <div className='pnl'>
              <span className='pnl-list unrealized-pnl'>
                <DeriNumberFormat value={pos.unrealizedPnl} decimalScale={6} />
              </span>
            </div>
            {type.isOption && <div><DeriNumberFormat value={(-(pos.premiumFundingAccrued))} decimalScale={8} /></div>}
            {type.isFuture && <div><DeriNumberFormat value={(-(pos.fundingFee))} decimalScale={8} /></div>}
            {type.isFuture && <div><DeriNumberFormat value={pos.liquidationPrice} decimalScale={4} /></div>}
          </div>
        )
      })}
      {!positions.length ? <div className='no-data'>{lang['no-data']}</div> : ''}

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


function LiqPrice({ wallet, trading, lang }) {
  const [element, setElement] = useState(<span></span>)

  const liqText = (positions, index) => {
    let ele = <span key={index}>--</span>;
    if (positions.numPositions > 1) {
      if (positions.price1 && positions.price2) {
        ele = <span key={index}>
          <span>{positions.underlier}: </span>
          <span>
            <DeriNumberFormat decimalScale={2} value={positions.price1} />
            <span> / </span>
            <DeriNumberFormat decimalScale={2} value={positions.price2} />
          </span>
        &nbsp;
        </span>
      } else if (!positions.price1 && !positions.price2) {
        ele = <span key={index}>
          <span>{positions.underlier}: </span>
          <span>
            <TipWrapper block={false}> <span className='funding-fee' tip={lang['liq-price-hover-three']}> ? </span></TipWrapper>
            <span> / </span>
            <TipWrapper block={false}>   <span className='funding-fee' tip={lang['liq-price-hover-three']}> ? </span></TipWrapper>
          </span>
        &nbsp;
        </span>
      } else if (!positions.price1 && positions.price2) {
        ele =
          <span key={index}>
            <span>{positions.underlier}: </span>
            <span>
              <TipWrapper block={false}> <span className='funding-fee' tip={lang['liq-price-hover-three']}> ? </span>  </TipWrapper>
              <span> / </span>
              <span> <DeriNumberFormat decimalScale={2} value={positions.price2} /> </span>
            </span>
        &nbsp;
        </span>
      } else if (positions.price1 && !positions.price2) {
        ele = <span key={index}>
          <span>{positions.underlier}: </span>
          <span>
            <span> <DeriNumberFormat decimalScale={2} value={positions.price1} /> </span>
            <span> / </span>
            <TipWrapper block={false}> <span className='funding-fee' tip={lang['liq-price-hover-three']}> ? </span></TipWrapper>
          </span>
        &nbsp;
        </span>
      }
      return ele
    } else {
      if (positions.price1 && positions.price2) {
        ele = <span key={index}>
          <span>{positions.underlier}: </span>
          <span>
            <DeriNumberFormat decimalScale={2} value={positions.price1} />
            <span> / </span>
            <DeriNumberFormat decimalScale={2} value={positions.price2} />
          </span>
        &nbsp;
        </span>
      } else if (!positions.price1 && !positions.price2) {
        ele = <span key={index}>
          <span>{positions.underlier}: </span>
          <span>
            <TipWrapper block={false}> <span className='funding-fee' tip={lang['liq-price-hover-two']}> -- </span></TipWrapper>
            <span> / </span>
            <TipWrapper block={false}> <span className='funding-fee' tip={lang['liq-price-hover-two']}> -- </span></TipWrapper>
          </span>
        &nbsp;
        </span>
      } else if (!positions.price1 && positions.price2) {
        ele =
          <span key={index}>
            <span>{positions.underlier}: </span>
            <span>
              <TipWrapper block={false}> <span className='funding-fee' tip={lang['liq-price-hover-two']}> -- </span></TipWrapper>
              <span> / </span>
              <span> <DeriNumberFormat decimalScale={2} value={positions.price2} /> </span>
            </span>
        &nbsp;
        </span>

      } else if (positions.price1 && !positions.price2) {
        ele = <span key={index}>
          <span>{positions.underlier}: </span>
          <span>
            <span> <DeriNumberFormat decimalScale={2} value={positions.price1} /> </span>
            <span> / </span>
            <TipWrapper block={false}> <span className='funding-fee' tip={lang['liq-price-hover-two']}> -- </span></TipWrapper>
          </span>
        &nbsp;
        </span>
      }
      return ele
    }
  }

  useEffect(() => {
    if (wallet.isConnected() && trading.positions) {
      if (trading.positions.length && trading.positions.length > 0) {
        if (trading.positions[0].liquidationPrice && trading.positions[0].liquidationPrice.length) {
          let elem = trading.positions[0].liquidationPrice.map((item, index) => {
            let ele = liqText(item, index)
            return ele
          })
          setElement(elem)
        }
      } else {
        setElement('')
      }
    }
  }, [wallet, trading.positions])

  return (
    <span>
      {element}
    </span>
  )
}

export default inject('wallet', 'trading', 'version', 'type', 'loading')(observer(PositionList))