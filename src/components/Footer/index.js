import React from 'react'
import moment from 'moment'
import { Logo } from '../Logo'
import { SocialIcons } from '../SocialIcons'
import { constants } from '../../utils/constants'

export const Footer = ({ extraClassName = '', isTestnet = false }) => {
  return (
    <footer className={`sw-Footer ${extraClassName} ${isTestnet ? 'sw-Footer-test' : ''}`}>
      <div className="sw-Footer_Content">
        <Logo isTestnet={isTestnet} href={constants.baseURL} />
        <p className="sw-Footer_Text">{moment().format('YYYY')} POA Network. All rights reserved.</p>
        <SocialIcons />
      </div>
    </footer>
  )
}
