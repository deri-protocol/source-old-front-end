// add a new chain: validateChainId, getChainProviderUrls, getNetworkName, getAnnualBlockNumberConfig
export const getChainProviderUrls = (chainId) => {
  const chainProviderUrls = [
    {
      provider_urls: [
        'https://mainnet.infura.io/v3/d0e6582644a845ee8d7c3c18683fec06',
      ],
      chainId: '1',
    },
    {
      provider_urls: [
        'https://bsc-dataseed.binance.org',
        'https://bsc-dataseed1.defibit.io/',
        'https://bsc-dataseed1.ninicoin.io/',
      ],
      chainId: '56',
    },
    {
      provider_urls: ['https://http-mainnet.hecochain.com'],
      chainId: '128',
    },
    {
      provider_urls: [
        'https://rpc-mainnet.matic.network',
        'https://rpc-mainnet.maticvigil.com',
        'https://rpc-mainnet.matic.quiknode.pro',
        'https://matic-mainnet.chainstacklabs.com',
        'https://matic-mainnet-full-rpc.bwarelabs.com',
        'https://matic-mainnet-archive-rpc.bwarelabs.com',
      ],
      chainId: '137',
    },
    {
      provider_urls: [
        'https://ropsten.infura.io/v3/ec73e2f0c79a42c0997ee535364de584',
      ],
      chainId: '3',
    },
    {
      provider_urls: [
        'https://kovan.infura.io/v3/ec73e2f0c79a42c0997ee535364de584',
      ],
      chainId: '42',
    },
    {
      provider_urls: [
        'https://data-seed-prebsc-2-s1.binance.org:8545/',
        'https://data-seed-prebsc-1-s2.binance.org:8545/',
        'https://data-seed-prebsc-2-s2.binance.org:8545/',
        'https://data-seed-prebsc-1-s3.binance.org:8545/',
        'https://data-seed-prebsc-1-s1.binance.org:8545/',
        'https://data-seed-prebsc-2-s3.binance.org:8545/',
      ],
      chainId: '97',
    },
    {
      provider_urls: ['https://http-testnet.hecochain.com'],
      chainId: '256',
    },
    {
      provider_urls: [
        'https://rpc-mumbai.matic.today',
        'https://rpc-mumbai.maticvigil.com',
        'https://matic-mumbai.chainstacklabs.com',
        'https://matic-testnet-archive-rpc.bwarelabs.com',
      ],
      chainId: '80001',
    },
  ];

  const res = chainProviderUrls.filter((i) => i.chainId  === chainId)
  //console.log('res',res)
  if (res.length > 0) {
    return res[0].provider_urls
  } else {
    throw new Error(`getChainProviderUrls: no urls for chainId ${chainId}`)
  }
}

export const getAnnualBlockNumberConfig = () => {
  return {
    1: '2367422',
    56: '10497304',
    128: '10511369',
    3: '2367422',
    97: '10497304',
    256: '10511369',
    137: '15063056',
    80001: '15063056',
  };
};

export const MAX_UINT256 =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
export const MAX_INT256 =
  '0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

