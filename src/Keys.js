import React, { Component } from 'react';
const encodeJson = (json) => {
  const encoded =  window.encodeURIComponent(JSON.stringify(json));
  return `data:application/json;charset=utf-8,${encoded}`;
}

export default class Keys extends Component{
  componentWillUpdate(nextProps, nextState) {
    if (this.refs.miningKeyAddress) {
      const Clipboard = require('clipboard');
      // this.clipboard = new Clipboard(this.refs.copyBtn);
      new Clipboard(this.refs.miningKeyAddress);
      new Clipboard(this.refs.miningKeyPass);
      new Clipboard(this.refs.payoutKeyAddress);
      new Clipboard(this.refs.payoutKeyPass);
      new Clipboard(this.refs.votingKeyAddress);
      new Clipboard(this.refs.votingKeyPass);
    }
  }
  render(){
    return ( <div className="container">
    <div className="keys">
      <div className="keys-i">
        <p className="keys-title">Mining key</p>
        <div className="keys-hash-container">
          <p className="keys-hash" id="miningKey">0x{this.props.mining.jsonStore.address}</p>
          <span id="copyMiningKey" className="copy"  ref="miningKeyAddress" data-clipboard-text={"0x"+this.props.mining.jsonStore.address}></span>
        </div>
        <p className="keys-hash">
          <span className="password-label">Password:</span>
          <span id="miningKeyPass" className="pass">{this.props.mining.password}</span>
          <span id="copyMiningPass" className="copy" ref="miningKeyPass" data-clipboard-text={this.props.mining.password} ></span>
        </p>
        <p className="keys-description">
          Download this key and use it in your mining node to
          validate blocks in the network. Mined coins will be
          deposited to your payout account.
        </p>
        <div className="keys-footer">
          <a className="keys-download" id="miningKeyDownload" href={encodeJson(this.props.mining.jsonStore)} download="Mining_Key.json">Download Mining Key</a>
        </div>
      </div>
      <div className="keys-i">
        <p className="keys-title">Payout key</p>
        <div className="keys-hash-container">
          <p className="keys-hash" id="payoutKey">0x{this.props.payout.jsonStore.address}</p>
          <span id="copyPayoutKey" className="copy" ref="payoutKeyAddress" data-clipboard-text={"0x"+this.props.payout.jsonStore.address}></span>
        </div>
        <p className="keys-hash"> 
          <span className="password-label">Password:</span>
          <span id="payoutKeyPass" className="pass">{this.props.payout.password}</span>
          <span id="copyPayoutPass" className="copy" ref="payoutKeyPass" data-clipboard-text={this.props.payout.password}></span>
        </p>
        <p className="keys-description">
          Download this key and use it on your client
          node/wallet to spend earned coins.
        </p>
        <div className="keys-footer">
          <a className="keys-download" id="payoutKeyDownload" href={encodeJson(this.props.payout.jsonStore)} download="Payout_Key.json">Download Payout Key</a>
        </div>
      </div>
      <div className="keys-i">
        <p className="keys-title">Voting key</p>
        <div className="keys-hash-container">
          <p className="keys-hash" id="votingKey">0x{this.props.voting.jsonStore.address}</p>
          <span id="copyVotingKey" className="copy" ref="votingKeyAddress" data-clipboard-text={"0x"+this.props.voting.jsonStore.address}></span>
        </div>
        <p className="keys-hash">
          <span className="password-label">Password:</span>
          <span id="votingKeyPass" className="pass">{this.props.voting.password}</span>
          <span id="copyVotingPass" className="copy" ref="votingKeyPass" data-clipboard-text={this.props.voting.password} ></span>
        </p>
        <p className="keys-description">
          Download this key and use it on your client node to
          vote for necessary ballots,  such as adding or
          removing miners from the network.
        </p>
        <div className="keys-footer">  
          <a className="keys-download" id="votingKeyDownload" href={encodeJson(this.props.voting.jsonStore)} download="Voting_Key.json">Download Voting Key</a>
        </div>
      </div>
    </div>
    <div className="keys-note">
      <p className="keys-note-title">Important</p>
      <p className="keys-note-description">
        Do not close this tab until you download all keys and save passwords. Keep keys secure and protected. If you lose your keys, you will need to get a new initial key using Voting DAPP.
      </p>
    </div>
  </div>
  )
  }
}
 