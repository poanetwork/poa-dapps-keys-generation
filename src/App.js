import React, { Component } from 'react';
import getWeb3 from './getWeb3'
import KeysManager from './keysManager';
import Keys from './Keys';
import swal from 'sweetalert';
import './index/index.css';
import addressGenerator from './addressGenerator'
import JSzip from 'jszip';
import FileSaver from 'file-saver';
import { constants } from './constants';
import networkAddresses from './addresses';
import Header from './Header';
import Footer from './Footer';
import Loading from './Loading';

function generateElement(msg){
  let errorNode = document.createElement("div");
  errorNode.innerHTML = `<div style="line-height: 1.6;">
    ${msg}
  </div>`;
  return errorNode;
}

class App extends Component {
  constructor(props){
    super(props);
    this.onClick = this.onClick.bind(this);
    this.saveFile = (blob) => { 
      FileSaver.saveAs(blob, `poa_network_validator_keys.zip`);
    };
    this.state = {
      web3Config: {},
      mining: null,
      isDisabledBtn: props.generateKeysIsDisabled
    }
    this.keysManager = null;
    getWeb3().then(async (web3Config) => {
      return networkAddresses(web3Config)
    }).then(async (config) => {
      const {web3Config, addresses} = config;
      this.keysManager = new KeysManager();
      await this.keysManager.init({
        web3: web3Config.web3Instance,
        netId: web3Config.netId,
        addresses,
      });
      this.setState({
        isDisabledBtn: false,
        web3Config
      })
    }).catch((error) => {
      if(error.msg){
        this.setState({isDisabledBtn: true});
        swal({
          icon: 'warning',
          title: 'Warning',
          content: error.node
        });
      }
    })
  }
  componentDidMount(){
    if(window.location.hash.indexOf('just-generate-keys') !== -1) {
      this.setState({loading:true});
      setTimeout(async () => {
        const {mining, voting, payout} = await this.generateKeys();
        this.setState({loading:false});
        await this.generateZip({mining, voting, payout, netIdName: "manualCreation"});
      }, 150)
    }
  }
  async generateKeys(cb) {
    const mining = await addressGenerator();
    const voting = await addressGenerator();
    const payout = await addressGenerator();
    this.setState({
      mining,
      voting,
      payout,
      keysGenerated: true
    })
    return {
      mining, voting, payout
    }
  }
  async generateZip({mining, voting, payout, netIdName}){
    const zip = new JSzip();
    zip.file(`${netIdName}_keys/mining_key_${mining.jsonStore.address}.json`, JSON.stringify(mining.jsonStore));
    zip.file(`${netIdName}_keys/mining_password_${mining.jsonStore.address}.txt`, mining.password);

    zip.file(`${netIdName}_keys/voting_key_${voting.jsonStore.address}.json`, JSON.stringify(voting.jsonStore));
    zip.file(`${netIdName}_keys/voting_password_${voting.jsonStore.address}.txt`, voting.password);

    zip.file(`${netIdName}_keys/payout_key_${payout.jsonStore.address}.json`, JSON.stringify(payout.jsonStore));
    zip.file(`${netIdName}_keys/payout_password_${payout.jsonStore.address}.txt`, payout.password);
    zip.generateAsync({type:"blob"}).then((blob) => {
      FileSaver.saveAs(blob, `poa_network_validator_keys.zip`);
    });
  }
  async onClick() {
    this.setState({loading:true});
    const initialKey = window.web3.eth.defaultAccount;
    let isValid
    try {
      isValid = await this.keysManager.isInitialKeyValid(initialKey);
    } catch(e) {
      isValid = false;
    }
    console.log(isValid);
    if(Number(isValid) !== 1){
      this.setState({loading:false});
      const invalidKeyMsg = `The key is an invalid Initial key<br/>
      or you're connected to the incorrect chain!<br/>
      Please make sure you have loaded correct Initial key in MetaMask.<br/><br/>
      <b>Your current selected key is</b> <i>${initialKey}</i><br/>
      <b>Current Network ID</b> is <i>${this.state.web3Config.netId}</i>`
      swal({
        icon: 'error',
        title: 'Error',
        content: generateElement(invalidKeyMsg)
      })
      return;
    }
    if(Number(isValid) === 1){
      const {mining, voting, payout} = await this.generateKeys()
      // add loading screen
      await this.keysManager.createKeys({
        mining: mining.jsonStore.address,
        voting: voting.jsonStore.address,
        payout: payout.jsonStore.address,
        sender: initialKey
      }).then(async (receipt) => {
        console.log(receipt);
        if (receipt.status === true || receipt.status === "0x1") {
          this.setState({loading: false})
          swal("Congratulations!", "Your keys are generated!", "success");
          await this.generateZip({mining, voting, payout, netIdName: this.state.web3Config.netIdName});
        } else {
          this.setState({loading: false, keysGenerated: false})
          let content = document.createElement("div");
          let msg = `Transaction failed`;
          content.innerHTML = `<div>
            Something went wrong!<br/><br/>
            Please contact Master Of Ceremony<br/><br/>
            ${msg}
          </div>`;
          swal({
            icon: 'error',
            title: 'Error',
            content: content
          });
        }
      }).catch((error) => {
        console.error(error.message);
        this.setState({loading: false, keysGenerated: false})
        let content = document.createElement("div");
        let msg;
        if (error.message.includes(constants.userDeniedTransactionPattern))
          msg = `Error: ${constants.userDeniedTransactionPattern}`
        else
          msg = error.message
        content.innerHTML = `<div>
          Something went wrong!<br/><br/>
          Please contact Master Of Ceremony<br/><br/>
          ${msg}
        </div>`;
        swal({
          icon: 'error',
          title: 'Error',
          content: content
        });
      })
    }
  }
  render() {    
    let loader = this.state.loading ? <Loading netId={this.state.web3Config.netId}/> : '';
    let createKeyBtn = (<div className="create-keys">
              <h1>Create keys from initial key</h1>
              <h2>
                In this application, you will create mining, payout and voting keys.
                The app will make your initial key unusable after the process.
                Please proceed with care, don't lose your keys and follow instructions.
              </h2>
                <div className="create-keys-button-container">
                  <button className="create-keys-button" onClick={this.onClick} disabled={this.state.isDisabledBtn}>Generate keys</button>
                
                </div>
            </div>)
    let content;
    if(this.state.keysGenerated){
      content = <Keys mining={this.state.mining} voting={this.state.voting} payout={this.state.payout}/> 
    } else {
      content = createKeyBtn
    }
    return (
      <div className="App">
        <Header netId={this.state.web3Config.netId}/>
        {loader}
        <section className="content">
          {content}
        </section>
        <Footer netId={this.state.web3Config.netId}/>
      </div>
    );
  }
}

export default App;
