import { getPreminingContractConfig } from "../config"

describe('config', () => {
  it('getPreminingContractConfig', () => {
    expect(getPreminingContractConfig('prod').length).toEqual(8)
  })
})