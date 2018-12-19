import React from 'react'
import icon from './icon.svg'

export const ButtonGenerate = ({ extraClassName = '', networkBranch = '', onClick = null, disabled = false }) => {
  return (
    <button
      className={`sw-ButtonGenerate ${extraClassName} ${'sw-ButtonGenerate-' + networkBranch}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span className="sw-ButtonGenerate_Text">Generate Keys</span>
      <img src={icon} alt="" className="sw-ButtonGenerate_Icon" />
    </button>
  )
}
