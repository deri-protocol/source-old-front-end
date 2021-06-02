/** @module config */

/**
 * Get the contract address list based on the deri environment variable
 * @method
 * @param {string} env='dev' - Deri environment variable: 'prod' or 'dev'
 * @returns {Object[]} response
 * @returns {string} response[].pool - pool address
 * @returns {string} response[].bToken - base token address
 * @returns {string} response[].pToken - position token address
 * @returns {string} response[].lToken - liquidity token address
 * @returns {string} response[].initialBlock - initial block of the pool
 * @returns {string} response[].bTokenSymbol - base token symbol
 * @returns {string} response[].symbol - symbol
 * @returns {string} response[].chainId - Id of the chain
 */
export const getContractAddressConfig = (env = 'dev') => {
  // production environment
  if (env === 'prod') {
    // console.log('!!! production !!!')
    return [
      {
        pool: '0x639a9C2fAe976D089dCcc2ffAE51Ef1dd04B7985',
        bToken: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        pToken: '0x3c11c4990447F0AD575eBd74E8cD17bf61848A15',
        lToken: '0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9',
        dToken: '0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9',
        MiningVault: '0x6C8d3F31b2ad1AE997Afa20EAd88cb67E93C6E17',
        initialBlock: '5288684',
        bTokenSymbol: 'BUSD',
        symbol: 'BTCUSD',
        unit: 'BTC',
        chainId: '56',
        version: 'v1',
      },
      {
        pool: '0x011346B81e5326904B5B76A11dECAf2c67eFFc23',
        bToken: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        pToken: '0xaE6429b4CDDDFefDB6ac702183c836B4e62Da410',
        lToken: '0xd8f78c47b0e0943B3Cb2cE1e1726472C4ddd2F98',
        dToken: '0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9',
        MiningVault: '0x6C8d3F31b2ad1AE997Afa20EAd88cb67E93C6E17',
        initialBlock: '6753399',
        bTokenSymbol: 'BUSD',
        symbol: 'COIN',
        unit: 'COIN',
        chainId: '56',
        version: 'v1',
      },
      {
        pool: '0x919F97417857781f754e00CCCD9100f78B759818',
        bToken: '0xe60eaf5A997DFAe83739e035b005A33AfdCc6df5',
        pToken: '0x29Be63E854727BB3Fef77eB107B8d1c33081f989',
        lToken: '0x610b39F9ba0fF2167AEb646462473c011A431Cd7',
        dToken: '0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9',
        MiningVault: '0x6C8d3F31b2ad1AE997Afa20EAd88cb67E93C6E17',
        initialBlock: '7475766',
        bTokenSymbol: 'DERI',
        symbol: 'iMEME',
        unit: 'iMEME',
        chainId: '56',
        version: 'v1',
      },
      {
        pool: '0x3C2970466635AAeFEd1cfe630D051Fa6D281aEbB',
        bToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        pToken: '0x9c6134F9e759C6812aaC102FC1a9f7cA5615fD33',
        lToken: '0x43CA6D7129d7F490d5B91B4D14D7c877D15A92dA',
        dToken: '0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9',
        MiningVault: '0x7826Ef8Da65494EA21D64D8E6A76AB1BED042FD8',
        initialBlock: '11949433',
        bTokenSymbol: 'USDT',
        symbol: 'BTCUSD',
        unit: 'BTC',
        chainId: '1',
        version: 'v1',
      },
      {
        pool: '0x7137cc9f252dc405dadc35F597dA8B32e8653603',
        bToken: '0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a',
        pToken: '0x15aD9b67cf54037127fD986Ca3bB775f9FC4ad05',
        lToken: '0xeC27d4c53C2E29F1113A9667c0B19442df83c1f1',
        dToken: '0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9',
        MiningVault: '0x7826Ef8Da65494EA21D64D8E6A76AB1BED042FD8',
        initialBlock: '11860070',
        bTokenSymbol: 'BAC',
        symbol: 'BTCUSD',
        unit: 'BTC',
        chainId: '1',
        version: 'v1',
      },
      {
        pool: '0x9b404BAB12CE0D5039e7313d9e24f4b5c8E8E8e3',
        bToken: '0x0298c2b32eaE4da002a15f36fdf7615BEa3DA047',
        pToken: '0x732Ba556B304fd74Cd14b74ab8762A7D9f26d476',
        lToken: '0x90fE976Cbb48E0761A84DDA2974024377994a997',
        dToken: '0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9',
        MiningVault: '0xF0bC8b772f26F8DeB46c1aebbEA7C8d502Abf3b8',
        initialBlock: '2557914',
        bTokenSymbol: 'HUSD',
        symbol: 'BTCUSD',
        unit: 'BTC',
        chainId: '128',
        version: 'v1',
      },
    ];
  }
  // develop environment
  // console.log('-- test ---')
  return [
    {
      pool: '0x372b640A00a0A6B73381e9363A39644a712cCc37',
      bToken: '0x4038191eFb39Fe1d21a48E061F8F14cF4981A0aF',
      pToken: '0xB9113758D771750e9E8ECb359A19689eC89AC1a5',
      lToken: '0xC727a10Be4740441BE74960296097aF39D701980',
      initialBlock: '9378545',
      bTokenSymbol: 'BUSD',
      symbol: 'BTCUSD',
      unit: 'BTC',
      chainId: '97',
      version: 'v1',
    },
  ];
};

