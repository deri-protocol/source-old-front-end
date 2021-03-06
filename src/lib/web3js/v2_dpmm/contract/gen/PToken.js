// this file is generated by script, don't modify it !!!
import { ContractBase } from '../../../shared/contract/contract_base.js'
import { deleteIndexedKey } from '../../../shared/utils/web3.js'
import { pTokenAbi } from '../abi/pTokenAbi.js'

export class PToken extends ContractBase {
  // init
  constructor(chainId, contractAddress, initialBlock) {
    super(chainId, contractAddress, pTokenAbi)
    // for pool use
    if (initialBlock) {
      this.initialBlock = initialBlock
    }
  }

  // query
  async balanceOf(owner) {
    const res = await this._call('balanceOf', [owner])
    return deleteIndexedKey(res)
  }
  async exists(owner) {
    const res = await this._call('exists', [owner])
    return deleteIndexedKey(res)
  }
  //  async getApproved(tokenId) {
  //    const res = await this._call('getApproved', [tokenId])
  //    return deleteIndexedKey(res)
  //  }
  async getMargin(owner, bTokenId) {
    const res = await this._call('getMargin', [owner, bTokenId])
    return deleteIndexedKey(res)
  }
  async getMargins(owner) {
    const res = await this._call('getMargins', [owner])
    return deleteIndexedKey(res)
  }
  async getPosition(owner, symbolId) {
    const res = await this._call('getPosition', [owner, symbolId])
    return deleteIndexedKey(res)
  }
  async getPositions(owner) {
    const res = await this._call('getPositions', [owner])
    return deleteIndexedKey(res)
  }
  //  async getTokenId(owner) {
  //    const res = await this._call('getTokenId', [owner])
  //    return deleteIndexedKey(res)
  //  }
  //  async isApprovedForAll(owner, operator) {
  //    const res = await this._call('isApprovedForAll', [owner, operator])
  //    return deleteIndexedKey(res)
  //  }
  async name() {
    const res = await this._call('name', [])
    return deleteIndexedKey(res)
  }
  async numBTokens() {
    const res = await this._call('numBTokens', [])
    return deleteIndexedKey(res)
  }
  async numSymbols() {
    const res = await this._call('numSymbols', [])
    return deleteIndexedKey(res)
  }
  //  async ownerOf(tokenId) {
  //    const res = await this._call('ownerOf', [tokenId])
  //    return deleteIndexedKey(res)
  //  }
  async pool() {
    const res = await this._call('pool', [])
    return deleteIndexedKey(res)
  }
  //  async supportsInterface(interfaceId) {
  //    const res = await this._call('supportsInterface', [interfaceId])
  //    return deleteIndexedKey(res)
  //  }
  async symbol() {
    const res = await this._call('symbol', [])
    return deleteIndexedKey(res)
  }
  async totalMinted() {
    const res = await this._call('totalMinted', [])
    return deleteIndexedKey(res)
  }
  async totalSupply() {
    const res = await this._call('totalSupply', [])
    return deleteIndexedKey(res)
  }

  // tx
  //  async approve(accountAddress, operator, tokenId) {
  //    return await this._transact('approve', [operator, tokenId], accountAddress)
  //  }
  //  async burn(accountAddress, owner) {
  //    return await this._transact('burn', [owner], accountAddress)
  //  }
  //  async mint(accountAddress, owner) {
  //    return await this._transact('mint', [owner], accountAddress)
  //  }
  //  async safeTransferFrom(accountAddress, from, to, tokenId) {
  //    return await this._transact('safeTransferFrom', [from, to, tokenId], accountAddress)
  //  }
  //  async safeTransferFrom(accountAddress, from, to, tokenId, data) {
  //    return await this._transact('safeTransferFrom', [from, to, tokenId, data], accountAddress)
  //  }
  //  async setApprovalForAll(accountAddress, operator, approved) {
  //    return await this._transact('setApprovalForAll', [operator, approved], accountAddress)
  //  }
  //  async setNumBTokens(accountAddress, num) {
  //    return await this._transact('setNumBTokens', [num], accountAddress)
  //  }
  //  async setNumSymbols(accountAddress, num) {
  //    return await this._transact('setNumSymbols', [num], accountAddress)
  //  }
  //  async setPool(accountAddress, newPool) {
  //    return await this._transact('setPool', [newPool], accountAddress)
  //  }
  //  async transferFrom(accountAddress, from, to, tokenId) {
  //    return await this._transact('transferFrom', [from, to, tokenId], accountAddress)
  //  }
  //  async updateMargin(accountAddress, owner, bTokenId, amount) {
  //    return await this._transact('updateMargin', [owner, bTokenId, amount], accountAddress)
  //  }
  //  async updateMargins(accountAddress, owner, margins) {
  //    return await this._transact('updateMargins', [owner, margins], accountAddress)
  //  }
  //  async updatePosition(accountAddress, owner, symbolId, position) {
  //    return await this._transact('updatePosition', [owner, symbolId, position], accountAddress)
  //  }

}