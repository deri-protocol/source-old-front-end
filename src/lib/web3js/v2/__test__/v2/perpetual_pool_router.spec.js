import {
  perpetualPoolRouterFactory
} from '../../factory'
import {TIMEOUT, ROUTER_ADDRESS, POOL_ADDRESS} from '../setup'

describe('perpetualPoolRouter', () => {
  let perpetualPoolRouter
  beforeAll(() => {
    perpetualPoolRouter = perpetualPoolRouterFactory('97', ROUTER_ADDRESS)
  })
  test('pool()', async() => {
    const output =  POOL_ADDRESS
    expect(await perpetualPoolRouter.pool()).toEqual(output)
  }, TIMEOUT)
})