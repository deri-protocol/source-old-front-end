
/* eslint-disable */
export const perpetualPoolAbi = [
    {
      "inputs": [
        {
          "internalType": "uint256[9]",
          "name": "parameters",
          "type": "uint256[9]"
        },
        {
          "internalType": "address[4]",
          "name": "addresses",
          "type": "address[4]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "bAmount",
          "type": "uint256"
        }
      ],
      "name": "AddLiquidity",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "bAmount",
          "type": "uint256"
        }
      ],
      "name": "AddMargin",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "liquidator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "reward",
          "type": "uint256"
        }
      ],
      "name": "Liquidate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "collector",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "ProtocolFeeCollection",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "bAmount",
          "type": "uint256"
        }
      ],
      "name": "RemoveLiquidity",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "bAmount",
          "type": "uint256"
        }
      ],
      "name": "RemoveMargin",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "symbolId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "tradeVolume",
          "type": "int256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "Trade",
      "type": "event"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "bTokenAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "swapperAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "oracleAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "decimals",
              "type": "uint256"
            },
            {
              "internalType": "int256",
              "name": "discount",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "price",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "liquidity",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "pnl",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "cumulativePnl",
              "type": "int256"
            }
          ],
          "internalType": "struct IPerpetualPool.BTokenInfo",
          "name": "info",
          "type": "tuple"
        }
      ],
      "name": "addBToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "blength",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "slength",
          "type": "uint256"
        }
      ],
      "name": "addLiquidity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bAmount",
          "type": "uint256"
        }
      ],
      "name": "addMargin",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "symbol",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "oracleAddress",
              "type": "address"
            },
            {
              "internalType": "int256",
              "name": "multiplier",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "feeRatio",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "fundingRateCoefficient",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "price",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "cumulativeFundingRate",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "tradersNetVolume",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "tradersNetCost",
              "type": "int256"
            }
          ],
          "internalType": "struct IPerpetualPool.SymbolInfo",
          "name": "info",
          "type": "tuple"
        }
      ],
      "name": "addSymbol",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "targetPool",
          "type": "address"
        }
      ],
      "name": "approvePoolMigration",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "collectProtocolFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sourcePool",
          "type": "address"
        }
      ],
      "name": "executePoolMigration",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAddresses",
      "outputs": [
        {
          "internalType": "address",
          "name": "lTokenAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "pTokenAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "routerAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "protocolFeeCollector",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        }
      ],
      "name": "getBToken",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "bTokenAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "swapperAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "oracleAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "decimals",
              "type": "uint256"
            },
            {
              "internalType": "int256",
              "name": "discount",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "price",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "liquidity",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "pnl",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "cumulativePnl",
              "type": "int256"
            }
          ],
          "internalType": "struct IPerpetualPool.BTokenInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        }
      ],
      "name": "getBTokenOracle",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getLengths",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getParameters",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "decimals0",
          "type": "uint256"
        },
        {
          "internalType": "int256",
          "name": "minBToken0Ratio",
          "type": "int256"
        },
        {
          "internalType": "int256",
          "name": "minPoolMarginRatio",
          "type": "int256"
        },
        {
          "internalType": "int256",
          "name": "minInitialMarginRatio",
          "type": "int256"
        },
        {
          "internalType": "int256",
          "name": "minMaintenanceMarginRatio",
          "type": "int256"
        },
        {
          "internalType": "int256",
          "name": "minLiquidationReward",
          "type": "int256"
        },
        {
          "internalType": "int256",
          "name": "maxLiquidationReward",
          "type": "int256"
        },
        {
          "internalType": "int256",
          "name": "liquidationCutRatio",
          "type": "int256"
        },
        {
          "internalType": "int256",
          "name": "protocolFeeCollectRatio",
          "type": "int256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getProtocolFeeAccrued",
      "outputs": [
        {
          "internalType": "int256",
          "name": "",
          "type": "int256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "symbolId",
          "type": "uint256"
        }
      ],
      "name": "getSymbol",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "symbol",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "oracleAddress",
              "type": "address"
            },
            {
              "internalType": "int256",
              "name": "multiplier",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "feeRatio",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "fundingRateCoefficient",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "price",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "cumulativeFundingRate",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "tradersNetVolume",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "tradersNetCost",
              "type": "int256"
            }
          ],
          "internalType": "struct IPerpetualPool.SymbolInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "symbolId",
          "type": "uint256"
        }
      ],
      "name": "getSymbolOracle",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "liquidator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "blength",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "slength",
          "type": "uint256"
        }
      ],
      "name": "liquidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "blength",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "slength",
          "type": "uint256"
        }
      ],
      "name": "removeLiquidity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "blength",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "slength",
          "type": "uint256"
        }
      ],
      "name": "removeMargin",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "swapperAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "discount",
          "type": "uint256"
        }
      ],
      "name": "setBTokenParameters",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "symbolId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "feeRatio",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "fundingRateCoefficient",
          "type": "uint256"
        }
      ],
      "name": "setSymbolParameters",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "symbolId",
          "type": "uint256"
        },
        {
          "internalType": "int256",
          "name": "tradeVolume",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "blength",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "slength",
          "type": "uint256"
        }
      ],
      "name": "trade",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
