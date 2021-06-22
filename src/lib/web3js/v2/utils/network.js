import Web3 from 'web3';
// == func
// const np = () => {}
// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchWithTimeout = (url, options = {}) => {
  const { timeout = 1200, ...fetchOptions } = options

  return Promise.race([
    fetch(url, fetchOptions),
    new Promise((resolve) => {
      setTimeout(() => {
        // reject(
        //   new Error(
        //     `Request for ${url} timed out after ${timeout} ms`,
        //   ),
        // )
        resolve({timeout:true})
      }, timeout)
    }),
  ])
}

export const checkHttpServerIsAlive = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return true;
    }
  } catch (err) {
    if (!err.toString().includes('FetchError')) {
      console.log(err);
    }
  }
  return false;
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

export const getAliveHttpServer = async (urls = []) => {
  urls = shuffleArray(urls)
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    //console.log(url)
    if (await checkHttpServerIsAlive(url)) {
      return url;
    }
  }
  throw new Error(`getAliveHttpServer(): No alive http server in ${urls}`);
};

const getBlockNumber = async (url) => {
  let res = { url: url, blockNumber: -1, duration: Number.MAX_SAFE_INTEGER,};
  try {
    const web3 = new Web3(new Web3.providers.HttpProvider(url))
    const startTime = Date.now()
    res.blockNumber = await web3.eth.getBlockNumber()
    res.duration = Date.now() - startTime
  } catch (err) {
    console.log(`getBlockNumber(${url}) error: ${err}`)
  }
  return res
};

export const getLatestRPCServer = async (urls = []) => {
  urls = shuffleArray(urls)
  let promises = []
  for (let i = 0; i < urls.length; i++) {
    promises.push(getBlockNumber(urls[i]));
  }
  let blockNumbers = await Promise.all(promises)
  blockNumbers = blockNumbers.sort((a, b) => a.duration - b.duration)
  //console.log('blockNumbers',  blockNumbers)
  const latestBlockNumber = blockNumbers.reduce((a, b) => b.blockNumber !== -1 ? a > b.blockNumber ? a : b.blockNumber : a, 0)
  const index = blockNumbers.findIndex((b) => b.blockNumber === latestBlockNumber);
  const res = blockNumbers[index].url
  //console.log(res)
  if (res.startsWith('http')) {
    return res
  } else {
    throw new Error(`getLatestRPCServer(): no alive RPC server in ${urls}`)
  }
};