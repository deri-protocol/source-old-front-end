/* eslint-disable react/jsx-no-target-blank */
import React,{useEffect,useState} from 'react'
import {inject,observer} from 'mobx-react'
import Button from '../Button/Button'
import {mintTERC20} from '../../lib/web3js/indexV2'
function Faucet({wallet={},lang}){
  const bToken = {
    "tbusd" : "0xaa2B8115c094445e96C2CD951c17a30F41867323",
    "tweth" : "0x8e60B350FA4fbaF209712bB721373364DE858A5d",
  }
  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account
  
  const mintTBUSD = async ()=>{
    if(hasConnectWallet()){
      let res = await mintTERC20(wallet.detail.chainId,bToken.tbusd,wallet.detail.account)
      if(res.success){

      }
    }
  }
  const mintTWETH = async ()=>{
    if(hasConnectWallet()){
      let res = await mintTERC20(wallet.detail.chainId,bToken.tweth,wallet.detail.account)
      if(res.success){
        
      }
    }
  }

  return(
    <div className='faucet-box'>
      <div class='title'>
        {lang['obtain-testnet-token']}
      </div>
      <div class='BUSD'>
        <Button className='btn' click={mintTBUSD} btnText={lang['tbusd']} lang={lang} />
      </div>
      <div class='WETH'>
      <Button className='btn' click={mintTWETH} btnText={lang['tweth']} lang={lang} />
      </div>
      <div class='go-to-bnb'>
        {lang['go-to-bnb']}
      </div>
      <div class='BNB'>
        <a target="_blank" href='https://testnet.binance.org/faucet-smart'>
          {lang['bnb']}
        </a>
      </div>
    </div>
  )
}

export default inject('wallet')(observer(Faucet))