export const perpetualPoolRouterAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "lTokenAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "pTokenAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "liquidatorQualifierAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "migrationTimestamp",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "source",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "target",
          "type": "address"
        }
      ],
      "name": "ExecuteMigration",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "migrationTimestamp",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "source",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "target",
          "type": "address"
        }
      ],
      "name": "PrepareMigration",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "bTokenAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "swapperAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "discount",
          "type": "uint256"
        }
      ],
      "name": "addBToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bAmount",
          "type": "uint256"
        }
      ],
      "name": "addLiquidity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bAmount",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "symbolId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "v",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "r",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
            }
          ],
          "internalType": "struct IPerpetualPoolRouter.PriceInfo[]",
          "name": "infos",
          "type": "tuple[]"
        }
      ],
      "name": "addLiquidityWithPrices",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bAmount",
          "type": "uint256"
        }
      ],
      "name": "addMargin",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bAmount",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "symbolId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "v",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "r",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
            }
          ],
          "internalType": "struct IPerpetualPoolRouter.PriceInfo[]",
          "name": "infos",
          "type": "tuple[]"
        }
      ],
      "name": "addMarginWithPrices",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "multiplier",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "feeRatio",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "fundingRateCoefficient",
          "type": "uint256"
        }
      ],
      "name": "addSymbol",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "approveMigration",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claimNewController",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "controller",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sourceRouter",
          "type": "address"
        }
      ],
      "name": "executeMigration",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "liquidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "symbolId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "v",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "r",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
            }
          ],
          "internalType": "struct IPerpetualPoolRouter.PriceInfo[]",
          "name": "infos",
          "type": "tuple[]"
        }
      ],
      "name": "liquidateWithPrices",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "liquidatorQualifier",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "migrationDestination",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "migrationTimestamp",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pool",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "target",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "graceDays",
          "type": "uint256"
        }
      ],
      "name": "prepareMigration",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bAmount",
          "type": "uint256"
        }
      ],
      "name": "removeLiquidity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bAmount",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "symbolId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "v",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "r",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
            }
          ],
          "internalType": "struct IPerpetualPoolRouter.PriceInfo[]",
          "name": "infos",
          "type": "tuple[]"
        }
      ],
      "name": "removeLiquidityWithPrices",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bAmount",
          "type": "uint256"
        }
      ],
      "name": "removeMargin",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "bAmount",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "symbolId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "v",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "r",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
            }
          ],
          "internalType": "struct IPerpetualPoolRouter.PriceInfo[]",
          "name": "infos",
          "type": "tuple[]"
        }
      ],
      "name": "removeMarginWithPrices",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "swapperAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "discount",
          "type": "uint256"
        }
      ],
      "name": "setBTokenParameters",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "qualifierAddress",
          "type": "address"
        }
      ],
      "name": "setLiquidatorQualifier",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newController",
          "type": "address"
        }
      ],
      "name": "setNewController",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "poolAddress",
          "type": "address"
        }
      ],
      "name": "setPool",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "symbolId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "oracleAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "feeRatio",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "fundingRateCoefficient",
          "type": "uint256"
        }
      ],
      "name": "setSymbolParameters",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "symbolId",
          "type": "uint256"
        },
        {
          "internalType": "int256",
          "name": "tradeVolume",
          "type": "int256"
        }
      ],
      "name": "trade",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "symbolId",
          "type": "uint256"
        },
        {
          "internalType": "int256",
          "name": "tradeVolume",
          "type": "int256"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "symbolId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "v",
              "type": "uint8"
            },
            {
              "internalType": "bytes32",
              "name": "r",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "s",
              "type": "bytes32"
            }
          ],
          "internalType": "struct IPerpetualPoolRouter.PriceInfo[]",
          "name": "infos",
          "type": "tuple[]"
        }
      ],
      "name": "tradeWithPrices",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
