import { constants } from './constants'

export const isTestnet = netId => {
  return netId in constants.NETWORKS && constants.NETWORKS[netId].TESTNET
}
