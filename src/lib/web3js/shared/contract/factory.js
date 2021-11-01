// this file is generated by script, don't modify it !!!
import { contractFactory } from '../../shared/utils/derijsnext.js';
import { ERC20Adapter, chainlinkOracleAdapter, offChainOracleAdapter, offChainVolatilityOracleAdapter, bTokenSwapper1Adapter, pancakePairAdapter, bTokenOracle1Adapter } from './adapter.js';

import { TERC20 } from './gen/TERC20.js';
import { ERC20 } from './gen/ERC20.js';
import { ChainlinkOracle} from './gen/ChainlinkOracle.js';
import { OffChainOracle} from './gen/OffChainOracle.js';
import { OffChainVolatilityOracle} from './gen/OffChainVolatilityOracle.js';
import { TERC20MintLimit } from './gen/TERC20MintLimit.js';
//import { BTokenSwapper1 } from './gen/BTokenSwapper1.js';
import { PancakePair } from './gen/PancakePair.js';
import { BTokenOracle1 } from './gen/BTokenOracle1.js';

// ERC20
export const ERC20Factory = contractFactory(ERC20Adapter(ERC20));
export const TERC20Factory = contractFactory(ERC20Adapter(TERC20)); // for test only
export const TERC20MintLimitFactory = contractFactory(ERC20Adapter(TERC20MintLimit)); // for test only


// oracle
export const symbolOracleChainlinkFactory = contractFactory(chainlinkOracleAdapter(ChainlinkOracle));
export const offChainOracleFactory = contractFactory(offChainOracleAdapter(OffChainOracle));
export const volatilityOracleOffChainFactory = contractFactory(offChainVolatilityOracleAdapter(OffChainVolatilityOracle));

// swapper
export const bTokenOracle1Factory = contractFactory(bTokenOracle1Adapter(BTokenOracle1))
//export const bTokenSwapper1Factory = contractFactory(bTokenSwapper1Adapter(BTokenSwapper1))
export const pancakePairFactory = contractFactory(pancakePairAdapter(PancakePair))

