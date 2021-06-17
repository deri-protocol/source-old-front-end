import {
  PerpetualPoolRouter
} from '../contract/perpetual_pool_router'
import fetch from 'node-fetch'
global.fetch = fetch

const TIMEOUT=20000

describe('perpetualPoolRouter', () => {
  let perpetualPoolRouter
  beforeAll(() => {
    perpetualPoolRouter = new PerpetualPoolRouter('97', '0xaDEe3A9149ee1FBa712aB081c5A6067D613571C1', true)
  })
  test('pool()', async() => {
    const output = '0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5'
    expect(await perpetualPoolRouter.pool()).toEqual(output)
  }, TIMEOUT)
})