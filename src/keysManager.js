import KeysManagerAbi from './keysManagerAbi.json'
import Web3 from 'web3';
import addressGenerator from './addressGenerator';

const KEYS_MANAGER_ADDRESS = '0x88a34124bfffa27ef3e052c8dd2908e212643771'
export default class KeysManager {
  constructor(){
    if(window.web3.currentProvider){
      let web3_10 = new Web3(window.web3.currentProvider);
      this.keysInstance = new web3_10.eth.Contract(KeysManagerAbi, KEYS_MANAGER_ADDRESS);
    }
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