/**
 * Get the Slp contract address list based on the deri environment variable
 * @method
 * @param {string} env='dev' - Deri environment variable: 'prod' or 'dev'
 * @returns {Object[]} response
 * @returns {string} response[].pool - pool address
 * @returns {string} response[].bToken - base token address
 * @returns {string} response[].pToken - position token address
 * @returns {string} response[].lToken - liquidity token address
 * @returns {string} response[].initialBlock - initial block of the pool
 * @returns {string} response[].bTokenSymbol - base token symbol
 * @returns {string} response[].symbol - symbol
 * @returns {string} response[].chainId - Id of the chain
 */
export const getSlpContractAddressConfig = (env = 'dev') => {
  if (env === 'prod') {
    return [
      {
        pool: '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd',
        bToken: '0xA3DfbF2933FF3d96177bde4928D0F5840eE55600',
        pToken: '0x0000000000000000000000000000000000000000',
        lToken: '0x0000000000000000000000000000000000000000',
        dToken: '0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9',
        MiningVault: '0x7826Ef8Da65494EA21D64D8E6A76AB1BED042FD8',
        chainId: '1',
        bTokenSymbol: 'DERI-USDT SLP',
        symbol: '--',
      },
    ];
  }
  console.log('getSlpContractAddressConfig(): no config for dev environment');
  return [];
};

/**
 * Get the Clp contract address list based on the deri environment variable
 * @method
 * @param {string} env='dev' - Deri environment variable: 'prod' or 'dev'
 * @returns {Object[]} response
 * @returns {string} response[].pool - pool address
 * @returns {string} response[].bToken - base token address
 * @returns {string} response[].lToken - liquidity token address
 * @returns {string} response[].initialBlock - initial block of the pool
 * @returns {string} response[].bTokenSymbol - base token symbol
 * @returns {string} response[].chainId - Id of the chain
 */
export const getClpContractAddressConfig = (env = 'dev') => {
  if (env === 'prod') {
    return [
      {
        pool: '0x4de2Ac273aD1BBe2F5C41f986d7b3cef8383Df98',
        bToken: '0xDc7188AC11e124B1fA650b73BA88Bf615Ef15256',
        pToken: '0x0000000000000000000000000000000000000000',
        lToken: '0x83b31Abc899863B8Eb06952994580CE86414156E',
        dToken: '0x0000000000000000000000000000000000000000',
        MiningVault: '0x0000000000000000000000000000000000000000',
        initialBlock: '6894880',
        chainId: '56',
        bTokenSymbol: 'CAKE-LP',
        symbol: '--',
      },
    ];
  } else {
    return [
    ];
  }
};
export const getClp2ContractAddressConfig = (env = 'dev') => {
  if (env === 'prod') {
    return [
      {
        pool: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
        bToken: '0xDc7188AC11e124B1fA650b73BA88Bf615Ef15256',
        pToken: '0x0000000000000000000000000000000000000000',
        lToken: '0x0000000000000000000000000000000000000000',
        dToken: '0x0000000000000000000000000000000000000000',
        MiningVault: '0x0000000000000000000000000000000000000000',
        initialBlock: '699498',
        chainId: '56',
        bTokenSymbol: 'CAKE-LP SYRUP',
        symbol: '--',
      }
    ]
  } else {
    return []
  }
}

