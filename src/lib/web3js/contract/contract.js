import Web3 from 'web3';
import { metaMaskWeb3, web3Factory } from '../factory/web3';

const MAX_GAS_AMOUNT = 532731;

export class Contract {
  constructor(chainId, contractAddress, isProvider) {
    this.chainId = chainId;
    this.contractAddress = contractAddress;
    if (isProvider) {
      this.web3 = web3Factory(chainId);
    } else {
      this.web3 = metaMaskWeb3();
    }
  }
  setAccount(accountAddress) {
    this.accountAddress = accountAddress;
    return this;
  }
  setPool(poolAddress) {
    this.poolAddress = poolAddress;
    return this;
  }
  async _call(method, args = []) {
    return await this.contract.methods[method](...args).call();
  }

  async _estimatedGas(method, args = []) {
    !this.accountAddress &&
      console.log('please do setAccount(accountAddress) first');
    let gas = 0;
    for (let i = 0; i < 20; i++) {
      try {
        gas = await this.contract.methods[method](...args).estimateGas({
          from: this.accountAddress,
        });
        gas = parseInt(gas * 1.25);
        break;
      } catch (err) {
        //console.log("err", err);
      }
    }
    if (gas == 0) gas = MAX_GAS_AMOUNT;
    if (gas > MAX_GAS_AMOUNT) gas = MAX_GAS_AMOUNT;
    return gas;
  }

  _getTransactionReceipt(tx) {
    const self = this;
    return function _transactionReceipt(resolve, reject) {
      self.web3.eth.getTransactionReceipt(tx, (error, receipt) => {
        if (error) {
          reject(error);
        } else if (receipt === null) {
          setTimeout(() => _transactionReceipt(resolve, reject), 500);
        } else if (receipt.status === false) {
          receipt.errorMessage = 'Transaction failed';
          reject(receipt);
        } else {
          resolve(receipt);
        }
      });
    };
  }
  async _transact(method, args) {
    !this.accountAddress &&
      console.log('please do setAccount(accountAddress) first');
    //const gas = await this._estimatedGas(method, args);
    const [gas, gasPrice] = await Promise.all([
      this._estimatedGas(method, args),
      this.web3.eth.getGasPrice(),
    ]);
    let txRaw = [
      {
        from: this.accountAddress,
        to: this.contractAddress,
        gas: Web3.utils.numberToHex(gas),
        gasPrice: Web3.utils.numberToHex(gasPrice),
        value: Web3.utils.numberToHex('0'),
        data: this.contract.methods[method](...args).encodeABI(),
      },
    ];
    let tx = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: txRaw,
    });
    return await new Promise(this._getTransactionReceipt(tx));
  }
}
