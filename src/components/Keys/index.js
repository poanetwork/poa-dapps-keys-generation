import React, { Component } from 'react'
import Tooltip from 'rc-tooltip'
import { ButtonDownload } from '../ButtonDownload'

const encodeJson = json => {
  const encoded = window.encodeURIComponent(JSON.stringify(json))
  return `data:application/json;charset=utf-8,${encoded}`
}

export default class Keys extends Component {
  constructor(props) {
    super(props)
    this.onVisibleChange = this.onVisibleChange.bind(this)
    this.onCopyBtnClick = this.onCopyBtnClick.bind(this)
    this.state = {
      copyBtns: {
        copyMiningPass: {
          visible: false,
          text: 'Copy'
        },
        copyVotingPass: {
          visible: false,
          text: 'Copy'
        },
        copyPayoutPass: {
          visible: false,
          text: 'Copy'
        },
        copyMiningKey: {
          visible: false,
          text: 'Copy'
        },
        copyVotingKey: {
          visible: false,
          text: 'Copy'
        },
        copyPayoutKey: {
          visible: false,
          text: 'Copy'
        }
      }
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (this.refs.miningKeyAddress) {
      const Clipboard = require('clipboard')

      new Clipboard(this.refs.miningKeyAddress)
      new Clipboard(this.refs.miningKeyPass)
      new Clipboard(this.refs.payoutKeyAddress)
      new Clipboard(this.refs.payoutKeyPass)
      new Clipboard(this.refs.votingKeyAddress)
      new Clipboard(this.refs.votingKeyPass)
    }
  }
  onVisibleChange(id) {
    let copyBtns = this.state.copyBtns
    copyBtns[id].visible = !copyBtns[id].visible
    copyBtns[id].text = 'Copy'
    this.setState({
      copyBtns
    })
  }
  onCopyBtnClick(e) {
    const id = e.target.id
    let copyBtns = this.state.copyBtns
    copyBtns[id].text = 'Copied!'
    this.setState({
      copyBtns
    })
  }
  render() {
    const { networkBranch } = this.props

    return (
      <div className={`ky-Keys`}>
        <div className="ky-Keys_Block">
          <h2 className="ky-Keys_BlockTitle">Mining key</h2>
          <div className="ky-Keys_HashContainer">
            <p className={`ky-Keys_Hash ky-Keys_Hash-${networkBranch}`} id="miningKey">
              0x
              {this.props.mining.jsonStore.address}
            </p>
            <Tooltip
              visible={this.state.copyBtns.copyMiningKey.visible}
              animation="zoom"
              trigger="hover"
              onVisibleChange={() => {
                this.onVisibleChange('copyMiningKey')
              }}
              placement="right"
              overlay={this.state.copyBtns.copyMiningKey.text}
            >
              <span
                className={`ky-Keys_Copy ky-Keys_Copy-${networkBranch}`}
                data-clipboard-text={'0x' + this.props.mining.jsonStore.address}
                id="copyMiningKey"
                onClick={this.onCopyBtnClick}
                ref="miningKeyAddress"
              />
            </Tooltip>
          </div>
          <div className="ky-Keys_PasswordContainer">
            <label className="ky-Keys_PasswordLabel">Password:</label>
            <input
              className="ky-Keys_PasswordInput"
              defaultValue={this.props.mining.password}
              disabled={true}
              id="miningKeyPass"
              size={this.props.mining.password.length}
              type="password"
            />
            <Tooltip
              animation="zoom"
              trigger="hover"
              visible={this.state.copyBtns.copyMiningPass.visible}
              onVisibleChange={() => {
                this.onVisibleChange('copyMiningPass')
              }}
              placement="right"
              overlay={this.state.copyBtns.copyMiningPass.text}
            >
              <span
                id="copyMiningPass"
                onClick={this.onCopyBtnClick}
                className={`ky-Keys_Copy ky-Keys_Copy-${networkBranch}`}
                ref="miningKeyPass"
                data-clipboard-text={this.props.mining.password}
              />
            </Tooltip>
          </div>
          <p className="ky-Keys_Description">
            Download this key and use it in your mining node to validate blocks in the network. Mined coins will be
            deposited to your payout account.
          </p>
          <ButtonDownload
            download={`mining_${this.props.mining.jsonStore.address}.json`}
            href={encodeJson(this.props.mining.jsonStore)}
            id="miningKeyDownload"
            networkBranch={networkBranch}
            text="Download Mining Key"
          />
        </div>
        <div className="ky-Keys_Block">
          <h2 className="ky-Keys_BlockTitle">Payout key</h2>
          <div className="ky-Keys_HashContainer">
            <p className={`ky-Keys_Hash ky-Keys_Hash-${networkBranch}`} id="payoutKey">
              0x
              {this.props.payout.jsonStore.address}
            </p>
            <Tooltip
              visible={this.state.copyBtns.copyPayoutKey.visible}
              animation="zoom"
              trigger="hover"
              onVisibleChange={() => {
                this.onVisibleChange('copyPayoutKey')
              }}
              placement="right"
              overlay={this.state.copyBtns.copyPayoutKey.text}
            >
              <span
                className={`ky-Keys_Copy ky-Keys_Copy-${networkBranch}`}
                data-clipboard-text={'0x' + this.props.payout.jsonStore.address}
                id="copyPayoutKey"
                onClick={this.onCopyBtnClick}
                ref="payoutKeyAddress"
              />
            </Tooltip>
          </div>
          <div className="ky-Keys_PasswordContainer">
            <label className="ky-Keys_PasswordLabel">Password:</label>
            <input
              className="ky-Keys_PasswordInput"
              defaultValue={this.props.payout.password}
              disabled={true}
              id="payoutKeyPass"
              size={this.props.payout.password.length}
              type="password"
            />
            <Tooltip
              visible={this.state.copyBtns.copyPayoutPass.visible}
              animation="zoom"
              trigger="hover"
              onVisibleChange={() => {
                this.onVisibleChange('copyPayoutPass')
              }}
              placement="right"
              overlay={this.state.copyBtns.copyPayoutPass.text}
            >
              <span
                id="copyPayoutPass"
                onClick={this.onCopyBtnClick}
                className={`ky-Keys_Copy ky-Keys_Copy-${networkBranch}`}
                ref="payoutKeyPass"
                data-clipboard-text={this.props.payout.password}
              />
            </Tooltip>
          </div>
          <p className="ky-Keys_Description">
            Download this key and use it on your client node/wallet to spend earned coins.
          </p>
          <ButtonDownload
            download={`payout_${this.props.payout.jsonStore.address}.json`}
            href={encodeJson(this.props.payout.jsonStore)}
            id="payoutKeyDownload"
            networkBranch={networkBranch}
            text="Download Payout Key"
          />
        </div>
        <div className="ky-Keys_Block">
          <h2 className="ky-Keys_BlockTitle">Voting key</h2>
          <div className="ky-Keys_HashContainer">
            <p className={`ky-Keys_Hash ky-Keys_Hash-${networkBranch}`} id="votingKey">
              0x
              {this.props.voting.jsonStore.address}
            </p>
            <Tooltip
              visible={this.state.copyBtns.copyVotingKey.visible}
              animation="zoom"
              trigger="hover"
              onVisibleChange={() => {
                this.onVisibleChange('copyVotingKey')
              }}
              placement="right"
              overlay={this.state.copyBtns.copyVotingKey.text}
            >
              <span
                id="copyVotingKey"
                onClick={this.onCopyBtnClick}
                className={`ky-Keys_Copy ky-Keys_Copy-${networkBranch}`}
                ref="votingKeyAddress"
                data-clipboard-text={'0x' + this.props.voting.jsonStore.address}
              />
            </Tooltip>
          </div>
          <div className="ky-Keys_PasswordContainer">
            <label className="ky-Keys_PasswordLabel">Password:</label>
            <input
              className="ky-Keys_PasswordInput"
              defaultValue={this.props.voting.password}
              disabled={true}
              id="votingKeyPass"
              size={this.props.voting.password.length}
              type="password"
            />
            <Tooltip
              visible={this.state.copyBtns.copyVotingPass.visible}
              animation="zoom"
              trigger="hover"
              onVisibleChange={() => {
                this.onVisibleChange('copyVotingPass')
              }}
              placement="right"
              overlay={this.state.copyBtns.copyVotingPass.text}
            >
              <span
                id="copyVotingPass"
                onClick={this.onCopyBtnClick}
                className={`ky-Keys_Copy ky-Keys_Copy-${networkBranch}`}
                ref="votingKeyPass"
                data-clipboard-text={this.props.voting.password}
              />
            </Tooltip>
          </div>
          <p className="ky-Keys_Description">
            Download this key and use it on your client node to vote for necessary ballots, such as adding or removing
            miners from the network.
          </p>
          <ButtonDownload
            download={`voting_${this.props.voting.jsonStore.address}.json`}
            href={encodeJson(this.props.voting.jsonStore)}
            id="votingKeyDownload"
            networkBranch={networkBranch}
            text="Download Voting Key"
          />
        </div>
        <div className={`ky-Keys_Block ky-Keys_Block-${networkBranch}`}>
          <svg className="ky-Keys_WarningIcon" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
            <path
              className={`ky-Keys_WarningIconPath ky-Keys_WarningIconPath-${networkBranch}`}
              fill="#5C34A2"
              fillRule="evenodd"
              d="M24 48C10.745 48 0 37.255 0 24S10.745 0 24 0s24 10.745 24 24-10.745 24-24 24zm0-46C11.85 2 2 11.85 2 24s9.85 22 22 22 22-9.85 22-22S36.15 2 24 2zm0 35a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-6a1 1 0 0 1-1-1V12a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z"
            />
          </svg>
          <h2 className={`ky-Keys_BlockTitle ky-Keys_BlockTitle-${networkBranch}`}>Important</h2>
          <p className={`ky-Keys_Warning ky-Keys_Warning-${networkBranch}`}>
            Do not close this tab until you download all keys and save passwords. Keep keys secure and protected. If you
            lose your keys, you will need to get a new initial key using Voting DAPP.
          </p>
        </div>
      </div>
    )
  }
}
