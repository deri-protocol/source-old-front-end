import { contractFactory } from "../utils";
import { PTokenAirdropNULSAdapter } from "./adapter";
import { PTokenAirdropNULS } from "./gen/PTokenAirdropNULS";

export const PTokenAirdropNULSFactory = contractFactory(
  PTokenAirdropNULSAdapter(PTokenAirdropNULS)
);
