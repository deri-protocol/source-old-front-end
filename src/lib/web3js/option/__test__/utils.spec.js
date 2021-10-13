import { TIMEOUT } from "../../shared/__test__/setup"
import { volatilityCache } from "../utils"

describe('cache', () => {
  it('volitilityCache', async() => {
    let res = await volatilityCache.get('VOL-BTCUSD')
    res = await volatilityCache.get('VOL-BTCUSD')
    expect(res).toEqual('')
  }, TIMEOUT)
})