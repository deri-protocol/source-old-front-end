import { DeriEnv } from '../config';
import { isUnlocked } from '../api/contractQueryApi';

describe('api', () => {
  test('isUnlocked()', async () => {
    const output = true
    DeriEnv.set('prod')
    //const res = await isUnlocked('56', '0xAf081e1426f64e74117aD5F695D2A80482679DE5', '0xfefc938c543751babc46cc1d662b982bd1636721')
    const res = await isUnlocked('56', '0xD3f5E6D1a25dA1E64EDf7cb571f9fAD17FEb623c', '0xfefc938c543751babc46cc1d662b982bd1636721')
    DeriEnv.set('dev')

    expect(res).toEqual(output);
  });
});
