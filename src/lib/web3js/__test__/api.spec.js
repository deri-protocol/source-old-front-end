//import { isUnlocked } from '../api/contractQueryApi';
import { TIMEOUT, ACCOUNT_ADDRESS, POOL_V1_ADDRESS, OPTION_POOL_ADDRESS, CHAIN_ID, POOL_V2_ADDRESS, POOL_V2L_ADDRESS } from '../shared/__test__/setup';
import { bg } from '../shared/utils';
import { getLiquidityInfo, isUnlocked } from '../indexV2';
<<<<<<< HEAD
import { getContractAddressConfig, getPoolConfigList, getSpecification } from '../api_wrapper';
=======
import { getContractAddressConfig, getPoolConfigList, getPositionInfos } from '../api_wrapper';
>>>>>>> dev
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
    expect(res.length).toEqual(4)
  })
  it('getPoolConfigList all', () => {
    DeriEnv.set('prod')
    const res = getPoolConfigList()
    DeriEnv.set('dev')
    expect(res.length).toEqual(7)
    //expect(res).toEqual({})
  })
  it('getPoolConfigList testnet', () => {
    DeriEnv.set('testnet')
    const res = getPoolConfigList()
    DeriEnv.set('dev')
    console.log(JSON.stringify(res, null, 2))
    //expect(res.length).toEqual(7)
    expect(res).toEqual({})
  })
  it('getSpecification testnet', async() => {
    DeriEnv.set('testnet')

    const res = await getSpecification('97', '0x43701b4bf0430DeCFA41210327fE67Bf4651604C', '0')
    DeriEnv.set('dev')
    //expect(res.length).toEqual(7)
    expect(res).toEqual({})
  }, TIMEOUT)
  it('getLiquidityInfo testnet', async() => {
    DeriEnv.set('testnet')

    const res = await getLiquidityInfo('97', '0x43701b4bf0430DeCFA41210327fE67Bf4651604C', ACCOUNT_ADDRESS)
    DeriEnv.set('dev')
    //expect(res.length).toEqual(7)
    expect(res).toEqual({})
  }, TIMEOUT)
  
  it('getPositionInfos', async() => {
    const res = await getPositionInfos(CHAIN_ID, POOL_V1_ADDRESS, ACCOUNT_ADDRESS)
    expect(res).toEqual([])
  }, TIMEOUT)
});
