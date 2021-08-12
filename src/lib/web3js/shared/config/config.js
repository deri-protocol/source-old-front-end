import { DeriEnv } from './env';
import jsonConfig from '../resources/config.json';
import { validateObjectKeyExist } from '../utils';
import { VERSIONS } from './version';
import { poolProcessor, poolValidator } from './config_processor';

const getJsonConfig = (version, env) => {
  env = env || DeriEnv.get();
  // for browser and nodejs
  let configs =
    typeof jsonConfig === 'object' ? jsonConfig : JSON.parse(jsonConfig);
  if (configs[version] && VERSIONS.includes(version)) {
    configs = configs[version];
    if (['prod', 'dev'].includes(env)) {
      if (configs && configs[env]) {
        return configs[env];
      }
    }
  } else {
    throw new Error(
      `getJsonConfig(): invalid config of version '${version}' and env '${env}'`
    );
  }
};

export const getConfig = (version='v2', env='dev') => {
  const config = getJsonConfig(version, env);

  //console.log(configs[env])
  const pools = config.pools;
  if (pools && Array.isArray(pools)) {
    for (let i = 0; i < pools.length; i++) {
      poolProcessor[version](pools[i])
      poolValidator[version](pools[i])
    }
  }
  validateObjectKeyExist(['oracle'], config, 'oracle');
  //validateObjectKeyExist(['brokerManager'], configs[env], 'brokerManager')
  return config;
};
