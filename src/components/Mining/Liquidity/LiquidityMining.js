import walletManager from '../../../lib/account/WalletManager';
import Claim from '../../Claim/Claim';
import Liquidity from './Liquidity';


export default function LiquidityMining(props){
	const wallet = walletManager.getWallet();
  return (
    <div className="liquidity-info">
      <Claim wallet={wallet}/>
      <Liquidity wallet={wallet} {...props}/>
</div>)
}