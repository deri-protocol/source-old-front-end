import { contractFactory } from "../utils";
import { deriStakingAdapter, PTokenAirdropNULSAdapter } from "./adapter";
import { PTokenAirdropNULS } from "./gen/PTokenAirdropNULS";
import { DeriStaking } from './gen/DeriStaking.js';

export const PTokenAirdropNULSFactory = contractFactory(
  PTokenAirdropNULSAdapter(PTokenAirdropNULS)
);

export const deriStakingFactory = contractFactory(deriStakingAdapter(DeriStaking));
