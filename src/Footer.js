import React from "react";
import moment from "moment";
import { constants } from "./constants";

const Footer = ({netId}) => {
  const footerClassName = netId in constants.NETWORKS && constants.NETWORKS[netId].TESTNET ? "sokol" : "";

  return (
  <footer className={`footer ${footerClassName}`}>
    <div className="container">
      <p className="footer-rights">{moment().format('YYYY')} POA Network. All rights reserved.</p>
      <a href="/poa-dapps-keys-generation" className="footer-logo"></a>
      <div className="socials">
        <a href="https://twitter.com/poanetwork" className="socials-i socials-i_twitter">Twitter</a>
        <a href="https://poa.network" className="socials-i socials-i_oracles">POA Network</a>
        <a href="https://t.me/oraclesnetwork" className="socials-i socials-i_telegram">Telegram</a>
        <a href="https://github.com/poanetwork/" className="socials-i socials-i_github">GitHub</a>
      </div>
    </div>
  </footer>
  )
}

export default Footer;