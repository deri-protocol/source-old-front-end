import {
  getPoolLiquidity,
  getLiquidityInfo,
} from '../../api/v2/mining_query_api'
import { TIMEOUT, ACCOUNT_ADDRESS, POOL_ADDRESS } from '../setup';

describe('Mining query api', () => {
  it('getPoolLiquidity()', async() => {
    const input = ['97', POOL_ADDRESS, '0', true]
    const output = {
      liquidity: '61000',
      symbol: '',
    };
    expect(await getPoolLiquidity(...input)).toEqual(output)
  }, TIMEOUT)
  it('getLiquidityInfo()', async() => {
    const input = ['97', POOL_ADDRESS, ACCOUNT_ADDRESS, '0', true]
    const output = {
      maxRemovableShares: '1000',
      poolLiquidity: '61000',
      shares: '1000',
      pnl: '11.734170158538938'
    };
    expect(await getLiquidityInfo(...input)).toEqual(output)
    //DeriEnv.set('dev')
  }, TIMEOUT)
})