export const bTokenAbi = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name_",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol_",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
export const lTokenAbi = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name_",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol_",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "numBTokens_",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "liquidity",
          "type": "int256"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "pnl",
          "type": "int256"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "lastCumulativePnl",
          "type": "int256"
        }
      ],
      "name": "UpdateAsset",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "exists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        }
      ],
      "name": "getAsset",
      "outputs": [
        {
          "components": [
            {
              "internalType": "int256",
              "name": "liquidity",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "pnl",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "lastCumulativePnl",
              "type": "int256"
            }
          ],
          "internalType": "struct ILToken.Asset",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "getAssets",
      "outputs": [
        {
          "components": [
            {
              "internalType": "int256",
              "name": "liquidity",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "pnl",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "lastCumulativePnl",
              "type": "int256"
            }
          ],
          "internalType": "struct ILToken.Asset[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "numBTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pool",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "num",
          "type": "uint256"
        }
      ],
      "name": "setNumBTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newPool",
          "type": "address"
        }
      ],
      "name": "setPool",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalMinted",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "int256",
              "name": "liquidity",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "pnl",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "lastCumulativePnl",
              "type": "int256"
            }
          ],
          "internalType": "struct ILToken.Asset",
          "name": "asset",
          "type": "tuple"
        }
      ],
      "name": "updateAsset",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
export const pTokenAbi = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name_",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol_",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "numSymbols_",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "numBTokens_",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "amount",
          "type": "int256"
        }
      ],
      "name": "UpdateMargin",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "symbolId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "volume",
          "type": "int256"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "cost",
          "type": "int256"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "lastCumulativeFundingRate",
          "type": "int256"
        }
      ],
      "name": "UpdatePosition",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "exists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        }
      ],
      "name": "getMargin",
      "outputs": [
        {
          "internalType": "int256",
          "name": "",
          "type": "int256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "getMargins",
      "outputs": [
        {
          "internalType": "int256[]",
          "name": "",
          "type": "int256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "symbolId",
          "type": "uint256"
        }
      ],
      "name": "getPosition",
      "outputs": [
        {
          "components": [
            {
              "internalType": "int256",
              "name": "volume",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "cost",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "lastCumulativeFundingRate",
              "type": "int256"
            }
          ],
          "internalType": "struct IPToken.Position",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "getPositions",
      "outputs": [
        {
          "components": [
            {
              "internalType": "int256",
              "name": "volume",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "cost",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "lastCumulativeFundingRate",
              "type": "int256"
            }
          ],
          "internalType": "struct IPToken.Position[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "numBTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "numSymbols",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pool",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "num",
          "type": "uint256"
        }
      ],
      "name": "setNumBTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "num",
          "type": "uint256"
        }
      ],
      "name": "setNumSymbols",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newPool",
          "type": "address"
        }
      ],
      "name": "setPool",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalMinted",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "bTokenId",
          "type": "uint256"
        },
        {
          "internalType": "int256",
          "name": "amount",
          "type": "int256"
        }
      ],
      "name": "updateMargin",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "int256[]",
          "name": "margins",
          "type": "int256[]"
        }
      ],
      "name": "updateMargins",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "symbolId",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "int256",
              "name": "volume",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "cost",
              "type": "int256"
            },
            {
              "internalType": "int256",
              "name": "lastCumulativeFundingRate",
              "type": "int256"
            }
          ],
          "internalType": "struct IPToken.Position",
          "name": "position",
          "type": "tuple"
        }
      ],
      "name": "updatePosition",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
/* eslint-disable */