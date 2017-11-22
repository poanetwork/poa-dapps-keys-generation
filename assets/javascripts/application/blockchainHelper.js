function getBalance(address, cb) {
  web3.eth.getBalance(address, function(err, balance) {
    if (err) {
          console.log(err);
          $(".loading-container").hide();
          return;
        }

        cb(balance);
      });
}

function attachToContract(web3, abi, addr, cb) {
  web3.eth.defaultAccount = web3.eth.accounts[0];
  console.log("web3.eth.defaultAccount:" + web3.eth.defaultAccount);
  
  var contractInstance = new web3.eth.Contract(abi, addr);
  
  if (cb) cb(null, contractInstance);
}