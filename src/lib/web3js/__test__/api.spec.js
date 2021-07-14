import { isUnlocked } from '../api/contractQueryApi';
import { getPreminingPoolInfo } from '../api/databaseApi';

describe('api', () => {
  test('isUnlocked()', async () => {
    const output = true
    const res = await isUnlocked('97', '0x372b640A00a0A6B73381e9363A39644a712cCc37', '0xfefc938c543751babc46cc1d662b982bd1636721', true)
    expect(res).toEqual(output);
  }, 30000);
  test('getPreminingPoolInfo', async () => {
    const output = {}
    //const res = await isUnlocked('56', '0xAf081e1426f64e74117aD5F695D2A80482679DE5', '0xfefc938c543751babc46cc1d662b982bd1636721')
    const res = await getPreminingPoolInfo('56', '0xA51E3D1a0A6E9114c22728991dDFdd62a9ABd9ad')
    expect(res).toEqual(output);
  }, 30000);
});
