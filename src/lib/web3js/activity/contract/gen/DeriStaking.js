// this file is generated by script, don't modify it !!!
import { ContractBase } from '../../../shared/contract/contract_base.js'
import { deleteIndexedKey } from '../../../shared/utils'
import { deriStakingAbi } from '../abi/deriStakingAbi.js'

export class DeriStaking extends ContractBase {
  // init
  constructor(chainId, contractAddress, initialBlock) {
    super(chainId, contractAddress, deriStakingAbi)
    // for pool use
    if (initialBlock) {
      this.initialBlock = initialBlock
    }
  }

  // query
  //  async deriAddress() {
  //    const res = await this._call('deriAddress', [])
  //    return deleteIndexedKey(res)
  //  }
  //  async epochEndTimestamp() {
  //    const res = await this._call('epochEndTimestamp', [])
  //    return deleteIndexedKey(res)
  //  }
  //  async epochStartTimestamp() {
  //    const res = await this._call('epochStartTimestamp', [])
  //    return deleteIndexedKey(res)
  //  }
  async getAccountBalance(account) {
    const res = await this._call('getAccountBalance', [account])
    return deleteIndexedKey(res)
  }
  async getAccountScore(account) {
    const res = await this._call('getAccountScore', [account])
    return deleteIndexedKey(res)
  }
  async getTotalBalance() {
    const res = await this._call('getTotalBalance', [])
    return deleteIndexedKey(res)
  }
  async getTotalScore() {
    const res = await this._call('getTotalScore', [])
    return deleteIndexedKey(res)
  }
  //  async ownerAddress() {
  //    const res = await this._call('ownerAddress', [])
  //    return deleteIndexedKey(res)
  //  }

  // tx
  async deposit(accountAddress, amount) {
    return await this._transact('deposit', [amount], accountAddress)
  }
  //  async setEpochTimestamp(accountAddress, startTimestamp, endTimestamp) {
  //    return await this._transact('setEpochTimestamp', [startTimestamp, endTimestamp], accountAddress)
  //  }
  async withdraw(accountAddress, amount) {
    return await this._transact('withdraw', [amount], accountAddress)
  }

}