/**
 * Get REST server config
 * @param {string} env='dev' - Deri environment variable: 'prod' or 'dev'
 * @returns {string} server url
 */
export const getRestServerConfig = (env = 'dev') => {
  if (env === 'prod' || env === 'production') {
    // for production
    // return (process && process.env && process.env.REACT_APP_REST_SERVER_URL) || 'https://api.deri.finance';
    return 'https://alphaapi.deri.finance';
  } else {
    // for test
    return 'https://testnetapi.deri.finance';
    //return 'http://localhost:8082';
  }
};

export const getRedisWorkerQueneConfig = (env = "dev") => {
  if (env === "prod") {
    return ['trade_tx_quene', 'trade_worker_group']
  } else {
    return ['trade_tx_quene_dev', 'trade_worker_group_dev']
  }
};
