//import { isUnlocked } from '../api/contractQueryApi';
import { TIMEOUT, ACCOUNT_ADDRESS, POOL_V1_ADDRESS, OPTION_POOL_ADDRESS, CHAIN_ID, POOL_V2_ADDRESS, POOL_V2L_ADDRESS } from '../shared/__test__/setup';
import { bg } from '../shared/utils';
import { getLiquidityInfo, isUnlocked } from '../indexV2';
import { getContractAddressConfig, getPoolConfigList, getPositionInfos } from '../api_wrapper';
import { DeriEnv } from '../shared';

describe('api', () => {
  test('isUnlocked()', async () => {
    const output = true
    const res = await isUnlocked('97', POOL_V1_ADDRESS, ACCOUNT_ADDRESS)
    expect(res).toEqual(output);
  }, TIMEOUT);
  it('getLiquidityInfo for v2_lite', async() => {
    const res = await getLiquidityInfo('97', POOL_V1_ADDRESS, '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF')
    expect(res).toHaveProperty('totalSupply');
    expect(res).toHaveProperty('poolLiquidity');
    expect(res).toHaveProperty('shares');
    expect(res).toHaveProperty('shareValue');
    expect(res).toHaveProperty('maxRemovableShares');
    expect(bg(res.totalSupply).toNumber()).toBeGreaterThan(100);
  }, TIMEOUT );
  it('getPoolConfigList v2_lite_open', () => {
    const configList = getContractAddressConfig('prod', 'v2_lite_open')
    expect(configList.length).toEqual(2)
    expect(configList[0]).toEqual({})
  })
  it('getLiquidityInfo for option', async() => {
    const res = await getLiquidityInfo('97', OPTION_POOL_ADDRESS, '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF')
    expect(res).toHaveProperty('totalSupply');
    expect(res).toHaveProperty('poolLiquidity');
    expect(res).toHaveProperty('shares');
    expect(res).toHaveProperty('shareValue');
    expect(res).toHaveProperty('maxRemovableShares');
    expect(res).toEqual({});
    expect(bg(res.totalSupply).toNumber()).toBeGreaterThan(100);
  }, TIMEOUT );
  it('getPoolConfigList option', () => {
    const res = getContractAddressConfig('dev', 'option')
    expect(res.length).toEqual(12)
  })
  it('getPoolConfigList all', () => {
    DeriEnv.set('prod')
    const res = getPoolConfigList()
    DeriEnv.set('dev')
    expect(res.length).toEqual(7)
    //expect(res).toEqual({})
  })
  it('getPositionInfos', async() => {
    const res = await getPositionInfos(CHAIN_ID, POOL_V1_ADDRESS, ACCOUNT_ADDRESS)
    expect(res).toEqual([])
  }, TIMEOUT)
});
