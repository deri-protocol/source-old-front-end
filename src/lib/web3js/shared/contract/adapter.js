// this file is generated by script, don't modify it !!!
import { processMethod } from "../../shared/utils/derijsnext.js";
import { bg } from "../../shared/utils/index.js";
import { MAX_UINT256} from '../config'
import { PancakePair } from "./gen/PancakePair.js";

const isUnlocked = (klass) => {
  klass.prototype["isUnlocked"] = async function (accountAddress, poolAddress) {
    const allowance = await this.allowance(accountAddress, poolAddress)
    //console.log(accountAddress, poolAddress)
    const res = bg(allowance).gt(0)
    return res
  };
  return klass
};

const unlock = (klass) => {
  klass.prototype['unlock'] = async function (accountAddress, poolAddress) {
    return await this._transact(
      'approve',
      [poolAddress, MAX_UINT256],
      accountAddress
    );
  };
  return klass;
};

const getPrice = (klass) => {
  klass.prototype['getPrice'] = async function () {
    if (this.contractAddress === '0xE1cC9FCF36f60479F21ACcB3E23Cb2B608679f4d') {
      return '1';
    }
    const [
      isQuoteToken0,
      qDecimals,
      bDecimals,
      pair,
      priceCumulativeLast1,
      priceCumulativeLast2,
      timestampLast1,
      timestampLast2,
    ] = await Promise.all([
      this.isQuoteToken0(),
      this.qDecimals(),
      this.bDecimals(),
      this.pair(),
      this.priceCumulativeLast1(),
      this.priceCumulativeLast2(),
      this.timestampLast1(),
      this.timestampLast2(),
    ]);

    const pancakePair = new PancakePair(this.chainId, pair);
    let reserveQ, reserveB, timestamp;
    if (isQuoteToken0) {
      const res = await pancakePair.getReserves();
      reserveQ = res._reserve0;
      reserveB = res._reserve1;
      timestamp = res._blockTimestampLast;
    } else {
      const res = await pancakePair.getReserves();
      reserveB = res._reserve0;
      reserveQ = res._reserve1;
      timestamp = res._blockTimestampLast;
    }
    const [price0CumulativeLast, price1CumulativeLast] = await Promise.all([
      pancakePair.price0CumulativeLast(),
      pancakePair.price1CumulativeLast(),
    ]);
    let tmpPairState = {};

    if (timestamp !== timestampLast2) {
      tmpPairState.priceCumulativeLast1 = priceCumulativeLast2;
      tmpPairState.timestampLast1 = timestampLast2;
      tmpPairState.priceCumulativeLast2 = isQuoteToken0
        ? price0CumulativeLast
        : price1CumulativeLast;
      tmpPairState.timestampLast2 = timestamp;
    } else {
      tmpPairState = {
        priceCumulativeLast1,
        priceCumulativeLast2,
        timestampLast1,
        timestampLast2,
      };
    }

    let price;
    const diff = bg(qDecimals).minus(bDecimals);
    if (tmpPairState.timestampLast1 !== '0') {
      //console.log('not equal')
      price = bg(tmpPairState.priceCumulativeLast2)
        .minus(tmpPairState.priceCumulativeLast1)
        .div(bg(tmpPairState.timestampLast2).minus(tmpPairState.timestampLast1))
        .times(bg(10).pow(diff))
        .div(bg(2).pow(112));
    } else {
      //console.log('equal')
      price = bg(reserveB).times(bg(10).pow(diff)).div(reserveQ).toString();
    }
    return price;
  };
  return klass
}

export const ERC20Adapter = (klass) => {
    klass = processMethod(klass, 'totalSupply');
    //klass = processMethod(klass, 'balanceOf'); // use ERC20.decimals

    klass = isUnlocked(klass);
    klass = unlock(klass);
    return klass
}

export const chainlinkOracleAdapter= (klass) => {
    klass = processMethod(klass, 'getPrice');
    return klass
}

export const offChainOracleAdapter= (klass) => {
    klass = processMethod(klass, 'getPrice');
    return klass
}

export const offChainVolatilityOracleAdapter= (klass) => {
    klass = processMethod(klass, 'getVolatility');
    return klass
}

export const bTokenOracle1Adapter = (klass) => {
  //klass = processMethod(klass, 'getPrice');
  klass = getPrice(klass);
  return klass;
};

// export const bTokenSwapper1Adapter = (klass) => {
//   //klass = processMethod(klass, 'getPrice');
//   return klass;
// };

export const pancakePairAdapter = (klass) => {
  //klass = processMethod(klass, 'getPrice');
  return klass;
};