import { getStakingBalance, getTotalStakingBalance, getTotalStakingScore, getStakingScore } from "../api/deri_staking"

const STAKING_ACCOUNT_ADDRESS = '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF'
const TIMEOUT = 20000

describe('deri staking', () => {
  it('getDeriBalance', async() => {
    expect(await getStakingBalance('97', STAKING_ACCOUNT_ADDRESS)).toEqual('17')
  }, TIMEOUT)
  it('getTotalDeriBalance', async() => {
    expect(await getTotalStakingBalance('97')).toEqual('17')
  }, TIMEOUT)
  it('getStakingStore', async() => {
    expect(await getStakingScore('97', STAKING_ACCOUNT_ADDRESS)).toEqual('')
  }, TIMEOUT)
  it('getTotalStakingStore', async() => {
    expect(await getTotalStakingScore('97')).toEqual('')
  }, TIMEOUT)
})