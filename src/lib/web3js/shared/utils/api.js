import {
  getRestServerConfig,
  DeriEnv,
} from '../config'

// get REST HTTP Base url
export const getHttpBase = () => {
  return getRestServerConfig(DeriEnv.get());
};

export const fetchJson = async (url) => {
  const resp = await fetch(url);
  return await resp.json();
};

export const fetchRestApi = async (path, opts = { method: 'GET' }) => {
  return await fetchJson(`${getHttpBase()}${path}`, opts);
};

// query api wrapper
export const catchApiError = async (func, args, methodName, defaultValue) => {
  try {
    const res = await func(...args)
    return res
  } catch (err) {
    //console.log(`${methodName}: `, err.toString())
    console.log(`${methodName}: `, err)
  }
  return defaultValue
}

// tx api wrapper
export const catchTxApiError = async (func, args) => {
  let res;
  try {
    const result = await func(...args);
    res = { success: true, transaction: result };
  } catch (err) {
    res = { success: false, error: err.toString() };
  }
  return res;
};

