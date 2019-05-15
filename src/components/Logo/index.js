import React from 'react'
import { LogoPOA } from '../LogoPOA'
import { LogoSokol } from '../LogoSokol'
import { LogoKovan } from '../LogoKovan'
import { LogoDai } from '../LogoDai'

export const Logo = ({ href = null, extraClass = '', networkBranch = '' }) => {
  switch (networkBranch) {
    case 'sokol':
      return <LogoSokol href={href} extraClass={extraClass} />
    case 'kovan':
      return <LogoKovan href={href} extraClass={extraClass} />
    case 'dai':
      return <LogoDai href={href} extraClass={extraClass} />
    case 'poa':
    default:
      return <LogoPOA href={href} extraClass={extraClass} />
  }
}
