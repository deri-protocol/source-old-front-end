// == func
const np = () => {}
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

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
    console.log(err);
  }
  return false;
};

export const getAliveHttpServer = async (urls = []) => {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    //console.log(url)
    if (await checkHttpServerIsAlive(url)) {
      return url;
    }
  }
  throw new Error('No alive http server in urls', urls);
};
