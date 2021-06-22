import {
  PerpetualPoolRouter
} from '../contract/perpetual_pool_router'
import {TIMEOUT, ROUTER_ADDRESS, POOL_ADDRESS} from './setup'

describe('perpetualPoolRouter', () => {
  let perpetualPoolRouter
  beforeAll(() => {
    perpetualPoolRouter = new PerpetualPoolRouter('97', ROUTER_ADDRESS, true)
  })
  test('pool()', async() => {
    const output =  POOL_ADDRESS
    expect(await perpetualPoolRouter.pool()).toEqual(output)
  }, TIMEOUT)
})