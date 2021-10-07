import { processMethod, processTxMethod } from "../utils"

export const PTokenAirdropNULSAdapter = (klass) => {
  //klass = processMethod(klass, 'totalAirdropCount')

  return klass
}

export const deriStakingAdapter = (klass) => {
    klass = processMethod(klass, 'getAccountBalance', []);
    klass = processMethod(klass, 'getTotalBalance', []);
    klass = processMethod(klass, 'getAccountScore', []);
    klass = processMethod(klass, 'getTotalScore', []);

    klass = processTxMethod(klass, "deposit", ["1"]);
    klass = processTxMethod(klass, "withdraw", ["1"]);
    return klass
}
