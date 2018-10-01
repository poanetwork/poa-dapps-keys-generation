import React from 'react'

let Header = ({netId}) => {
  const isTestnet = netId === '77' || netId === '79'
  const headerClassName = isTestnet ? 'sokol' : ''
  const logoClassName = isTestnet ? 'header-logo-sokol' : 'header-logo'
  return (
  <header className={`header ${headerClassName}`}>
    <div className="container">
      <a href="/poa-dapps-keys-generation" className={logoClassName}></a>
    </div>
  </header>
  )
}

export default Header