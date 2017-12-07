import React, { Component } from 'react';
import getWeb3 from './getWeb3'
import KeysManager from './keysManager';
import Keys from './Keys';
import swal from 'sweetalert';
import './index/index.css';
import ReactDOM from 'react-dom';

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
      mining: null
    }
    this.keysManager = null;
    getWeb3().then((web3Config) => {
      this.setState({web3Config})
      this.keysManager = new KeysManager({
        web3: web3Config.web3Instance
      });
    }).catch((error) => {
      if(error.msg){
        swal({
          icon: 'warning',
          title: 'Warning',
          content: error.node
        });
      }
    })
  }
  async onClick() {
    this.setState({loading:true});
    const initialKey = window.web3.eth.defaultAccount;
    const isValid = await this.keysManager.isInitialKeyValid(initialKey);
    console.log(isValid);
    if(Number(isValid) !== 1){
      this.setState({loading: false})
      swal("Warning!", "The key is not valid initial Key! Please make sure you have loaded correct initial key in metamask", "warning");
      return;
    }
    if(Number(isValid) === 1){
      const mining = await this.keysManager.generateKeys();
      const voting = await this.keysManager.generateKeys();
      const payout = await this.keysManager.generateKeys();
      this.setState({
        mining,
        voting,
        payout,
        keysGenerated: true
      })
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
        this.setState({loading: false})
        var content = document.createElement("div");
        content.innerHTML = `<div>
          Something went wrong!<br/><br/> 
          ${error.message}
        </div>`;
        swal({
          icon: 'error',
          title: 'Error',
          content: content
        });
      })
      console.log(this.state);
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
                  <button className="create-keys-button" onClick={this.onClick}>Generate keys</button>
                
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
