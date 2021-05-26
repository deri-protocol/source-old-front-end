import { metaMaskWeb3, web3Factory } from '../factory';
import { numberToHex } from '../utils';

const MAX_GAS_AMOUNT = 532731;

export class ContractBase {
  constructor(chainId, contractAddress, useInfura) {
    this.chainId = chainId;
    this.contractAddress = contractAddress;
    this.useInfura = useInfura
  }

  async _init() {
    if (this.useInfura) {
      this.web3 = await web3Factory.getOrSet(this.chainId);
    } else {
      this.web3 = metaMaskWeb3();
    }
  }

  async _call(method, args = []) {
    let res
    let retry = 2
    while (retry > 0) {
      try {
        await this._init()
        res = await this.contract.methods[method](...args).call();
        break
      } catch(err) {
        retry -= 1
        this.web3 = null
        console.log(err)
      }
    }
    if (retry === 0 && !res) {
      console.log(`method call '${method} ${args}' failed with max retry 3.`)
    }
    return res
  }

  async _estimatedGas(method, args = [], accountAddress) {
    await this._init()
    let gas = 0;
    for (let i = 0; i < 20; i++) {
      try {
        gas = await this.contract.methods[method](...args).estimateGas({
          from: accountAddress,
        });
        gas = parseInt(gas * 1.25);
        break;
      } catch (err) {
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
  async _transact(method, args, accountAddress) {
    await this._init()
    //const gas = await this._estimatedGas(method, args, accountAddress)
    console.log('account', accountAddress)
    let txRaw = [
      {
        from: accountAddress,
        to: this.contractAddress,
        // gas: numberToHex(gas),
        value: numberToHex('0'),
        data: this.contract.methods[method](...args).encodeABI(),
      },
    ];
    let tx = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: txRaw,
    });
    return await new Promise(this._getTransactionReceipt(tx));
    //return await this.contract.methods[method](...args).send({from: accountAddress})
  }

}
