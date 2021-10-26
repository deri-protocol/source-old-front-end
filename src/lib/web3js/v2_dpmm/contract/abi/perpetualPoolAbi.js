// this file is generated by script, don't modify it !!!
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
                "name": "lp",
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
                "name": "trader",
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
                "name": "trader",
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
                "name": "lp",
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
                "name": "trader",
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
                "name": "trader",
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
                "internalType": "int256",
                "name": "tradeCost",
                "type": "int256"
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
                "name": "lp",
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
        "name": "addLiquidity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "trader",
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
                        "name": "alpha",
                        "type": "int256"
                    },
                    {
                        "internalType": "int256",
                        "name": "distributedUnrealizedPnl",
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
                    },
                    {
                        "internalType": "int256",
                        "name": "cumulativeFundingRate",
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
                "internalType": "uint256",
                "name": "bTokenId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "targetPool",
                "type": "address"
            }
        ],
        "name": "approveBTokenForTargetPool",
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
                "name": "initialMarginRatio",
                "type": "int256"
            },
            {
                "internalType": "int256",
                "name": "maintenanceMarginRatio",
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
        "name": "getPoolStateValues",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "lastTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "int256",
                "name": "protocolFeeAccrued",
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
                        "name": "alpha",
                        "type": "int256"
                    },
                    {
                        "internalType": "int256",
                        "name": "distributedUnrealizedPnl",
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
                    },
                    {
                        "internalType": "int256",
                        "name": "cumulativeFundingRate",
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
                "name": "trader",
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
                "name": "sourcePool",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
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
        "name": "migrateBToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "lastTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "int256",
                "name": "protocolFeeAccrued",
                "type": "int256"
            }
        ],
        "name": "migratePoolStateValues",
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
                "name": "alpha",
                "type": "int256"
            },
            {
                "internalType": "int256",
                "name": "distributedUnrealizedPnl",
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
            },
            {
                "internalType": "int256",
                "name": "cumulativeFundingRate",
                "type": "int256"
            }
        ],
        "name": "migrateSymbol",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "lp",
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
        "name": "removeLiquidity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "trader",
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
                "internalType": "address",
                "name": "targetPool",
                "type": "address"
            }
        ],
        "name": "setPoolForLTokenAndPToken",
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
                "name": "alpha",
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
                "name": "trader",
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
            }
        ],
        "name": "trade",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

