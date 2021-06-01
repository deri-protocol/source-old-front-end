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
    const output = '0x19EC6281749C06Ed9647134c57257AcA1508bFA8'
    expect(await perpetualPoolRouter.pool()).toEqual(output)
  }, TIMEOUT)
})