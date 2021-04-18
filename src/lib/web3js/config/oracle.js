export const getOracleUrl = (env = "dev") => {
  if (env === "prod" || env === "production") {
    // for production
    return "https://oracle.deri.finance/price";
  } else {
    // for test
    return "https://oracle2.deri.finance/price"
    //return "http://192.168.7.192/price";
  }
};