export const getLpContractAddressConfig = (env = 'dev') => {
  if (env === 'prod') {
    return [
      {
        pool: '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd',
        bToken: '0xA3DfbF2933FF3d96177bde4928D0F5840eE55600',
        pToken: '0x0000000000000000000000000000000000000000',
        lToken: '0x0000000000000000000000000000000000000000',
        dToken: '0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9',
        MiningVault: '0x7826Ef8Da65494EA21D64D8E6A76AB1BED042FD8',
        chainId: '1',
        bTokenSymbol: 'DERI-USDT SLP',
        symbol: '--',
        type: 'slp',
      },
      {
        pool: '0x4de2Ac273aD1BBe2F5C41f986d7b3cef8383Df98',
        bToken: '0xDc7188AC11e124B1fA650b73BA88Bf615Ef15256',
        pToken: '0x0000000000000000000000000000000000000000',
        lToken: '0x83b31Abc899863B8Eb06952994580CE86414156E',
        dToken: '0x0000000000000000000000000000000000000000',
        MiningVault: '0x0000000000000000000000000000000000000000',
        initialBlock: '6894880',
        chainId: '56',
        bTokenSymbol: 'CAKE-LP',
        symbol: '--',
        type: 'clp',
      },
      {
        pool: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
        bToken: '0xDc7188AC11e124B1fA650b73BA88Bf615Ef15256',
        pToken: '0x0000000000000000000000000000000000000000',
        lToken: '0x0000000000000000000000000000000000000000',
        dToken: '0x0000000000000000000000000000000000000000',
        MiningVault: '0x0000000000000000000000000000000000000000',
        initialBlock: '699498',
        chainId: '56',
        bTokenSymbol: 'CAKE-LP SYRUP',
        symbol: '--',
        type: 'clp2',
      },
    ];
  } else {
    return [
    ];
  }
};

export const getMiningVaultRouterContractAddress= (chainId) => {
  const configs = [
      {
        MiningVaultRouter: '0x8d5613451Dc0592388f98d7Ab1ce5A732561936e',
        chainId: '56'
      }
    ]
  const filteredConfig = configs.filter((i) => i.chainId === chainId)
  if (filteredConfig.length > 0) {
    return filteredConfig[0].MiningVaultRouter
  } else {
    throw new Error(`getMiningVaultRouterAddressConfig: no address for chainId ${chainId}`)
  }

}

/**
 * Get the Deri contract address list based on the deri environment variable
 * @method
 * @param {string} env='dev' - Deri environment variable: 'prod' or 'dev'
 * @returns {Object[]} response
 * @returns {string} response[].Deri - deri address
 * @returns {string} response[].Wormhole - wormhole token address
 * @returns {string} response[].bTokenSymbol - base token symbol
 * @returns {string} response[].chainId - Id of the chain
 */
export const getDeriContractAddressConfig = (env = 'dev') => {
  if (env === 'prod') {
    return [
      {
        Deri: '0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9',
        Wormhole: '0x6874640cC849153Cb3402D193C33c416972159Ce',
        bTokenSymbol: 'DERI',
        chainId: '1',
      },
      {
        Deri: '0xe60eaf5A997DFAe83739e035b005A33AfdCc6df5',
        Wormhole: '0x15a5969060228031266c64274a54e02Fbd924AbF',
        bTokenSymbol: 'DERI',
        chainId: '56',
      },
      {
        Deri: '0x2bdA3e331Cf735D9420e41567ab843441980C4B8',
        Wormhole: '0x134A04497e9a0b1F8850fEaf87eD18ec348dDa46',
        bTokenSymbol: 'DERI',
        chainId: '128',
      },
    ];
  }
  return [
    {
      Deri: '0x88Fe79a3b6AC7EeF3d55B2e388fa18400590698B',
      Wormhole: '0xcb28Fa7dFa1844Cdb47aD5f03484f6131293Fd2e',
      bTokenSymbol: 'DERI',
      chainId: '3',
    },
    {
      Deri: '0x8dC0aA48bbc69BaCD2548c6b7adCDeF8DDbA50B2',
      Wormhole: '0x9028e43114Df57C97c15355224E575DF1e244919',
      bTokenSymbol: 'DERI',
      chainId: '97',
    },
    {
      Deri: '0x932458a637F8060AF747167656651b64d4c36620',
      Wormhole: '0x629B0D3D32BE5ee5F7BF3845914d26446c04165d',
      bTokenSymbol: 'DERI',
      chainId: '256',
    },
  ];
};

export const getAnnualBlockNumberConfig = () => ({
  1: '2367422',
  56: '10497304',
  128: '10511369',
  3: '2367422',
  97: '10497304',
  256: '10511369',
});
