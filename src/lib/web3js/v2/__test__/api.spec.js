import { DeriEnv } from '../../config'
import { getFundingFee } from '../api'
import { POOL_ADDRESS, ACCOUNT_ADDRESS, TIMEOUT} from './setup'

describe("api", () => {
  test('getFundingFee()', async() => {
    const output = '-21.998'
    // const fundingFee = await getFundingFee('97', POOL_ADDRESS, ACCOUNT_ADDRESS, '0', true)
    // expect(fundingFee).toEqual(output)
    DeriEnv.set('prod')
    const fundingFee2 = await getFundingFee('56', '0x19c2655A0e1639B189FB0CF06e02DC0254419D92', '0x3fA3f80f18De2528755b9054E23525c0fbf597Fe', '1', true)
    expect(fundingFee2).toEqual(output)
  }, TIMEOUT)
})