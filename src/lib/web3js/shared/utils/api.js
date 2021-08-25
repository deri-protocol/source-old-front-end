export const catchApiError = async (func, args, methodName, defaultValue) => {
  try {
    const res = await func(...args)
    return res
  } catch (err) {
    console.log(`${methodName}: `, err)
    //console.log(`${methodName}: ${err}`)
  }
  return defaultValue
}

export const catchTxApiError = async (func, args) => {
  let res;
  try {
    const result = await func(...args);
    res = { success: true, transaction: result };
  } catch (err) {
    res = { success: false, error: err };
  }
  return res;
};
