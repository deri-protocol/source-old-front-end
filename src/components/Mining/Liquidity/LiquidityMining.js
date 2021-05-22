import Claim from '../../Claim/Claim';
import Liquidity from './Liquidity';


function LiquidityMining(props){
  return (
    <div className="liquidity-info">
      <Claim {...props} miningClaim={true}/>
      <Liquidity {...props}/>
  </div>)
}

export default LiquidityMining