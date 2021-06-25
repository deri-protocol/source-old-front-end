import { ContractBase } from "./contract_base";
import { brokerManagerAbi } from './abis';

export class BrokerManager extends ContractBase {
  constructor(chainId, address, useInfura) {
    super(chainId, address, brokerManagerAbi, useInfura)
  }
  // query
  async getBroker(accountAddress) {
    return await this._call('getBroker', [accountAddress])
  }

  // transaction
  async setBroker(accountAddress, brokerAddress) {
    return await this._transact(
      'setBroker',
      [brokerAddress],
      accountAddress
    );
  }
}