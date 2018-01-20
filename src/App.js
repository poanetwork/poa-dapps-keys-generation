import React, { Component } from 'react';
import getWeb3 from './getWeb3'
import KeysManager from './keysManager';
import Keys from './Keys';
import swal from 'sweetalert';
import './index/index.css';
import ReactDOM from 'react-dom';
import { error } from 'util';
import addressGenerator from './addressGenerator'
import JSzip from 'jszip';
import FileSaver from 'file-saver';

function generateElement(msg){
  let errorNode = document.createElement("div");
  errorNode.innerHTML = `<div>
    ${msg}
  </div>`;
  return errorNode;
}

const Loading = () => (
  <div className="loading-container">
    <div className="loading">
      <div className="loading-i"></div>
      <div className="loading-i"></div>
      <div className="loading-i"></div>
      <div className="loading-i"></div>
      <div className="loading-i"></div>
      <div className="loading-i"></div>
    </div>
  </div>
)

class App extends Component {
  constructor(props){
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state = {
      web3Config: {},
      mining: null,
      isDisabledBtn: false
    }
    this.keysManager = null;
    getWeb3().then((web3Config) => {
      this.setState({web3Config})
      this.keysManager = new KeysManager({
        web3: web3Config.web3Instance,
        netId: web3Config.netId
      });
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
      setTimeout(() => {
        this.generateKeys();
        this.setState({loading:false});
      }, 1500)
    }
  }
  async generateKeys() {
    const mining = await addressGenerator();
    const voting = await addressGenerator();
    const payout = await addressGenerator();
    const zip = new JSzip();
    const netIdName = this.state.web3Config.netIdName;
    zip.file(`${netIdName}_keys/mining_key_${mining.jsonStore.address}.json`, JSON.stringify(mining.jsonStore));
    zip.file(`${netIdName}_keys/mining_password_${mining.jsonStore.address}.txt`, mining.password);

    zip.file(`${netIdName}_keys/voting_key_${voting.jsonStore.address}.json`, JSON.stringify(voting.jsonStore));
    zip.file(`${netIdName}_keys/voting_password_${voting.jsonStore.address}.txt`, voting.password);

    zip.file(`${netIdName}_keys/payout_key_${payout.jsonStore.address}.json`, JSON.stringify(payout.jsonStore));
    zip.file(`${netIdName}_keys/payout_password_${payout.jsonStore.address}.txt`, payout.password);
    zip.generateAsync({type:"blob"}).then((blob) => { // 1) generate the zip file
      FileSaver.saveAs(blob, `poa_network_validator_keys.zip`);                          // 2) trigger the download
    });
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
  async onClick() {
    this.setState({loading:true});
    const initialKey = window.web3.eth.defaultAccount;
    const isValid = await this.keysManager.isInitialKeyValid(initialKey);
    console.log(isValid);
    if(Number(isValid) !== 1){
      this.setState({loading:false});
      const invalidKeyMsg = `The key is not valid initial Key!<br/>
      Please make sure you have loaded correct initial key in metamask.<br/>
      Your current selected key is ${initialKey}`
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
      }).then((receipt) => {
        console.log(receipt);
        this.setState({loading: false})
        swal("Congratulations!", "Your keys are generated!", "success");
      }).catch((error) => {
        console.error(error.message);
        this.setState({loading: false, keysGenerated: false})
        var content = document.createElement("div");
        content.innerHTML = `<div>
          Something went wrong!<br/><br/>
          Please contact Master Of Ceremony<br/><br/>
          ${error.message}
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
    let loader = this.state.loading ? <Loading /> : '';
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
        {loader}
          <section className="content">
          {content}
          </section>
      </div>
    );
  }
}

export default App;
