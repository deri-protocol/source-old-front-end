import { PerpetualPoolLiteViewer } from '../contract/PerpetualPoolLiteViewer'
const TIMEOUT = 20000

describe('viewer', () => {
  it('calulateK', async() => {
    const res = PerpetualPoolLiteViewer.calculateK('365.7', '1059.81', '2.3')
    expect(res.toString()).toEqual('0.793642256630905539')
  }, TIMEOUT)
  it('calulateDpmmPrice', async() => {
    const res = PerpetualPoolLiteViewer.calculateDpmmPrice('356.7', '0.793642256630905539', '37', '0.01')
    expect(res.toString()).toEqual('461.444111387890282131681')
  }, TIMEOUT)
  it('calulateDpmmCost', async() => {
    const res = PerpetualPoolLiteViewer.calculateDpmmCost('356.7', '0.793642256630905539', '37', '0.01', '9')
    expect(res.toString()).toEqual('42.6764934063181133007')
  }, TIMEOUT)
})