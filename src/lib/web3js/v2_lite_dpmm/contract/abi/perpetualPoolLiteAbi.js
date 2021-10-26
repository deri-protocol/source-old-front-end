// this file is generated by script, don't modify it !!!
export const perpetualPoolLiteAbi = [
    {
        "inputs": [
            {
                "internalType": "uint256[7]",
                "name": "parameters",
                "type": "uint256[7]"
            },
            {
                "internalType": "address[5]",
                "name": "addresses",
                "type": "address[5]"
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
                "name": "account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "lShares",
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
                "name": "account",
                "type": "address"
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
                "indexed": false,
                "internalType": "address",
                "name": "oldController",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "newController",
                "type": "address"
            }
        ],
        "name": "ChangeController",
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
        "name": "ExecuteMigration",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
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
                "name": "account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "lShares",
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
                "name": "account",
                "type": "address"
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
                "name": "account",
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
                "name": "tradersNetVolume",
                "type": "int256"
            },
            {
                "indexed": false,
                "internalType": "int256",
                "name": "indexPrice",
                "type": "int256"
            }
        ],
        "name": "Trade",
        "type": "event"
    },
    {
        "inputs": [
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
                "internalType": "struct IPerpetualPoolLite.SignedPrice[]",
                "name": "prices",
                "type": "tuple[]"
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
                "name": "symbolId",
                "type": "uint256"
            },
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
                "name": "alpha",
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
        "name": "collectProtocolFee",
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
                "name": "source",
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
                "name": "source",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "lastBlockNumber",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "lastBlockTimestamp",
                "type": "uint256"
            }
        ],
        "name": "executeMigrationSwitchToTimestamp",
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
                "name": "bTokenAddress",
                "type": "address"
            },
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
        "inputs": [],
        "name": "getFundingPeriod",
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
        "inputs": [],
        "name": "getParameters",
        "outputs": [
            {
                "internalType": "int256",
                "name": "poolMarginRatio",
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
                "internalType": "int256",
                "name": "liquidity",
                "type": "int256"
            },
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
                        "internalType": "uint256",
                        "name": "symbolId",
                        "type": "uint256"
                    },
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
                "internalType": "struct IPerpetualPoolLite.SymbolInfo",
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
                "name": "account",
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
                "internalType": "struct IPerpetualPoolLite.SignedPrice[]",
                "name": "prices",
                "type": "tuple[]"
            }
        ],
        "name": "liquidate",
        "outputs": [],
        "stateMutability": "nonpayable",
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
                "name": "lShares",
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
                "internalType": "struct IPerpetualPoolLite.SignedPrice[]",
                "name": "prices",
                "type": "tuple[]"
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
                "internalType": "struct IPerpetualPoolLite.SignedPrice[]",
                "name": "prices",
                "type": "tuple[]"
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
                "name": "symbolId",
                "type": "uint256"
            }
        ],
        "name": "removeSymbol",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "period",
                "type": "uint256"
            }
        ],
        "name": "setFundingPeriod",
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
                "internalType": "uint256",
                "name": "symbolId",
                "type": "uint256"
            }
        ],
        "name": "toggleCloseOnly",
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
                "internalType": "struct IPerpetualPoolLite.SignedPrice[]",
                "name": "prices",
                "type": "tuple[]"
            }
        ],
        "name": "trade",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
