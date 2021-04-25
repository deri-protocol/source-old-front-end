export const getRestServerConfig = (env = 'dev') => {
  if (env === 'prod' || env === 'production') {
    // for production
    return 'http://192.168.7.173:8080';
  } else {
    // for test
    return 'http://192.168.7.173:8080';
  }
};
