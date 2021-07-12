import { ContractBase } from './contract_base'
import { pTokenAirdropAbi } from './abis'

export class PTokenAirdrop extends ContractBase {
  constructor(chainId, poolAddress) {
    super(chainId, poolAddress, pTokenAirdropAbi)
  }
  async getBTokenBalance() {
    return await this._call('getBTokenBalance', [])
  }
  async airdropPToken(accountAddress) {
    return await this._transact('airdropPToken', [], accountAddress)
  }
}