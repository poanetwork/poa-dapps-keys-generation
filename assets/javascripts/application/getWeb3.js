//gets web3 object from MetaMask or Parity
async function getWeb3(callback) {
  if (typeof window.web3 === 'undefined') {
    // no web3, use fallback
    console.error("Please use a web3 browser");
    var msgNotEthereum = "You aren't connected to Oracles Network. Please, switch on Oracles plugin and refresh the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.";
    swal("Warning", msgNotEthereum, "warning");
    callback(myWeb3, false);
  } else {
    var myWeb3 = new Web3(window.web3.currentProvider); 

    myWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;
    if (!myWeb3) {
      let accounts = await myWeb3.eth.getAccounts()
      myWeb3.eth.defaultAccount = accounts[0].toLowerCase()
    }
    console.log(myWeb3.eth.defaultAccount)

    let isOraclesNetwork = checkNetworkVersion(myWeb3)
    callback(myWeb3, isOraclesNetwork);
  }
}