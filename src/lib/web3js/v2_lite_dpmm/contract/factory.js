// this file is generated by script, don't modify it !!!
import { contractFactory } from '../../shared/utils/index.js';
import {
  perpetualPoolLiteAdapter,
  lTokenLiteAdapter,
  pTokenLiteAdapter,
} from "./adapter.js";

import { PerpetualPoolLite } from './gen/PerpetualPoolLite.js';
import { LTokenLite } from './gen/LTokenLite.js';
import { PTokenLite } from './gen/PTokenLite.js';


export const perpetualPoolLiteDpmmFactory = contractFactory(
  perpetualPoolLiteAdapter(PerpetualPoolLite)
);
export const lTokenLiteFactory = contractFactory(lTokenLiteAdapter(LTokenLite));
export const pTokenLiteFactory = contractFactory(pTokenLiteAdapter(PTokenLite));