import { getDBProviderUrlsConfig } from '../config/database';
import { web3Factory } from '../factory/web3';
import { getAliveHttpServer, checkHttpServerIsAlive } from '../utils';

/* eslint-disable */
const DB_CONTRACT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"newController","type":"address"}],"name":"addController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"controllers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"data","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"oldController","type":"address"}],"name":"delController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"keys","type":"string[]"}],"name":"getValues","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"string","name":"key","type":"string"},{"internalType":"bytes32","name":"value","type":"bytes32"}],"internalType":"structDatabase.Params1[]","name":"pairs","type":"tuple[]"}],"name":"setValues","outputs":[],"stateMutability":"nonpayable","type":"function"}]
/* eslint-enable */

export class DatabaseContract {
  constructor(contractAddress, providerUrl) {
    this.providerUrl = providerUrl;
    this.contractAddress = contractAddress;
    if (this.providerUrl) {
      this._init();
    }
  }
  _init() {
    // only use 'bsc testnet' with chainId 97
    this.web3 = web3Factory('97');
    this.contract = new this.web3.eth.Contract(
      DB_CONTRACT_ABI,
      this.contractAddress
    );
  }

  async updateProviderUrl() {
    if (
      !(this.providerUrl && (await checkHttpServerIsAlive(this.providerUrl)))
    ) {
      this.providerUrl = await getAliveHttpServer(getDBProviderUrlsConfig());
    }
    this._init();
  }

  async getValues(keyArray) {
    if (!this.contract) {
      await this.updateProviderUrl();
    }
    return await this.contract.methods.getValues(keyArray).call();
  }
}
