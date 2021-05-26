import React, { useState, useEffect } from 'react'
import withModal from '../../hoc/withModal';
import DepositMargin from './DepositMargin';
import WithdrawMagin from './WithdrawMargin';
import removeMarginIcon from '../../../assets/img/remove-margin.svg'
import addMarginIcon from '../../../assets/img/add-margin.svg'
import DeriNumberFormat from '../../../utils/DeriNumberFormat';
import { getPoolBTokensBySymbolId } from '../../../lib/web3js/v2';

const AddMarginDialog = withModal(DepositMargin)
const RemoveMarginDialog = withModal(WithdrawMagin)

export function BalanceList({wallet,spec,afterDepositAndWithdraw,position,onClose}){  
  const [depositAndWithdragList, setDepositAndWithdragList] = useState([]);
  const limit = parseInt((document.body.offsetHeight - 140)/54)
  const [placeholdList, setPlaceholdList] = useState(Array.from({length : limit}));
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false);
  const [balance, setBalance] = useState('');
  const [availableBalance, setAvailableBalance] = useState('');

  const closeAddMargin = () => setAddModalIsOpen(false)

  const closeRemoveMargin = () => setRemoveModalIsOpen(false)

  const closeCurrent = () => {
    afterDepositAndWithdraw();
    onClose();
  }
  const addMargin = (balance,bTokenId) => {                              
    setBalance(balance);
    setAddModalIsOpen(true)
    spec.bTokenId = bTokenId
  }
  const removeMargin = (availableBalance) => {
    setAvailableBalance(availableBalance);
    setRemoveModalIsOpen(true);
  }

  const afterDeposit = () => {
    setAddModalIsOpen(false);
    loadBalanceList();
  }

  const afterWithdraw = () => {
    setRemoveModalIsOpen(false);
    loadBalanceList();
  }

  const loadBalanceList = async () => {
    if(wallet.detail.account && spec){
      const list = await getPoolBTokensBySymbolId(wallet.detail.chainId,spec.pool,wallet.detail.account,spec.symbolId)
      setDepositAndWithdragList(list)
      if(list.length < limit){
        setPlaceholdList(Array.from({length : limit - list.length}));
      }
    }
  }

  useEffect(() => {
    loadBalanceList();
    window.scrollTo(0, 0);
    document.querySelector('body').style.overflow = 'hidden'
    return () => {
      document.querySelector('body').style.overflow = 'auto'
    };
  }, [wallet.detail.account,spec]);

  return(
    <>
      <div className='modal fade'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <div className='title'>Balance in contract</div>
              <div className='close' data-dismiss='modal' onClick={closeCurrent}>
                <span>&times;</span>
              </div>
            </div>
            <div className='modal-body'>
              <div className='balance-list'>
                <div className='row header'>
                  <span className='btoken pc'>Base Token</span>
                  <span className='btoken mobile'>B Token</span>
                  <span className='w-balance pc'>Wallet Balance</span>
                  <span className='w-balance mobile'>Wal Bal</span>
                  <span className='avail-balance pc'>Available Balance</span>
                  <span className='avail-balance mobile'>Avail Bal</span>
                </div>
                {depositAndWithdragList.map((item,index) => (                  
                  <div className='row' key={index}>
                    <span className='btoken'>{item.bTokenSymbol}</span>
                    <span className='w-balance'><DeriNumberFormat value={item.walletBalance} fixedDecimalScale decimalScale={2}/></span>
                    <span className='avail-balance'><DeriNumberFormat value={item.availableBalance} fixedDecimalScale decimalScale={2}/></span>
                    <span className='action'>
                      <span
                        className='add-margin'
                        id='openAddMargin'
                        onClick={() => addMargin(item.walletBalance,item.bTokenId)}> 
                        <img src={removeMarginIcon} alt='add margin'/> Add
                      </span>
                      <span className='remove-margin'
                        onClick={() => removeMargin(item.availableBalance)}>
                        <img src={addMarginIcon} alt='add margin'/> Remove
                      </span>
                    </span>
                  </div>
                ))}
                {placeholdList.map(item => <div className='row'></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddMarginDialog  wallet={wallet} onClose={closeAddMargin} balance={balance} spec={spec} 
                        position={position} modalIsOpen={addModalIsOpen} afterDeposit={afterDeposit} className='trading-dialog'/>
      <RemoveMarginDialog wallet={wallet} onClose={closeRemoveMargin} spec={spec} 
                          position={position} modalIsOpen={removeModalIsOpen} afterWithdraw={afterWithdraw} availableBalance={availableBalance} className='trading-dialog'/>
    </>
  )
}