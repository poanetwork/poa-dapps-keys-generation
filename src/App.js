import FileSaver from 'file-saver'
import JSzip from 'jszip'
import Keys from './components/Keys'
import KeysManager from './utils/keysManager'
import React, { Component } from 'react'
import addressGenerator from './utils/addressGenerator'
import getWeb3 from './utils/getWeb3'
import networkAddresses from './utils/addresses'
import swal from 'sweetalert'
import { BaseLoader } from './components/BaseLoader'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Home } from './components/Home'
import { Loading } from './components/Loading'
import { constants } from './utils/constants'
import { getNetworkBranch } from './utils/utils'

import './assets/stylesheets/index.css'

function generateElement(msg) {
  let errorNode = document.createElement('div')
  errorNode.innerHTML = `<div style="line-height: 1.6;">
    ${msg}
  </div>`
  return errorNode
}

class App extends Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.saveFile = blob => {
      FileSaver.saveAs(blob, `poa_network_validator_keys.zip`)
    }
    this.state = {
      web3Config: {},
      mining: null,
      isDisabledBtn: props.generateKeysIsDisabled,
      networkBranch: ''
    }
    this.keysManager = null

    getWeb3()
      .then(async web3Config => {
        return networkAddresses(web3Config)
      })
      .then(async config => {
        const { web3Config, addresses } = config

        this.keysManager = new KeysManager()
        await this.keysManager.init({
          web3: web3Config.web3Instance,
          netId: web3Config.netId,
          addresses
        })

        this.setState({
          networkBranch: getNetworkBranch(web3Config.netId),
          isDisabledBtn: false,
          web3Config
        })
      })
      .catch(error => {
        if (error.msg) {
          this.setState({ isDisabledBtn: true })
          swal({
            icon: 'warning',
            title: 'Warning',
            content: error.node
          })
        }
      })
  }

  componentDidMount() {
    if (window.location.hash.indexOf('just-generate-keys') !== -1) {
      this.setState({ loading: true })
      setTimeout(async () => {
        const { mining, voting, payout } = await this.generateKeys()
        this.setState({ loading: false })
        await this.generateZip({
          mining,
          voting,
          payout,
          netIdName: 'manualCreation'
        })
      }, 150)
    }
  }

  async generateKeys(cb) {
    const mining = await addressGenerator()
    const voting = await addressGenerator()
    const payout = await addressGenerator()
    this.setState({
      mining,
      voting,
      payout,
      keysGenerated: true
    })
    return {
      mining,
      voting,
      payout
    }
  }

  async generateZip({ mining, voting, payout, netIdName }) {
    const zip = new JSzip()
    zip.file(`${netIdName}_keys/mining_key_${mining.jsonStore.address}.json`, JSON.stringify(mining.jsonStore))
    zip.file(`${netIdName}_keys/mining_password_${mining.jsonStore.address}.txt`, mining.password)

    zip.file(`${netIdName}_keys/voting_key_${voting.jsonStore.address}.json`, JSON.stringify(voting.jsonStore))
    zip.file(`${netIdName}_keys/voting_password_${voting.jsonStore.address}.txt`, voting.password)

    zip.file(`${netIdName}_keys/payout_key_${payout.jsonStore.address}.json`, JSON.stringify(payout.jsonStore))
    zip.file(`${netIdName}_keys/payout_password_${payout.jsonStore.address}.txt`, payout.password)
    zip.generateAsync({ type: 'blob' }).then(blob => {
      FileSaver.saveAs(blob, `poa_network_validator_keys.zip`)
    })
  }

  async onClick() {
    this.setState({ loading: true })
    const initialKey = this.state.web3Config.defaultAccount
    let isValid
    try {
      isValid = await this.keysManager.isInitialKeyValid(initialKey)
    } catch (e) {
      isValid = false
    }

    if (Number(isValid) !== 1) {
      this.setState({ loading: false })
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
      return
    }
    if (Number(isValid) === 1) {
      const { mining, voting, payout } = await this.generateKeys()
      // add loading screen
      await this.keysManager
        .createKeys({
          mining: mining.jsonStore.address,
          voting: voting.jsonStore.address,
          payout: payout.jsonStore.address,
          sender: initialKey
        })
        .then(async receipt => {
          if (receipt.status === true || receipt.status === '0x1') {
            this.setState({ loading: false })
            swal('Congratulations!', 'Your keys are generated!', 'success')
            await this.generateZip({
              mining,
              voting,
              payout,
              netIdName: this.state.web3Config.netIdName
            })
          } else {
            this.setState({ loading: false, keysGenerated: false })
            let content = document.createElement('div')
            let msg = `Transaction failed`
            content.innerHTML = `<div>
            Something went wrong!<br/><br/>
            Please contact Master Of Ceremony<br/><br/>
            ${msg}
          </div>`
            swal({
              icon: 'error',
              title: 'Error',
              content: content
            })
          }
        })
        .catch(error => {
          this.setState({ loading: false, keysGenerated: false })
          let content = document.createElement('div')
          let msg
          if (error.message.includes(constants.userDeniedTransactionPattern))
            msg = `Error: ${constants.userDeniedTransactionPattern}`
          else msg = error.message
          content.innerHTML = `<div>
          Something went wrong!<br/><br/>
          Please contact Master Of Ceremony<br/><br/>
          ${msg}
        </div>`
          swal({
            icon: 'error',
            title: 'Error',
            content: content
          })
        })
    }
  }

  render() {
    return this.state.networkBranch ? (
      <div className="lo-App">
        {this.state.loading ? <Loading networkBranch={this.state.networkBranch} /> : null}
        <Header networkBranch={this.state.networkBranch} />
        <section className="lo-App_Content">
          {this.state.keysGenerated ? (
            <Keys
              mining={this.state.mining}
              networkBranch={this.state.networkBranch}
              payout={this.state.payout}
              voting={this.state.voting}
            />
          ) : (
            <Home disabled={this.state.isDisabledBtn} networkBranch={this.state.networkBranch} onClick={this.onClick} />
          )}
        </section>
        <Footer networkBranch={this.state.networkBranch} />
      </div>
    ) : (
      <BaseLoader />
    )
  }
}

export default App
