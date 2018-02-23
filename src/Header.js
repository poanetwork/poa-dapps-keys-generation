import React from 'react';
let Header = ({netId}) => {
  const headerClassName = netId === '77' ? 'sokol' : '';
  const logoClassName = netId === '77' ? 'header-logo-sokol' : 'header-logo';
  return (
  <header class={`header ${headerClassName}`}>
    <div class="container">
      <a href="/poa-dapps-keys-generation" class={logoClassName}></a>
    </div>
  </header>
  )
}

export default Header;