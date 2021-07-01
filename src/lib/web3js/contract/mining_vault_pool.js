import Web3 from 'web3';
import { Contract } from './contract';

/* eslint-disable */
const CONTRACT_ABI={"_format":"hh-sol-artifact-1","contractName":"Vault","sourceName":"contracts/Vault.sol","abi":[{"inputs":[{"internalType":"address","name":"tokenAddress_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"migrationTimestamp","type":"uint256"},{"indexed":false,"internalType":"address","name":"source","type":"address"},{"indexed":false,"internalType":"address","name":"destination","type":"address"}],"name":"ApproveMigration","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"deadline","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"nonce","type":"uint256"}],"name":"Claim","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"migrationTimestamp","type":"uint256"},{"indexed":false,"internalType":"address","name":"source","type":"address"},{"indexed":false,"internalType":"address","name":"destination","type":"address"}],"name":"ExecuteMigration","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"migrationTimestamp","type":"uint256"},{"indexed":false,"internalType":"address","name":"source","type":"address"},{"indexed":false,"internalType":"address","name":"destination","type":"address"}],"name":"PrepareMigration","type":"event"},{"inputs":[],"name":"CLAIM_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"approveMigration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"chainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"controller","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"source","type":"address"}],"name":"executeMigration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isMigrated","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"migrationDestination","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"migrationTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"destination","type":"address"},{"internalType":"uint256","name":"graceDays","type":"uint256"}],"name":"prepareMigration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newController","type":"address"}],"name":"setController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"usedHash","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}],"bytecode":"0x608060405234801561001057600080fd5b506040516112c63803806112c683398101604081905261002f91610066565b60008054336001600160a01b031991821617909155600380549091166001600160a01b039290921691909117905546600455610094565b600060208284031215610077578081fd5b81516001600160a01b038116811461008d578182fd5b9392505050565b611223806100a36000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80636b0509b1116100975780639a8a0592116100665780639a8a0592146101c85780639d76ea58146101d0578063b06faf62146101d8578063f77c4791146101e0576100f5565b80636b0509b114610185578063701422691461018d57806379a87b19146101a057806392eefe9b146101b5576100f5565b806351dfdb48116100d357806351dfdb4814610137578063560ebbd11461014a57806358c700a31461016a578063677528cb14610172576100f5565b806306fdde03146100fa57806320606b7014610118578063325564ec1461012d575b600080fd5b6101026101e8565b60405161010f9190610dbf565b60405180910390f35b610120610209565b60405161010f9190610d48565b61013561022d565b005b610135610145366004610bab565b6103a1565b61015d610158366004610ca1565b61066f565b60405161010f9190610d3d565b610120610684565b610135610180366004610bea565b61068a565b6101206107b1565b61013561019b366004610c15565b6107d5565b6101a8610acc565b60405161010f9190610cec565b6101356101c3366004610bab565b610adb565b610120610b77565b6101a8610b7d565b61015d610b8c565b6101a8610b9c565b6040518060400160405280600581526020016415985d5b1d60da1b81525081565b7f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a86681565b6000546001600160a01b031633146102605760405162461bcd60e51b815260040161025790610f7f565b60405180910390fd5b600254600160a01b900460ff161561028a5760405162461bcd60e51b81526004016102579061106a565b6001541580159061029d57506001544210155b6102b95760405162461bcd60e51b815260040161025790610e12565b60035460025460405163095ea7b360e01b81526001600160a01b039283169263095ea7b3926102f19291169060001990600401610d24565b602060405180830381600087803b15801561030b57600080fd5b505af115801561031f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103439190610c81565b506002805460ff60a01b1916600160a01b17908190556001546040517fce3275b30d22151f82ee29ce7ea685563b66ff98e56afc576a94d8a88c676ec092610397929130916001600160a01b031690611153565b60405180910390a1565b6000546001600160a01b031633146103cb5760405162461bcd60e51b815260040161025790610f7f565b600254600160a01b900460ff16156103f55760405162461bcd60e51b81526004016102579061106a565b6000816001600160a01b03166358c700a36040518163ffffffff1660e01b815260040160206040518083038186803b15801561043057600080fd5b505afa158015610444573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104689190610cb9565b90506000826001600160a01b03166379a87b196040518163ffffffff1660e01b815260040160206040518083038186803b1580156104a557600080fd5b505afa1580156104b9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104dd9190610bce565b905081158015906104ee5750814210155b61050a5760405162461bcd60e51b815260040161025790610ec5565b6001600160a01b03811630146105325760405162461bcd60e51b815260040161025790610fd5565b6003546040516370a0823160e01b81526001600160a01b03909116906323b872dd908590309084906370a082319061056e908590600401610cec565b60206040518083038186803b15801561058657600080fd5b505afa15801561059a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105be9190610cb9565b6040518463ffffffff1660e01b81526004016105dc93929190610d00565b602060405180830381600087803b1580156105f657600080fd5b505af115801561060a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061062e9190610c81565b507f18ce2512842fddee8c808fb717780a66007d1da9a942dd32625813c82d53c34282843060405161066293929190611153565b60405180910390a1505050565b60056020526000908152604090205460ff1681565b60015481565b6000546001600160a01b031633146106b45760405162461bcd60e51b815260040161025790610f7f565b600254600160a01b900460ff16156106de5760405162461bcd60e51b81526004016102579061106a565b6001600160a01b0382166107045760405162461bcd60e51b8152600401610257906110d3565b60038110158015610717575061016d8111155b6107335760405162461bcd60e51b815260040161025790610e68565b61074081620151806111a0565b61074a9042611188565b6001819055600280546001600160a01b0319166001600160a01b0385811691909117918290556040517fe2a3b7ba8269be3ca7ba4627f844bb9abd978e9b05d290dc89d4b107f9e3dda7936107a59390923092911690611153565b60405180910390a15050565b7f019be9374ae64f46b6d65fb010e2366f7f5a3c1e1fd07b8842f388871d59fb1281565b600254600160a01b900460ff16156107ff5760405162461bcd60e51b81526004016102579061106a565b8442111561081f5760405162461bcd60e51b815260040161025790610f1b565b604080518082018252600581526415985d5b1d60da1b6020918201526004549151600092610894927f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a866927f8d03f8e727eaf836840d08da04cd9ecc9773328dd38f4a6c7b84a9ec2b88b7c79291309101610d7d565b60405160208183030381529060405280519060200120905060007f019be9374ae64f46b6d65fb010e2366f7f5a3c1e1fd07b8842f388871d59fb12898989896040516020016108e7959493929190610d51565b60408051601f1981840301815291815281516020928301206000818152600590935291205490915060ff161561092f5760405162461bcd60e51b815260040161025790610f52565b6000818152600560209081526040808320805460ff191660011790555161095a918591859101610cd1565b6040516020818303038152906040528051906020012090506000600182888888604051600081526020016040526040516109979493929190610da1565b6020604051602081039080840390855afa1580156109b9573d6000803e3d6000fd5b5050604051601f1901516000549092506001600160a01b0380841691161490506109f55760405162461bcd60e51b81526004016102579061111c565b60035460405163a9059cbb60e01b81526001600160a01b039091169063a9059cbb90610a27908e908e90600401610d24565b602060405180830381600087803b158015610a4157600080fd5b505af1158015610a55573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a799190610c81565b508a6001600160a01b03167f45c072aa05b9853b5a993de7a28bc332ee01404a628cec1a23ce0f659f842ef18b8b8b604051610ab793929190611172565b60405180910390a25050505050505050505050565b6002546001600160a01b031681565b6000546001600160a01b03163314610b055760405162461bcd60e51b815260040161025790610f7f565b600254600160a01b900460ff1615610b2f5760405162461bcd60e51b81526004016102579061106a565b6001600160a01b038116610b555760405162461bcd60e51b815260040161025790611024565b600080546001600160a01b0319166001600160a01b0392909216919091179055565b60045481565b6003546001600160a01b031681565b600254600160a01b900460ff1681565b6000546001600160a01b031681565b600060208284031215610bbc578081fd5b8135610bc7816111d5565b9392505050565b600060208284031215610bdf578081fd5b8151610bc7816111d5565b60008060408385031215610bfc578081fd5b8235610c07816111d5565b946020939093013593505050565b600080600080600080600060e0888a031215610c2f578283fd5b8735610c3a816111d5565b9650602088013595506040880135945060608801359350608088013560ff81168114610c64578384fd5b9699959850939692959460a0840135945060c09093013592915050565b600060208284031215610c92578081fd5b81518015158114610bc7578182fd5b600060208284031215610cb2578081fd5b5035919050565b600060208284031215610cca578081fd5b5051919050565b61190160f01b81526002810192909252602282015260420190565b6001600160a01b0391909116815260200190565b6001600160a01b039384168152919092166020820152604081019190915260600190565b6001600160a01b03929092168252602082015260400190565b901515815260200190565b90815260200190565b9485526001600160a01b0393909316602085015260408401919091526060830152608082015260a00190565b938452602084019290925260408301526001600160a01b0316606082015260800190565b93845260ff9290921660208401526040830152606082015260800190565b6000602080835283518082850152825b81811015610deb57858101830151858201604001528201610dcf565b81811115610dfc5783604083870101525b50601f01601f1916929092016040019392505050565b60208082526036908201527f5661756c742e617070726f76654d6967726174696f6e3a206d6967726174696f6040820152751b951a5b595cdd185b5c081b9bdd081b595d081e595d60521b606082015260800190565b60208082526039908201527f4d696772617461626c652e707265706172654d6967726174696f6e3a2067726160408201527f636544617973206d75737420626520332d333635206461797300000000000000606082015260800190565b60208082526036908201527f5661756c742e657865637574654d6967726174696f6e3a206d6967726174696f6040820152751b951a5b595cdd185b5c081b9bdd081b595d081e595d60521b606082015260800190565b6020808252601e908201527f5661756c742e636c61696d3a207369676e617475726520657870697265640000604082015260600190565b6020808252601390820152725661756c742e636c61696d3a207265706c617960681b604082015260600190565b60208082526036908201527f4d696772617461626c652e5f636f6e74726f6c6c65725f3a2063616e206f6e6c6040820152753c9031b0b63632b210313c9031b7b73a3937b63632b960511b606082015260800190565b6020808252602f908201527f5661756c742e657865637574654d6967726174696f6e3a206e6f74206465737460408201526e696e6174696f6e206164647265737360881b606082015260800190565b60208082526026908201527f4d696772617461626c652e736574436f6e74726f6c6c65723a20746f2030206160408201526564647265737360d01b606082015260800190565b60208082526043908201527f4d696772617461626c652e5f76616c69645f3a2063616e6e6f742070726f636560408201527f65642c207468697320636f6e747261637420686173206265656e206d696772616060820152621d195960ea1b608082015260a00190565b60208082526029908201527f4d696772617461626c652e707265706172654d6967726174696f6e3a20746f2060408201526830206164647265737360b81b606082015260800190565b60208082526019908201527f5661756c742e636c61696d3a20756e617574686f72697a656400000000000000604082015260600190565b9283526001600160a01b03918216602084015216604082015260600190565b9283526020830191909152604082015260600190565b6000821982111561119b5761119b6111bf565b500190565b60008160001904831182151516156111ba576111ba6111bf565b500290565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b03811681146111ea57600080fd5b5056fea2646970667358221220309376e66ca21a54581da8ded1f86303ca0c78bd47254d1bdb5fb101169baa2364736f6c63430008010033","deployedBytecode":"0x608060405234801561001057600080fd5b50600436106100f55760003560e01c80636b0509b1116100975780639a8a0592116100665780639a8a0592146101c85780639d76ea58146101d0578063b06faf62146101d8578063f77c4791146101e0576100f5565b80636b0509b114610185578063701422691461018d57806379a87b19146101a057806392eefe9b146101b5576100f5565b806351dfdb48116100d357806351dfdb4814610137578063560ebbd11461014a57806358c700a31461016a578063677528cb14610172576100f5565b806306fdde03146100fa57806320606b7014610118578063325564ec1461012d575b600080fd5b6101026101e8565b60405161010f9190610dbf565b60405180910390f35b610120610209565b60405161010f9190610d48565b61013561022d565b005b610135610145366004610bab565b6103a1565b61015d610158366004610ca1565b61066f565b60405161010f9190610d3d565b610120610684565b610135610180366004610bea565b61068a565b6101206107b1565b61013561019b366004610c15565b6107d5565b6101a8610acc565b60405161010f9190610cec565b6101356101c3366004610bab565b610adb565b610120610b77565b6101a8610b7d565b61015d610b8c565b6101a8610b9c565b6040518060400160405280600581526020016415985d5b1d60da1b81525081565b7f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a86681565b6000546001600160a01b031633146102605760405162461bcd60e51b815260040161025790610f7f565b60405180910390fd5b600254600160a01b900460ff161561028a5760405162461bcd60e51b81526004016102579061106a565b6001541580159061029d57506001544210155b6102b95760405162461bcd60e51b815260040161025790610e12565b60035460025460405163095ea7b360e01b81526001600160a01b039283169263095ea7b3926102f19291169060001990600401610d24565b602060405180830381600087803b15801561030b57600080fd5b505af115801561031f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103439190610c81565b506002805460ff60a01b1916600160a01b17908190556001546040517fce3275b30d22151f82ee29ce7ea685563b66ff98e56afc576a94d8a88c676ec092610397929130916001600160a01b031690611153565b60405180910390a1565b6000546001600160a01b031633146103cb5760405162461bcd60e51b815260040161025790610f7f565b600254600160a01b900460ff16156103f55760405162461bcd60e51b81526004016102579061106a565b6000816001600160a01b03166358c700a36040518163ffffffff1660e01b815260040160206040518083038186803b15801561043057600080fd5b505afa158015610444573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104689190610cb9565b90506000826001600160a01b03166379a87b196040518163ffffffff1660e01b815260040160206040518083038186803b1580156104a557600080fd5b505afa1580156104b9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104dd9190610bce565b905081158015906104ee5750814210155b61050a5760405162461bcd60e51b815260040161025790610ec5565b6001600160a01b03811630146105325760405162461bcd60e51b815260040161025790610fd5565b6003546040516370a0823160e01b81526001600160a01b03909116906323b872dd908590309084906370a082319061056e908590600401610cec565b60206040518083038186803b15801561058657600080fd5b505afa15801561059a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105be9190610cb9565b6040518463ffffffff1660e01b81526004016105dc93929190610d00565b602060405180830381600087803b1580156105f657600080fd5b505af115801561060a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061062e9190610c81565b507f18ce2512842fddee8c808fb717780a66007d1da9a942dd32625813c82d53c34282843060405161066293929190611153565b60405180910390a1505050565b60056020526000908152604090205460ff1681565b60015481565b6000546001600160a01b031633146106b45760405162461bcd60e51b815260040161025790610f7f565b600254600160a01b900460ff16156106de5760405162461bcd60e51b81526004016102579061106a565b6001600160a01b0382166107045760405162461bcd60e51b8152600401610257906110d3565b60038110158015610717575061016d8111155b6107335760405162461bcd60e51b815260040161025790610e68565b61074081620151806111a0565b61074a9042611188565b6001819055600280546001600160a01b0319166001600160a01b0385811691909117918290556040517fe2a3b7ba8269be3ca7ba4627f844bb9abd978e9b05d290dc89d4b107f9e3dda7936107a59390923092911690611153565b60405180910390a15050565b7f019be9374ae64f46b6d65fb010e2366f7f5a3c1e1fd07b8842f388871d59fb1281565b600254600160a01b900460ff16156107ff5760405162461bcd60e51b81526004016102579061106a565b8442111561081f5760405162461bcd60e51b815260040161025790610f1b565b604080518082018252600581526415985d5b1d60da1b6020918201526004549151600092610894927f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a866927f8d03f8e727eaf836840d08da04cd9ecc9773328dd38f4a6c7b84a9ec2b88b7c79291309101610d7d565b60405160208183030381529060405280519060200120905060007f019be9374ae64f46b6d65fb010e2366f7f5a3c1e1fd07b8842f388871d59fb12898989896040516020016108e7959493929190610d51565b60408051601f1981840301815291815281516020928301206000818152600590935291205490915060ff161561092f5760405162461bcd60e51b815260040161025790610f52565b6000818152600560209081526040808320805460ff191660011790555161095a918591859101610cd1565b6040516020818303038152906040528051906020012090506000600182888888604051600081526020016040526040516109979493929190610da1565b6020604051602081039080840390855afa1580156109b9573d6000803e3d6000fd5b5050604051601f1901516000549092506001600160a01b0380841691161490506109f55760405162461bcd60e51b81526004016102579061111c565b60035460405163a9059cbb60e01b81526001600160a01b039091169063a9059cbb90610a27908e908e90600401610d24565b602060405180830381600087803b158015610a4157600080fd5b505af1158015610a55573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a799190610c81565b508a6001600160a01b03167f45c072aa05b9853b5a993de7a28bc332ee01404a628cec1a23ce0f659f842ef18b8b8b604051610ab793929190611172565b60405180910390a25050505050505050505050565b6002546001600160a01b031681565b6000546001600160a01b03163314610b055760405162461bcd60e51b815260040161025790610f7f565b600254600160a01b900460ff1615610b2f5760405162461bcd60e51b81526004016102579061106a565b6001600160a01b038116610b555760405162461bcd60e51b815260040161025790611024565b600080546001600160a01b0319166001600160a01b0392909216919091179055565b60045481565b6003546001600160a01b031681565b600254600160a01b900460ff1681565b6000546001600160a01b031681565b600060208284031215610bbc578081fd5b8135610bc7816111d5565b9392505050565b600060208284031215610bdf578081fd5b8151610bc7816111d5565b60008060408385031215610bfc578081fd5b8235610c07816111d5565b946020939093013593505050565b600080600080600080600060e0888a031215610c2f578283fd5b8735610c3a816111d5565b9650602088013595506040880135945060608801359350608088013560ff81168114610c64578384fd5b9699959850939692959460a0840135945060c09093013592915050565b600060208284031215610c92578081fd5b81518015158114610bc7578182fd5b600060208284031215610cb2578081fd5b5035919050565b600060208284031215610cca578081fd5b5051919050565b61190160f01b81526002810192909252602282015260420190565b6001600160a01b0391909116815260200190565b6001600160a01b039384168152919092166020820152604081019190915260600190565b6001600160a01b03929092168252602082015260400190565b901515815260200190565b90815260200190565b9485526001600160a01b0393909316602085015260408401919091526060830152608082015260a00190565b938452602084019290925260408301526001600160a01b0316606082015260800190565b93845260ff9290921660208401526040830152606082015260800190565b6000602080835283518082850152825b81811015610deb57858101830151858201604001528201610dcf565b81811115610dfc5783604083870101525b50601f01601f1916929092016040019392505050565b60208082526036908201527f5661756c742e617070726f76654d6967726174696f6e3a206d6967726174696f6040820152751b951a5b595cdd185b5c081b9bdd081b595d081e595d60521b606082015260800190565b60208082526039908201527f4d696772617461626c652e707265706172654d6967726174696f6e3a2067726160408201527f636544617973206d75737420626520332d333635206461797300000000000000606082015260800190565b60208082526036908201527f5661756c742e657865637574654d6967726174696f6e3a206d6967726174696f6040820152751b951a5b595cdd185b5c081b9bdd081b595d081e595d60521b606082015260800190565b6020808252601e908201527f5661756c742e636c61696d3a207369676e617475726520657870697265640000604082015260600190565b6020808252601390820152725661756c742e636c61696d3a207265706c617960681b604082015260600190565b60208082526036908201527f4d696772617461626c652e5f636f6e74726f6c6c65725f3a2063616e206f6e6c6040820152753c9031b0b63632b210313c9031b7b73a3937b63632b960511b606082015260800190565b6020808252602f908201527f5661756c742e657865637574654d6967726174696f6e3a206e6f74206465737460408201526e696e6174696f6e206164647265737360881b606082015260800190565b60208082526026908201527f4d696772617461626c652e736574436f6e74726f6c6c65723a20746f2030206160408201526564647265737360d01b606082015260800190565b60208082526043908201527f4d696772617461626c652e5f76616c69645f3a2063616e6e6f742070726f636560408201527f65642c207468697320636f6e747261637420686173206265656e206d696772616060820152621d195960ea1b608082015260a00190565b60208082526029908201527f4d696772617461626c652e707265706172654d6967726174696f6e3a20746f2060408201526830206164647265737360b81b606082015260800190565b60208082526019908201527f5661756c742e636c61696d3a20756e617574686f72697a656400000000000000604082015260600190565b9283526001600160a01b03918216602084015216604082015260600190565b9283526020830191909152604082015260600190565b6000821982111561119b5761119b6111bf565b500190565b60008160001904831182151516156111ba576111ba6111bf565b500290565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b03811681146111ea57600080fd5b5056fea2646970667358221220309376e66ca21a54581da8ded1f86303ca0c78bd47254d1bdb5fb101169baa2364736f6c63430008010033","linkReferences":{},"deployedLinkReferences":{}}
/* eslint-enable */

export class MiningVaultPool extends Contract {
  constructor(chainId, contractAddress, isProvider) {
    super(chainId, contractAddress, CONTRACT_ABI['abi'], isProvider);
    // this.contract = new this.web3.eth.Contract(
    //   CONTRACT_ABI['abi'],
    //   this.contractAddress
    // );
  }
  async mintDToken(accountAddress, ...args) {
    await this._init()
    const gas = await this._estimatedGas(
      'claim',
      [accountAddress, ...args],
      accountAddress
    );
    console.log(gas);
    let txRaw = [
      {
        from: accountAddress,
        to: this.contractAddress,
        gas: Web3.utils.numberToHex(gas),
        value: Web3.utils.numberToHex('0'),
        data: this.contract.methods['claim'](
          accountAddress,
          ...args
        ).encodeABI(),
      },
    ];
    let tx = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: txRaw,
    });
    return await new Promise(this._getTransactionReceipt(tx));
  }
}
