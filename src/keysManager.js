import Web3 from 'web3';
import addressGenerator from './addressGenerator';
import helpers from "./helpers";
import { constants } from "./constants";

export default class KeysManager {
  async init({web3, netId, addresses}){
    this.web3_10 = new Web3(web3.currentProvider);
    const {KEYS_MANAGER_ADDRESS} = addresses;
    console.log('Keys Manager ', KEYS_MANAGER_ADDRESS);
    const branch = helpers.getBranch(netId);

    const KeysManagerAbi = await helpers.getABI(branch, 'KeysManager')

    this.keysInstance = new this.web3_10.eth.Contract(KeysManagerAbi, KEYS_MANAGER_ADDRESS);
    this.netId = netId;
  }

  async isInitialKeyValid(initialKey) {
    return new Promise((resolve, reject) => {
      const methods = this.keysInstance.methods
      let getInitialKeyStatus
      if (methods.getInitialKeyStatus) {
        getInitialKeyStatus = methods.getInitialKeyStatus
      } else {
        getInitialKeyStatus = methods.initialKeys
      }
      getInitialKeyStatus(initialKey).call().then(function(result){
        resolve(result);
      }).catch(function(e) {
        reject(false);
      });
    })
  }

  async generateKeys() {
    return await addressGenerator();
  }

  createKeys({mining, voting, payout, sender}){
    let gasPrice = '2';
    if (this.netId === constants.NETID_DAI_TEST || this.netId === constants.NETID_DAI) {
      gasPrice = '0';
    }
    return this.keysInstance.methods.createKeys(mining, voting, payout).send({
      from: sender,
      gasPrice: this.web3_10.utils.toWei(gasPrice, 'gwei')
    });
  }
}