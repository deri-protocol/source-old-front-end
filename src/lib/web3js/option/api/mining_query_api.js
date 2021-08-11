import { getPoolConfig } from '../../shared/config';
import { catchApiError, bg } from '../../shared/utils';
import { calculateMaxRemovableShares, calculateShareValue } from '../../v1/calculation';
import { lTokenOptionFactory, pTokenOptionFactory, everlastingOptionFactory, everlastingOptionViewerFactory} from '../factory';


const _getLiquidityInfo = async(chainId, poolAddress, accountAddress) => {
  const { lToken:lTokenAddress, pToken:pTokenAddress} = getPoolConfig(poolAddress, '0', '0', 'option')
  const optionPool = everlastingOptionFactory(chainId, poolAddress)
  const lToken = lTokenOptionFactory(chainId, lTokenAddress)
  const pToken = pTokenOptionFactory(chainId, pTokenAddress)
  const poolViewer = everlastingOptionViewerFactory(chainId, optionPool.viewerAddress)
  const [lTokenBalance, lTokenTotalSupply, symbolIds, state] = await Promise.all([
    lToken.balanceOf(accountAddress),
    lToken.totalSupply(),
    pToken.getActiveSymbolIds(),
    poolViewer.getPoolStates(poolAddress, []),
  ])

  const { poolState } = state
  const { initialMarginRatio, liquidity, totalDynamicEquity } = poolState;
  let promises = []
  for (let i = 0; i < symbolIds.length; i++) {
    promises.push(optionPool.getSymbol(symbolIds[i]));
  }
  const symbols = await Promise.all(promises)
  // const totalPnl = symbols.reduce((acc, s) => {
  //   return acc.plus(bg(s.tradersNetVolume).times(s.strikePrice).times(s.multiplier).minus(s.tradersNetCost))
  // }, bg(0))
  // const poolDynamicEquity = bg(liquidity).minus(totalPnl)
  const cost = symbols.reduce((acc, s) => acc.plus(s.tradersNetCost), bg(0))
  const value = symbols.reduce((acc, s) => acc.plus(bg(s.tradersNetVolume).times(s.strikePrice).times(s.multiplier)), bg(0))
  return {
    totalSupply: lTokenTotalSupply.toString(),
    poolLiquidity: liquidity.toString(),
    shares: lTokenBalance.toString(),
    shareValue: calculateShareValue(
      lTokenTotalSupply,
      totalDynamicEquity,
    ).toString(),
    maxRemovableShares: calculateMaxRemovableShares(
      lTokenBalance,
      lTokenTotalSupply,
      liquidity,
      value,
      cost,
      bg(initialMarginRatio).times(10),
    ).toString(),
  };
}

export const getLiquidityInfo = async(chainId, poolAddress, accountAddress) => {
  return catchApiError(
    _getLiquidityInfo,
    [chainId, poolAddress, accountAddress],
    'getLiquidityInfo',
    {
      totalSupply: '',
      poolLiquidity: '',
      shares: '',
      shareValue: '',
      maxRemovableShares: '',
    }
  );
}