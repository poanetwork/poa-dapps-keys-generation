import React from 'react';
import { constants } from "./constants";

let Header = ({netId}) => {
  const thisIsTestnet = netId in constants.NETWORKS && constants.NETWORKS[netId].TESTNET;
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