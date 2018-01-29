import Web3 from 'web3';
import addressGenerator from './addressGenerator';
import networkAddresses from './addresses';
import helpers from "./helpers";

export default class KeysManager {
  async init({web3, netId}){
    this.web3_10 = new Web3(web3.currentProvider);
    const {KEYS_MANAGER_ADDRESS} = networkAddresses(netId);
    console.log('Keys Manager ', KEYS_MANAGER_ADDRESS);
    const branch = helpers.getBranch(netId);

    let that = this;

    let KeysManagerAbi = await helpers.getABI(branch, 'KeysManager')

    that.keysInstance = new this.web3_10.eth.Contract(KeysManagerAbi, KEYS_MANAGER_ADDRESS);
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