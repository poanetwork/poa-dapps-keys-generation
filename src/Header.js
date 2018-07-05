import React from 'react';
let Header = ({netId}) => {
  const headerClassName = netId === '77' ? 'sokol' : '';
  const logoClassName = netId === '77' ? 'header-logo-sokol' : 'header-logo';
  return (
  <header className={`header ${headerClassName}`}>
    <div className="container">
      <a href="/poa-dapps-keys-generation" className={logoClassName}></a>
    </div>
  </header>
  )
}

export default Header;