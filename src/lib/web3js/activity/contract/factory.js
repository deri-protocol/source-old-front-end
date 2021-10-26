import { contractFactory } from "../utils";
import { PTokenAirdropNULSAdapter, deriVoteAdapter } from "./adapter";

import { PTokenAirdropNULS } from "./gen/PTokenAirdropNULS";
import { DeriVote } from "./gen/DeriVote.js";

// pToken airdrop
export const PTokenAirdropNULSFactory = contractFactory(
  PTokenAirdropNULSAdapter(PTokenAirdropNULS)
);

// deri vote
export const deriVoteFactory = contractFactory(deriVoteAdapter(DeriVote));