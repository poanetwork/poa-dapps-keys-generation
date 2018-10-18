let constants = {}
constants.organization = 'poanetwork'
constants.repoName = 'poa-chain-spec'
constants.addressesSourceFile = 'contracts.json'
constants.ABIsSources = {
  KeysManager: 'KeysManager.abi.json'
}
constants.userDeniedTransactionPattern = 'User denied transaction'

constants.NETWORKS = {
  '77': {
    NAME: 'Sokol',
    BRANCH: 'sokol',
    TESTNET: true
  },
  '99': {
    NAME: 'Core',
    BRANCH: 'core',
    TESTNET: false
  },
  '79': {
    NAME: 'Dai-Test',
    BRANCH: 'dai-test',
    TESTNET: true
  },
  '100': {
    NAME: 'Dai',
    BRANCH: 'dai',
    TESTNET: false
  }
}

module.exports = {
  constants
}
