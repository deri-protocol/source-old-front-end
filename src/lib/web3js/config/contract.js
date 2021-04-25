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
        initialBlock: '5552805',
        bTokenSymbol: 'BUSD',
        symbol: 'BTCUSD',
        chainId: '56',
      },
      {
        pool: '0x011346B81e5326904B5B76A11dECAf2c67eFFc23',
        bToken: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        pToken: '0xaE6429b4CDDDFefDB6ac702183c836B4e62Da410',
        lToken: '0xd8f78c47b0e0943B3Cb2cE1e1726472C4ddd2F98',
        dToken: '0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9',
        MiningVault: '0x6C8d3F31b2ad1AE997Afa20EAd88cb67E93C6E17',
        initialBlock: '6759703',
        bTokenSymbol: 'BUSD',
        symbol: 'COIN',
        chainId: '56',
      },
      {
        pool: '0x3C2970466635AAeFEd1cfe630D051Fa6D281aEbB',
        bToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        pToken: '0x9c6134F9e759C6812aaC102FC1a9f7cA5615fD33',
        lToken: '0x43CA6D7129d7F490d5B91B4D14D7c877D15A92dA',
        dToken: '0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9',
        MiningVault: '0x7826Ef8Da65494EA21D64D8E6A76AB1BED042FD8',
        initialBlock: '11949485',
        bTokenSymbol: 'USDT',
        symbol: 'BTCUSD',
        chainId: '1',
      },
      {
        pool: '0x7137cc9f252dc405dadc35F597dA8B32e8653603',
        bToken: '0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a',
        pToken: '0x15aD9b67cf54037127fD986Ca3bB775f9FC4ad05',
        lToken: '0xeC27d4c53C2E29F1113A9667c0B19442df83c1f1',
        dToken: '0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9',
        MiningVault: '0x7826Ef8Da65494EA21D64D8E6A76AB1BED042FD8',
        initialBlock: '11860122',
        bTokenSymbol: 'BAC',
        symbol: 'BTCUSD',
        chainId: '1',
      },
      {
        pool: '0x9b404BAB12CE0D5039e7313d9e24f4b5c8E8E8e3',
        bToken: '0x0298c2b32eaE4da002a15f36fdf7615BEa3DA047',
        pToken: '0x732Ba556B304fd74Cd14b74ab8762A7D9f26d476',
        lToken: '0x90fE976Cbb48E0761A84DDA2974024377994a997',
        dToken: '0xA487bF43cF3b10dffc97A9A744cbB7036965d3b9',
        MiningVault: '0xF0bC8b772f26F8DeB46c1aebbEA7C8d502Abf3b8',
        initialBlock: '2558057',
        bTokenSymbol: 'HUSD',
        symbol: 'BTCUSD',
        chainId: '128',
      },
    ];
  }
  // develop environment
  // console.log('-- test ---')
  return [
    {
      bToken: '0x8F038C454B6E68B2988706a1a5f78dE2C4634097',
      pToken: '0xad794Adc3Ed6085A79Ba3e2FCD13Df8d33d462Ec',
      lToken: '0x37732230ac101f59490762Ef73Be43B5E5Ec4949',
      pool: '0x67eE8f0CB17e750219Bd58d433D52ab4B3d8A081',
      initialBlock: '9986748',
      bTokenSymbol: 'USDT',
      symbol: 'BTCUSD',
      chainId: '3',
    },
    {
      pool: '0xFFe402106E8F73F0A44C7350C2b734e048f448f2',
      bToken: '0xa0354a4bB59657ad9A2b3eeC4f53f7A6Fb171DD1',
      pToken: '0x5FeF67FD24f37b90E0c96324380F63413dF22f78',
      lToken: '0xCdDbf76F76B9F95135F5D531fefc344258ff322a',
      initialBlock: '7796732',
      bTokenSymbol: 'BUSD',
      symbol: 'BTCUSD',
      chainId: '97',
    },
    {
      pool: '0x02A614844212f71049c469902F7A20F6540a2792',
      bToken: '0xa0354a4bB59657ad9A2b3eeC4f53f7A6Fb171DD1',
      pToken: '0x4396025914025F1C8B74788bF7c64f879064FbA6',
      lToken: '0x2E80928a9eC105FE79cfC4B54c65d185AC3b7E9C',
      initialBlock: '8108595',
      bTokenSymbol: 'BUSD',
      symbol: 'COIN',
      chainId: '97',
    },
    {
      pool: '0xE5a4fCd3CE3a824bF15D5FABd390cF44E83AbE8B',
      bToken: '0x02c9840fD044abFd58E9674ecc232e8b1F323fE8',
      pToken: '0xfa803C4528A1b9f91DFc5f8b4ff940f9FE4F4635',
      lToken: '0xbD57300A178075F774b5F0F9f367B9A2912b7b5e',
      initialBlock: '3663362',
      bTokenSymbol: 'HUSD',
      symbol: 'BTCUSD',
      chainId: '256',
    },
  ];
};

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
        bTokenSymbol: 'DERI-USDT SLP ONSEN',
      },
    ];
  }
  console.log('getSlpContractAddressConfig(): no config for dev environment');
  return [];
};

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
