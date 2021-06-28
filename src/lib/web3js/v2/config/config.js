import { DeriEnv } from '../../config';
import jsonConfig from '../resouces/config.json';
import { validateObjectKeyExist, validateIsArray } from '../utils';

const validateConfig = (config) => {
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

const processConfig = (config) => {
  // process config
  config['bTokenCount'] = config['bTokens'].length;
  config['symbolCount'] = config['symbols'].length;
};

const getJsonConfig = () => {
  const env = DeriEnv.get();
  const configs = typeof jsonConfig === 'object' ? jsonConfig : JSON.parse(jsonConfig);
  if (['prod', 'dev'].includes(env)) {
    //console.log(env)
    if (configs[env]) {
      //console.log(configs[env])
      // pools
      const pools = configs[env].pools;
      if (pools && Array.isArray(pools)) {
        for (let i = 0; i < pools.length; i++) {
          validateConfig(pools[i]);
          processConfig(pools[i]);
        }
      }
      //console.log(configs[env])
      validateObjectKeyExist(['oracle'], configs[env], 'oracle')
      validateObjectKeyExist(['brokerManager'], configs[env], 'brokerManager')
      return configs[env];
    }
  }
  throw new Error(
    `getJsonConfig(): invalid config of env '${env}'`,
    configs[env]
  );
};

export const getConfig = () => {
  return getJsonConfig();
};
