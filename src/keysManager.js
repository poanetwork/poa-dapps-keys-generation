import KeysManagerAbi from './keysManagerAbi.json'
import Web3 from 'web3';
import addressGenerator from './addressGenerator';
import networkAddresses from './addresses'

export default class KeysManager {
  constructor({web3, netId}){
    let web3_10 = new Web3(web3.currentProvider);
    const {KEYS_MANAGER_ADDRESS} = networkAddresses(netId);
    console.log('Keys Manager ', KEYS_MANAGER_ADDRESS);
    this.keysInstance = new web3_10.eth.Contract(KeysManagerAbi, KEYS_MANAGER_ADDRESS);
  }
  async isInitialKeyValid(initialKey) {
    return await this.keysInstance.methods.initialKeys(initialKey).call();
  }

  async generateKeys() {
    return await addressGenerator();
  }
  createKeys({mining, voting, payout, sender}){
    return this.keysInstance.methods.createKeys(mining, voting, payout).send({from: sender})
  }
  
}