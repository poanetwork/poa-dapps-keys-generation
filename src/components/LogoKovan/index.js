import React from 'react'
import logoKovan from './logo.svg'

export const LogoKovan = ({ href = null, extraClass = '' }) => {
  return (
    <a href={href} className={`sw-LogoKovan ${extraClass}`}>
      <img className="sw-LogoKovan_Image" src={logoKovan} alt="" />
    </a>
  )
}
