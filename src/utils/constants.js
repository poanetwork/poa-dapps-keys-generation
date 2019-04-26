let constants = {}

constants.organization = 'poanetwork'
constants.repoName = 'poa-chain-spec'
constants.addressesSourceFile = 'contracts.json'
constants.ABIsSources = {
  KeysManager: 'KeysManager.abi.json'
}
constants.userDeniedTransactionPattern = 'User denied transaction'
constants.baseURL = '/poa-dapps-keys-generation'

constants.NETWORKS = {
  '42': {
    NAME: 'Kovan',
    BRANCH: 'kovan',
    TESTNET: true
  },
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
  '100': {
    NAME: 'Dai',
    BRANCH: 'dai',
    TESTNET: false
  }
}

module.exports = {
  constants
}
