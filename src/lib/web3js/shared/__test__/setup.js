// setup fetch in node env
import fetch from 'node-fetch'
global.fetch = fetch

// timeout for async method testing
export const TIMEOUT = 80000;
export const MIN_NUMBER = 0
export const MID_NUMBER = 0.0001
export const MAX_NUMBER = 1000000000

// shared config
export const CHAIN_ID = '97'
//export const CHAIN_ID = '80001'
export const ACCOUNT_ADDRESS = '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF';
export const ACCOUNT2_ADDRESS = '0x20FdDeAba42043577a9c781501DEF7563dC5816D';
export const BTOKEN_ADDRESS = '0x4038191eFb39Fe1d21a48E061F8F14cF4981A0aF';

// v1 config
export const POOL_V1_ADDRESS = '0x372b640A00a0A6B73381e9363A39644a712cCc37';

// v2 config

export const POOL_V2_ADDRESS =   '0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5';
export const LTOKEN_V2_ADDRESS = '0x904262d92B21e5214278632d01405738d841d82a';
export const PTOKEN_V2_ADDRESS = '0x270128C2d7E8713c8c25F7800738C29214eAFeBA';
export const ROUTER_V2_ADDRESS = '0x07fb21FE50A31dFaf312dFa9f5BA5CF14DC7E1e6';
export const PROTOCOL_FEE_COLLECTOR_V2 = '0x4C059dD7b01AAECDaA3d2cAf4478f17b9c690080';
export const BTCUSD_ORACLE_V2_ADDRESS =
  '0x713a13df8985EF58FB50b21929f2cdBa38A1aFC7';

// v2 lite config
// chain id 97
export const POOL_V2L_ADDRESS =  '0x3422DcB21c32d91aDC8b7E89017e9BFC13ee2d42';
export const LTOKEN_V2L_ADDRESS= '0x5443bB7B9920b41Da027f8Aab41c90702ACD7d8a';
export const PTOKEN_V2L_ADDRESS= '0x1aD33A66Bc950E05E10f56a472D818AFEe72012C';
export const BTOKEN_V2L_ADDRESS= '0x4038191eFb39Fe1d21a48E061F8F14cF4981A0aF';
export const PROTOCOL_FEE_COLLECTOR_V2L = '0x4C059dD7b01AAECDaA3d2cAf4478f17b9c690080';
export const BTCUSD_ORACLE_V2L_ADDRESS =
  '0x78Db6d02EE87260a5D825B31616B5C29f927E430';

// activity
export const BROKER_MANAGER_V2_ADDRESS = '0xe4101EC5F4EF144e97DdE7542A605c8813a975Fc'

// everlasting config
// 56
export const OPTION_POOL_ADDRESS = '0x30D70845f9Dd9C585370994D9cBe25Db72852828'
export const OPTION_BTOKEN_ADDRESS = '0x2ebE70929bC7D930248040f54135dA12f458690C'
export const OPTION_PTOKEN_ADDRESS = '0x9d7718256585Bb7eC471C387Ce8516C2ED72742a'
export const OPTION_LTOKEN_ADDRESS = '0x1FeaF66A52c5d471F0CC9997B8906Ea04703ef7a'

// 80001
// export const OPTION_POOL_ADDRESS = '0x6A29172e302cCB50d65d58Ad912A0925b888e96f'
// export const OPTION_BTOKEN_ADDRESS = '0xa544e477866a29685E4155E27f9bD886C63880a0'
// export const OPTION_PTOKEN_ADDRESS = '0xe6068048626B03590de7B1FF8d38b35B9C2c9F48'
// export const OPTION_LTOKEN_ADDRESS = '0x1AfA31fAe49fe8973FA3E4a2105A7c483f8E60F3'
