import Web3 from 'web3'
import { constants } from './constants'

const errorMsgNoMetamaskAccount = `You haven't chosen any account in MetaMask.
Please choose your initial key in MetaMask and reload the page.
Check POA Network <a href='https://github.com/poanetwork/wiki' target='blank'>wiki</a> for more info.`

const errorMsgDeniedAccess = 'You have denied access to your accounts'

function generateElement(msg) {
  let errorNode = document.createElement('div')
  errorNode.innerHTML = `<div style="line-height: 1.6;">
    ${msg}
  </div>`
  return errorNode
}
let getWeb3 = () => {
  return new Promise(function(resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async function() {
      let web3

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (window.ethereum) {
        web3 = new Web3(window.ethereum)
        console.log('Injected web3 detected.')
        try {
          await window.ethereum.enable()
        } catch (e) {
          reject({
            msg: errorMsgDeniedAccess,
            node: generateElement(errorMsgDeniedAccess)
          })
          return
        }
      } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider)
        console.log('Injected web3 detected.')
      } else {
        console.error('Metamask not found')
        reject({
          msg: errorMsgNoMetamaskAccount,
          node: generateElement(errorMsgNoMetamaskAccount)
        })
        return
      }

      const netId = await web3.eth.net.getId()
      console.log('netId', netId)

      let netIdName
      let errorMsg = null

      if (netId in constants.NETWORKS) {
        netIdName = constants.NETWORKS[netId].NAME
        console.log(`This is ${netIdName}`)
      } else {
        netIdName = 'ERROR'
        errorMsg = `You aren't connected to POA Network.
            Please switch on Metamask and refresh the page.
            Check POA Network <a href='https://github.com/poanetwork/wiki' target='blank'>wiki</a> for more info.
            <b>Current Network ID</b> is <i>${netId}</i>`
        console.log('This is an unknown network.')
      }

      document.title = `${netIdName} - DApp Keys Generation`

      if (errorMsg !== null) {
        reject({ msg: errorMsg, node: generateElement(errorMsg) })
        return
      }

      const accounts = await web3.eth.getAccounts()
      const defaultAccount = accounts[0] || null
      if (defaultAccount === null) {
        reject({
          msg: errorMsgNoMetamaskAccount,
          node: generateElement(errorMsgNoMetamaskAccount)
        })
        return
      }

      resolve({
        web3Instance: web3,
        netIdName,
        netId,
        defaultAccount
      })
    })
  })
}

export default getWeb3
