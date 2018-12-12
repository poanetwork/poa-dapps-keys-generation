import React from 'react'
import { constants } from '../../utils/constants'
import { Logo } from '../Logo'

export const Header = ({ extraClassName = '', networkBranch = '' }) => {
  return (
    <header className={`sw-Header ${extraClassName} ${'sw-Header-' + networkBranch}`}>
      <div className="sw-Header_Content">
        <Logo networkBranch={networkBranch} href={constants.baseURL} />
      </div>
    </header>
  )
}
