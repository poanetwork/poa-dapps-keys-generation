import Web3 from 'web3';
import addressGenerator from './addressGenerator';
import helpers from "./helpers";

export default class KeysManager {
  async init({web3, netId, addresses}){
    this.web3_10 = new Web3(web3.currentProvider);
    const {KEYS_MANAGER_ADDRESS} = addresses;
    console.log('Keys Manager ', KEYS_MANAGER_ADDRESS);
    const branch = helpers.getBranch(netId);

    let KeysManagerAbi = await helpers.getABI(branch, 'KeysManager')

    this.keysInstance = new this.web3_10.eth.Contract(KeysManagerAbi, KEYS_MANAGER_ADDRESS);
  }

  async isInitialKeyValid(initialKey) {
    return await this.keysInstance.methods.initialKeys(initialKey).call();
  }

  async generateKeys() {
    return await addressGenerator();
  }
  createKeys({mining, voting, payout, sender}){
    const gasPrice = this.web3_10.utils.toWei('2', 'gwei')
    return this.keysInstance.methods.createKeys(mining, voting, payout).send({from: sender, gasPrice})
  }
  
}