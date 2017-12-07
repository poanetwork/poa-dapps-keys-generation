import KeysManagerAbi from './keysManagerAbi.json'
import Web3 from 'web3';
import addressGenerator from './addressGenerator';

let web3_10 = new Web3(window.web3.currentProvider);
export default class KeysManager {
  constructor({web3}){
    this.keysInstance = new web3_10.eth.Contract(KeysManagerAbi, '0x758492834ed6454f41d6d3d6b73d6e46d4555429');
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