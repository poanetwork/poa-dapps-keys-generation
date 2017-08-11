function SHA3Encrypt(web3, str, cb) {
  var strEncode = web3.sha3(str);
  cb(strEncode);
}

function estimateGas(web3, from, to, data, val, cb) {
  var props;
  if (val)
    props = { from: from, value: val, data: null, to: to };
  else
    props = { from: from, data: data, to: to };

  web3.eth.estimateGas(props, function(err, estimatedGas) {
    if (err) console.log(err);
    console.log(estimatedGas);
    cb(estimatedGas);
  });
}

function sendTx(web3, from, to, data, val, estimatedGas, gasPrice, cb) {
  var props;
  if (val)
    props = { from: from, value: val, to: to, gas: estimatedGas, gasPrice: gasPrice };
  else
    props =  { from: from, data: data, to: to, gas: estimatedGas, gasPrice: gasPrice };

  web3.eth.sendTransaction(props, function(err, txHash) {
    cb(txHash, err);
  });
}

function call(web3, from, to, data, cb) {
  var props;
  if (from)
    props = { from: from, data: data, to: to };
  else
    props = { data: data, to: to };

  web3.eth.call(props, function(err, data) {
    cb(data);
  });
}

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

function getGasPrice(cb) {    
  web3.eth.getGasPrice(function(err, gasPriceObj) {
    if (err) {
      console.log(err);
      $(".loading-container").hide();
      return;
    }
    console.log(gasPriceObj);
    var gasPrice = gasPriceObj.c[0];

    cb(gasPrice);
  });
}