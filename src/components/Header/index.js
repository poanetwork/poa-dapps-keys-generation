import React from 'react'
import { constants } from '../../utils/constants'
import { Logo } from '../Logo'

export const Header = ({ extraClassName = '', isTestnet = false }) => {
  return (
    <header className={`sw-Header ${extraClassName} ${isTestnet ? 'sw-Header-test' : ''}`}>
      <div className="sw-Header_Content">
        <Logo isTestnet={isTestnet} href={constants.baseURL} />
      </div>
    </header>
  )
}
