import { deriToNatural, bg } from '../utils';
import { Contract } from './contract';

/* eslint-disable */
const CONTRACT_ABI=[{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"int256","name":"volume","type":"int256"},{"indexed":false,"internalType":"int256","name":"cost","type":"int256"},{"indexed":false,"internalType":"int256","name":"lastCumuFundingRate","type":"int256"},{"indexed":false,"internalType":"uint256","name":"margin","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"lastUpdateTimestamp","type":"uint256"}],"name":"Update","type":"event"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"exists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"exists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"getPosition","outputs":[{"internalType":"int256","name":"volume","type":"int256"},{"internalType":"int256","name":"cost","type":"int256"},{"internalType":"int256","name":"lastCumuFundingRate","type":"int256"},{"internalType":"uint256","name":"margin","type":"uint256"},{"internalType":"uint256","name":"lastUpdateTimestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getPosition","outputs":[{"internalType":"int256","name":"volume","type":"int256"},{"internalType":"int256","name":"cost","type":"int256"},{"internalType":"int256","name":"lastCumuFundingRate","type":"int256"},{"internalType":"uint256","name":"margin","type":"uint256"},{"internalType":"uint256","name":"lastUpdateTimestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"margin","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pool","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newPool","type":"address"}],"name":"setPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"int256","name":"volume","type":"int256"},{"internalType":"int256","name":"cost","type":"int256"},{"internalType":"int256","name":"lastCumuFundingRate","type":"int256"},{"internalType":"uint256","name":"margin","type":"uint256"},{"internalType":"uint256","name":"lastUpdateTimestamp","type":"uint256"}],"name":"update","outputs":[],"stateMutability":"nonpayable","type":"function"}]
/* eslint-enable */

export class PTokenContract extends Contract {
  constructor(chainId, contractAddress, poolAddress, isProvider) {
    super(chainId, contractAddress, isProvider);
    this.poolAddress = poolAddress;
    this.contract = new this.web3.eth.Contract(
      CONTRACT_ABI,
      this.contractAddress
    );
  }

  async getPositionInfo(accountAddress) {
    let result = {};
    try {
      const res = await this._call('getPosition(address)', [accountAddress]);
      //console.log("getPositionInfo() raw:", res)
      result = {
        volume: deriToNatural(res[0]),
        cost: deriToNatural(res[1]),
        lastCumuFundingRate: deriToNatural(res[2]),
        margin: deriToNatural(res[3]),
        lastUpdateTimestamp: bg(res[4]),
      };
    } catch (err) {
      result = {
        volume: bg(0),
        cost: bg(0),
        lastCumuFundingRate: bg(0),
        margin: bg(0),
        lastUpdateTimestamp: bg(0),
      };
      //console.log(`getPositionInfo: ${err}`);
    }
    return result;
  }

  async exists(accountAddress) {
    return await this._call('exists', [accountAddress]);
  }
}
