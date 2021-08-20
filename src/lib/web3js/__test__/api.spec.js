//import { isUnlocked } from '../api/contractQueryApi';
import { TIMEOUT, ACCOUNT_ADDRESS, POOL_V1_ADDRESS } from '../shared/__test__/setup';
import { bg } from '../shared/utils';
import { getLiquidityInfo, isUnlocked } from '../indexV2';
import { getContractAddressConfig } from '../api_wrapper';

describe('api', () => {
  test('isUnlocked()', async () => {
    const output = true
    const res = await isUnlocked('97', POOL_V1_ADDRESS, ACCOUNT_ADDRESS)
    expect(res).toEqual(output);
  }, TIMEOUT);
  it('getLiquidityInfo V2 lite', async() => {
    const res = await getLiquidityInfo('97', POOL_V1_ADDRESS, '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF')
    expect(res).toHaveProperty('totalSupply');
    expect(res).toHaveProperty('poolLiquidity');
    expect(res).toHaveProperty('shares');
    expect(res).toHaveProperty('shareValue');
    expect(res).toHaveProperty('maxRemovableShares');
    expect(bg(res.totalSupply).toNumber()).toBeGreaterThan(100);
  }, TIMEOUT );
  it('getPoolConfigList', () => {
    const configList = getContractAddressConfig('prod', 'v2_lite_open')
    expect(configList.length).toEqual(2)
    expect(configList[0]).toEqual({})
  })
});
