import { getDBProviderUrlsConfig } from '../config/database';
import { web3Factory } from '../factory/web3';
import { getAliveHttpServer, checkHttpServerIsAlive } from '../utils';

/* eslint-disable */
const CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"newController","type":"address"}],"name":"addController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"controllers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"oldController","type":"address"}],"name":"delController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"fromChainId","type":"uint256"},{"internalType":"address","name":"fromWormhole","type":"address"},{"internalType":"uint256","name":"toChainId","type":"uint256"},{"internalType":"address","name":"toWormhole","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"internalType":"structDatabase.Params1[]","name":"values","type":"tuple[]"}],"name":"setSignature","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"signature","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"fromChainId","type":"uint256"},{"internalType":"address","name":"fromWormhole","type":"address"},{"internalType":"uint256","name":"toChainId","type":"uint256"},{"internalType":"address","name":"toWormhole","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"},{"internalType":"bool","name":"valid","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"values","type":"address[]"}],"name":"unsetSignature","outputs":[],"stateMutability":"nonpayable","type":"function"}]
/* eslint-enable */

export class DatabaseWormholeContract {
  constructor(contractAddress, providerUrl) {
    this.providerUrl = providerUrl;
    this.contractAddress = contractAddress;
    if (this.providerUrl) {
      this._init();
    }
  }
  async updateProviderUrl() {
    if (
      !(this.providerUrl && (await checkHttpServerIsAlive(this.providerUrl)))
    ) {
      this.providerUrl = await getAliveHttpServer(getDBProviderUrlsConfig());
    }
    this._init();
  }
  _init() {
    // only use 'bsc testnet' with chainId 97
    this.web3 = web3Factory('97');
    this.contract = new this.web3.eth.Contract(
      CONTRACT_ABI,
      this.contractAddress
    );
  }
  async signature(accountAddress) {
    if (!this.contract) {
      await this.updateProviderUrl();
    }
    return await this.contract.methods['signature'](accountAddress).call();
  }
}
