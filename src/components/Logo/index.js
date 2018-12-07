import React from 'react'
import { LogoPOA } from '../LogoPOA'
import { LogoSokol } from '../LogoSokol'

export const Logo = ({ href = null, extraClass = '', isTestnet = false }) => {
  return isTestnet ? <LogoSokol href={href} extraClass={extraClass} /> : <LogoPOA href={href} extraClass={extraClass} />
}
