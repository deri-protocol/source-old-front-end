import Claim from '../../Claim/Claim';
import Liquidity from './Liquidity';


function LiquidityMining(props){
  return (
    <div className="liquidity-info">
      {props.version !== 'v2_lite_open' &&<Claim {...props} miningClaim={true}/>}
      <Liquidity {...props}/>
  </div>)
}

export default LiquidityMining