// this file is generated by script, don't modify it !!!
import { ContractBase } from '../../../shared/contract/contract_base.js'
import { deleteIndexedKey } from '../../../shared/utils/web3.js'
import { offChainOracleAbi } from '../abi/offChainOracleAbi.js'

export class OffChainOracle extends ContractBase {
  // init
  constructor(chainId, contractAddress, initialBlock) {
    super(chainId, contractAddress, offChainOracleAbi)
    // for pool use
    if (initialBlock) {
      this.initialBlock = initialBlock
    }
  }

  // query
  //  async delayAllowance() {
  //    const res = await this._call('delayAllowance', [])
  //    return deleteIndexedKey(res)
  //  }
  async getPrice() {
    const res = await this._call('getPrice', [])
    return deleteIndexedKey(res)
  }
  //  async price() {
  //    const res = await this._call('price', [])
  //    return deleteIndexedKey(res)
  //  }
  async signer() {
    await this._init()
    //const res = await this._call('signer', [])
    const res = await this.contract.methods.signer().call()
    return deleteIndexedKey(res)
  }
  // for old offchain oracle
  async signatory() {
    await this._init()
    //const res = await this._call('signatory',[])
    const res = await this.contract.methods.signatory().call()
    return deleteIndexedKey(res)
  }
  async symbol() {
    const res = await this._call('symbol', [])
    return deleteIndexedKey(res)
  }

  //  async timestamp() {
  //    const res = await this._call('timestamp', [])
  //    return deleteIndexedKey(res)
  //  }

  // tx
  //  async setDelayAllowance(accountAddress, delayAllowance_) {
  //    return await this._transact('setDelayAllowance', [delayAllowance_], accountAddress)
  //  }
  //  async setSigner(accountAddress, signer_) {
  //    return await this._transact('setSigner', [signer_], accountAddress)
  //  }
  //  async updatePrice(accountAddress, timestamp_, price_, v_, r_, s_) {
  //    return await this._transact('updatePrice', [timestamp_, price_, v_, r_, s_], accountAddress)
  //  }

}