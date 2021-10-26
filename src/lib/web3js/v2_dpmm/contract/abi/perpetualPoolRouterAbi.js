// this file is generated by script, don't modify it !!!
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
                "name": "sourceRouter",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "lastTimestamp",
                "type": "uint256"
            }
        ],
        "name": "executeMigrationWithTimestamp",
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
                "internalType": "uint256",
                "name": "pTokenId",
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
                "internalType": "uint256",
                "name": "pTokenId",
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
        "name": "liquidateWithPrices",
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
