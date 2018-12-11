import React from 'react'
import { ButtonGenerate } from '../ButtonGenerate'

export const Home = ({ extraClassName = '', networkBranch = false, onClick = null, disabled = false }) => {
  return (
    <div className={`hm-Home ${extraClassName}`}>
      <div className="hm-Home_TextContainer">
        <h1 className="hm-Home_Title">Create keys from initial key</h1>
        <p className="hm-Home_Text">
          In this application, you will create mining, payout and voting keys. The app will make your initial key
          unusable after the process. Please proceed with care, don't lose your keys and follow instructions.
        </p>
        <ButtonGenerate onClick={onClick} disabled={disabled} networkBranch={networkBranch} />
      </div>
      <div className="hm-Home_ImageContainer">
        <div className="hm-Home_Image">
          <div className="content-ratio" />
        </div>
      </div>
    </div>
  )
}
