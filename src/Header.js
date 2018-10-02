import React from 'react';
import helpers from "./helpers";

let Header = ({netId}) => {
  const thisIsTestnet = helpers.isTestnet(netId);
  const headerClassName = thisIsTestnet ? "sokol" : "";
  const logoClassName = thisIsTestnet ? "header-logo-sokol" : "header-logo";
  return (
  <header className={`header ${headerClassName}`}>
    <div className="container">
      <a href="/poa-dapps-keys-generation" className={logoClassName}></a>
    </div>
  </header>
  )
}

export default Header;