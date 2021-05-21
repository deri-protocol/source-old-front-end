import { bg } from '../utils'
import {
  PerpetualPoolRouter
} from '../contract/perpetual_pool_router'
import fetch from 'node-fetch'
import { perpetualPoolRouterAbi } from '../contract/abis'
global.fetch = fetch

const TIMEOUT=20000

describe('perpetualPoolRouter', () => {
  let perpetualPoolRouter
  beforeAll(() => {
    perpetualPoolRouter = new PerpetualPoolRouter('97', '0xaDEe3A9149ee1FBa712aB081c5A6067D613571C1', true)
  })
  test('pool()', async() => {
    const output = '0x7dB32101081B17E105283820b2Ed3659DFE21470'
    expect(await perpetualPoolRouter.pool()).toEqual(output)
  }, TIMEOUT)
})