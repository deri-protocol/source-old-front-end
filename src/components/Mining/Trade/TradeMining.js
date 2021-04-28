import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom'
import {getUserInfoAll,getUserInfoInPool,deriToNatural,getPoolInfoApy} from '../../../lib/web3js/index'
import WalletManager from '../../../lib/account/WalletManager';
import Claim from '../../Claim/Claim';
import Liquidity from './Liquidity';

export default function TradeMining(props){
	const wallet = WalletManager.getWallet();
  return(
    <div className="trade-info">
      <Claim wallet={wallet}/>
			<Liquidity wallet={wallet} {...props}/>
  </div>
  )
}