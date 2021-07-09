//import { isUnlocked } from '../api/contractQueryApi';
import { getLiquidityInfo, isUnlocked } from '../indexV2';

describe('api', () => {
  test('isUnlocked()', async () => {
    const output = true
    const res = await isUnlocked('97', '0xb255702A263F1909f7De7569f57c9493Ac08EbfA', '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF')
    expect(res).toEqual(output);
  });
  it('getLiquidityInfo V2 lite', async() => {
    const output = {
      totalSupply: '65383.906200632777635848',
      poolLiquidity: '69482.233475609474967096',
      shares: '94.101741732381432575',
      shareValue: '1.06268097935906182',
      maxRemovableShares: '94.101741732381432575',
    }
    expect(await getLiquidityInfo('97', '0xb255702A263F1909f7De7569f57c9493Ac08EbfA', '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF')).toEqual(output)
  }, 20000)
});
