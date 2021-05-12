/**
 * Get REST server config
 * @param {string} env='dev' - Deri environment variable: 'prod' or 'dev'
 * @returns {string} server url
 */
export const getRestServerConfig = (env = 'dev') => {
  if (env === 'prod' || env === 'production') {
    // for production
    return 'https://api.deri.finance';
  } else {
    // for test
    return 'http://47.52.225.179';
  }
};
