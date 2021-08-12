import { DeriEnv } from './env';
import jsonConfig from '../resources/config.json';
import { validateObjectKeyExist, validateIsArray } from '../utils';
import { isUsedRestOracle, mapToBToken, mapToSymbol } from './oracle';

const validateConfigV2 = (config) => {
  validateObjectKeyExist(
    [
      'pool',
      'pToken',
      'lToken',
      'router',
      'initialBlock',
      'bTokens',
      'symbols',
      'chainId',
      'symbolCount',
      'bTokenCount',
    ],
    config,
    ''
  );
  validateIsArray(config['bTokens'], 'bTokens');
  config['bTokens'].forEach((prop) => {
    validateObjectKeyExist(
      ['bTokenId', 'bTokenSymbol', 'bToken'],
      prop,
      'bToken'
    );
  });
  validateIsArray(config['symbols'], 'symbols');
  config['symbols'].forEach((prop) => {
    validateObjectKeyExist(['symbolId', 'symbol'], prop, 'symbol');
  });
};

const processConfigV2 = (config) => {
  // process config
  config['bTokenCount'] = config['bTokens'].length;
  config['symbolCount'] = config['symbols'].length;
  config['bTokens'].forEach((b) => b['bTokenSymbol'] = mapToBToken(b['bTokenSymbol']))
  config['symbols'].forEach((s) => s['symbol'] = mapToSymbol(s['symbol']))
};

const validateConfigV2Lite = (config) => {
  validateObjectKeyExist(
    [
      'pool',
      'pToken',
      'lToken',
      'initialBlock',
      'bToken',
      'bTokenSymbol',
      'symbols',
      'chainId',
      'offchainSymbolIds',
      'offchainSymbols',
      'symbolCount',
    ],
    config,
    ''
  );
  validateIsArray(config['symbols'], 'symbols');
  config['symbols'].forEach((prop) => {
    validateObjectKeyExist(['symbolId', 'symbol'], prop, 'symbol');
  });
  validateIsArray(config['offchainSymbolIds'], 'offchainSymbolIds');
  validateIsArray(config['offchainSymbols'], 'offchainSymbols');
};

const processConfigV2Lite = (config) => {
  // process config
  if (!config['symbolCount']) {
    config['symbolCount'] = config['symbols'].length;
  }
  if (!config['offchainSymbolIds'] && !config['offchainSymbols']) {
    config['offchainSymbolIds'] = config['symbols'].filter((s)=> isUsedRestOracle(s.symbol)).map((s) => s.symbolId)
    config['offchainSymbols'] = config['symbols'].filter((s)=> isUsedRestOracle(s.symbol)).map((s) => s.symbol)
    config['symbols'].forEach((s) => s['symbol'] = mapToSymbol(s['symbol']))
  }
};

const validateConfigOption = (config) => {
  validateObjectKeyExist(
    [
      'pool',
      'pToken',
      'lToken',
      'initialBlock',
      'bToken',
      'bTokenSymbol',
      'symbols',
      'chainId',
      // 'offchainSymbolIds',
      // 'offchainSymbols',
      'symbolCount',
      'volatilitySymbols',
    ],
    config,
    ''
  );
  validateIsArray(config['symbols'], 'symbols');
  config['symbols'].forEach((prop) => {
    validateObjectKeyExist(['symbolId', 'symbol'], prop, 'symbol');
  });
  // validateIsArray(config['offchainSymbolIds'], 'offchainSymbolIds');
  // validateIsArray(config['offchainSymbols'], 'offchainSymbols');
  validateIsArray(config['volatilitySymbols'], 'volatilitySymbols');
};

const processConfigOption = (config) => {
  // process config
  config['symbolCount'] = config['symbols'].length;
  if (!config['volatilitySymbols']) {
    // config['offchainSymbolIds'] = config['symbols'].filter((s)=> isUsedRestOracle(s.symbol)).map((s) => s.symbolId)
    // config['offchainSymbols'] = config['symbols'].filter((s)=> isUsedRestOracle(s.symbol)).map((s) => s.symbol)
    config['volatilitySymbols'] = 
    config['symbols'].forEach((s) => s['symbol'] = mapToSymbol(s['symbol']))
  }
};
const getJsonConfig = (version, env) => {
  env =  env || DeriEnv.get();
  // for browser and nodejs
  let configs = typeof jsonConfig === 'object' ? jsonConfig : JSON.parse(jsonConfig);
  if (configs[version] && ['v2', 'v2_lite', 'option'].includes(version)) {
    configs = configs[version]
  }
  if (['prod', 'dev'].includes(env)){
    //console.log(env)
    if (configs && configs[env]) {
      //console.log(configs[env])
      const pools = configs[env].pools;
      if (pools && Array.isArray(pools)) {
        if (version === 'v2') {
          for (let i = 0; i < pools.length; i++) {
            processConfigV2(pools[i]);
            validateConfigV2(pools[i]);
          }
        } else if (version === 'v2_lite') {
          for (let i = 0; i < pools.length; i++) {
            processConfigV2Lite(pools[i]);
            validateConfigV2Lite(pools[i]);
          }
        } else if (version === 'option') {
          for (let i = 0; i < pools.length; i++) {
            processConfigOption(pools[i]);
            validateConfigOption(pools[i]);
          }
        }
      }
      //console.log(configs[env])
      validateObjectKeyExist(['oracle'], configs[env], 'oracle')
      //validateObjectKeyExist(['brokerManager'], configs[env], 'brokerManager')
      return configs[env];
    }
  }
  throw new Error(
    `getJsonConfig(): invalid config of version '${version}' and env '${env}'`
  );
};

export const getConfig = (version='v2', env) => {
  return getJsonConfig(version, env);
};
