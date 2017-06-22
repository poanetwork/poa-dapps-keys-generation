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
    console.log(err);
    console.log(estimatedGas);
    cb(estimatedGas);
  });
}

function sendTx(web3, from, to, data, val, estimatedGas, cb) {
  var props;
  if (val)
    props = { from: from, value: val, to: to, gas: estimatedGas };
  else
    props =  { from: from, data: data, to: to, gas: estimatedGas };

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