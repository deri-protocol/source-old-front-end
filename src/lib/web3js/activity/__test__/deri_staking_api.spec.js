import { DeriEnv } from "../../shared"
import { getStakingTop10Users, getUserStakingContribution, getUserStakingInfo, getUserStakingReward } from "../api/deri_staking"

const TIMEOUT = 20000

const account = '0xa23b5c3da552ad5bf84648fec5c86540a0bf0db8'

describe('deri staking', () => {
  it('getStakingTop10Users', async() => {
    expect(await getStakingTop10Users()).toEqual([])
  }, TIMEOUT)
  it('getUserStakingInfo', async() => {
    expect(await getUserStakingInfo(account)).toEqual({})
  }, TIMEOUT)
  it('getUserStakingReward', async() => {
    expect(await getUserStakingReward(account)).toEqual({})
  }, TIMEOUT)
  it('getUserStakingContribution', async() => {
    DeriEnv.set('prod')
    //expect(await getUserStakingContribution(account)).toEqual({})
    expect(await getUserStakingContribution('0xFefC938c543751babc46cc1D662B982bd1636721')).toEqual({})
    DeriEnv.set('dev')
  }, TIMEOUT)
})