import addressGenerator from './addressGenerator';
import helpers from "./helpers";
import { constants } from "./constants";

export default class KeysManager {
  async init({web3, netId, addresses}){
    const {KEYS_MANAGER_ADDRESS} = addresses;
    console.log('Keys Manager ', KEYS_MANAGER_ADDRESS);

    const KeysManagerAbi = await helpers.getABI(constants.NETWORKS[netId].BRANCH, 'KeysManager')

    this.instance = new web3.eth.Contract(KeysManagerAbi, KEYS_MANAGER_ADDRESS);

    const networkName = constants.NETWORKS[netId].NAME.toLowerCase();
    if (networkName === 'dai-test' || networkName === 'dai') {
      this.gasPrice = web3.utils.toWei('0', 'gwei');
    } else {
      this.gasPrice = web3.utils.toWei('2', 'gwei');
    }
  }

  async isInitialKeyValid(initialKey) {
    return new Promise((resolve, reject) => {
      const methods = this.instance.methods
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

  createKeys({mining, voting, payout, sender}) {
    return this.instance.methods.createKeys(mining, voting, payout).send({
      from: sender,
      gasPrice: this.gasPrice
    });
  }
}