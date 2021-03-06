// this file is generated by script, don't modify it !!!
export const offChainVolatilityOracleFactoryAbi = [
    {
        "inputs": [],
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
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "signer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "delayAllowance",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "oracle",
                "type": "address"
            }
        ],
        "name": "CreateOracle",
        "type": "event"
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
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "signer",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "delayAllowance",
                "type": "uint256"
            }
        ],
        "name": "createOracle",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            }
        ],
        "name": "getOfficialOracle",
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
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            }
        ],
        "name": "getOracle",
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
                "name": "newController",
                "type": "address"
            }
        ],
        "name": "setNewController",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

