import Claim from '../../Claim/Claim';
import Liquidity from './Liquidity';

export default function TradeMining({wallet,...props}){
  return(
    <div className="trade-info">
      <Claim {...props} wallet={wallet} tradingClaim={true}/>
			<Liquidity {...props}/>
  </div>
  )
}