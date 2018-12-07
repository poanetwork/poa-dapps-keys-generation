import React from 'react'

export const Home = ({ extraClassName = '', isTestnet = false }) => {
  return (
    <div className={`hm-Home ${extraClassName} ${isTestnet ? 'hm-Home-test' : ''}`}>
      <div className="hm-Home_TextContainer">
        <h1>Create keys from initial key</h1>
        <h2>
          In this application, you will create mining, payout and voting keys. The app will make your initial key
          unusable after the process. Please proceed with care, don't lose your keys and follow instructions.
        </h2>
        <div className="create-keys-button-container">
          {/* <button className="create-keys-button" onClick={this.onClick} disabled={this.state.isDisabledBtn}>
            Generate keys
          </button> */}
        </div>
      </div>
      <div className="hm-Home_ImageContainer">
        <div className="hm-Home_Image">
          <div className="content-ratio" />
        </div>
      </div>
    </div>
  )
}
