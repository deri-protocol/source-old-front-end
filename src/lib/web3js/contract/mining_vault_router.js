import Web3 from 'web3';
import { Contract } from './contract';

/* eslint-disable */
const CONTRACT_ABI=[{"inputs":[{"internalType":"address","name":"token_","type":"address"},{"internalType":"address","name":"miningVault_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"deadline","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"nonce","type":"uint256"}],"name":"Claim","type":"event"},{"inputs":[],"name":"CLAIM_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"chainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint8","name":"v1","type":"uint8"},{"internalType":"bytes32","name":"r1","type":"bytes32"},{"internalType":"bytes32","name":"s1","type":"bytes32"},{"internalType":"uint8","name":"v2","type":"uint8"},{"internalType":"bytes32","name":"r2","type":"bytes32"},{"internalType":"bytes32","name":"s2","type":"bytes32"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimNewController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"controller","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"miningVault","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newController","type":"address"}],"name":"setNewController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"usedHash","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]
/* eslint-enable */

export class MiningVaultRouter extends Contract {
  constructor(chainId, contractAddress, isProvider) {
    super(chainId, contractAddress, isProvider);
    this.contract = new this.web3.eth.Contract(
      CONTRACT_ABI,
      this.contractAddress
    );
  }
  async mint(accountAddress, ...args) {
    //console.log(accountAddress, args)
    const gas = await this._estimatedGas(
      'claim',
      [accountAddress, ...args],
      accountAddress
    );
    //console.log(gas);
    let txRaw = [
      {
        from: accountAddress,
        to: this.contractAddress,
        gas: Web3.utils.numberToHex(gas),
        value: Web3.utils.numberToHex('0'),
        data: this.contract.methods['claim'](
          accountAddress,
          ...args
        ).encodeABI(),
      },
    ];
    //console.log('txRaw', txRaw)
    let tx = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: txRaw,
    });
    return await new Promise(this._getTransactionReceipt(tx));
  }
}
