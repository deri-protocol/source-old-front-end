export const ChainProviderUrls = [
  {
    provider_urls: [
      'https://mainnet.infura.io/v3/ec73e2f0c79a42c0997ee535364de584',
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
      'https://data-seed-prebsc-2-s3.binance.org:8545/',
      'https://data-seed-prebsc-1-s1.binance.org:8545/',
      'https://data-seed-prebsc-2-s1.binance.org:8545/',
      'https://data-seed-prebsc-1-s2.binance.org:8545/',
      'https://data-seed-prebsc-2-s2.binance.org:8545/',
      'https://data-seed-prebsc-1-s3.binance.org:8545/',
    ],
    chainId: '97',
  },
  {
    provider_urls: ['https://http-testnet.hecochain.com'],
    chainId: '256',
  },
];

export const getChainProviderUrlsConfig = (chainId) => {
  const chainProviderUrls = [
    {
      provider_urls: [
        'https://mainnet.infura.io/v3/ec73e2f0c79a42c0997ee535364de584',
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
        'https://data-seed-prebsc-1-s1.binance.org:8545/',
        'https://data-seed-prebsc-1-s2.binance.org:8545/',
        'https://data-seed-prebsc-1-s3.binance.org:8545/',
        'https://data-seed-prebsc-2-s1.binance.org:8545/',
        'https://data-seed-prebsc-2-s2.binance.org:8545/',
        'https://data-seed-prebsc-2-s3.binance.org:8545/',
      ],
      chainId: '97',
    },
    {
      provider_urls: ['https://http-testnet.hecochain.com'],
      chainId: '256',
    },
  ];
  
  const res = chainProviderUrls.filter((i) => i.chainId  === chainId)
  //console.log('res',res)
  if (res.length > 0) {
    return res[0].provider_urls
  } else {
    throw new Error(`getChainProviderUrlsConfig: no urls for chainId ${chainId}`)
  }
}
