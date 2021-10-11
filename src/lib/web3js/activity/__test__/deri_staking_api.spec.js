import { getStakingTop10Users, getUserStakingInfo, getUserStakingReward } from "../api/deri_staking"

const TIMEOUT = 20000

describe('deri staking', () => {
  it('getStakingTop10Users', async() => {
    expect(await getStakingTop10Users()).toEqual([])
  }, TIMEOUT)
  it('getUserStakingInfo', async() => {
    expect(await getUserStakingInfo('0xe33dc6024fb048d894deea298e5468bbb2108b7b')).toEqual({})
  }, TIMEOUT)
  it('getUserStakingReward', async() => {
    expect(await getUserStakingReward('0x432fcd67815d5cc72808a7815a02373fdee7d740')).toEqual({})
  }, TIMEOUT)
})