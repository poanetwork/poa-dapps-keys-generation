import { constants } from './constants'
import helpers from './helpers'
//const local = {
//    "KEYS_MANAGER_ADDRESS": "0x3ef32bb244016ad9af8c8f45398511e7e551b581"
//}

export default web3Config => {
  const branch = constants.NETWORKS[web3Config.netId].BRANCH
  return new Promise((resolve, reject) => {
    fetch(helpers.addressesURL(branch))
      .then(response => {
        response.json().then(json => {
          resolve({ addresses: json, web3Config })
        })
      })
      .catch(function(err) {
        let addr = helpers.addressesURL(branch)
        helpers.wrongRepoAlert(addr)
        reject(err)
      })
  })
}
