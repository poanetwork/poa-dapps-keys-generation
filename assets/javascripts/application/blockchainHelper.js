function SHA3Encrypt(api, str, cb) {
  api._web3.sha3(str).then(function(strEncode) {
    cb(strEncode, null);
  }).catch(function(err) {
    console.log(err);
    cb("", err);
  });
}

function estimateGas(api, from, to, data, val, cb) {
  var props;
  if (val)
    props = { from: from, value: val, data: null, to: to };
  else
    props = { from: from, data: data, to: to };

  api.eth.estimateGas(props).then(function(res) {
    if (!res) {
      cb(null, {"code": 500, "title": "Error", "message": "Unexpected error"});
      return;
    }
    var gasWillUsed = res.c[0];
    cb(gasWillUsed);
    
  }, function(err) {
    console.log(err);
    cb(null, err);
  }).catch(function(err) {
    console.log(err);
    cb(null, err);
  });
}

function sendTx(api, from, to, data, val, estimatedGas, cb) {
  var props;
  if (val)
    props = { from: from, value: val, to: to, gas: estimatedGas };
  else
    props =  { from: from, data: data, to: to, gas: estimatedGas };

  api.eth.sendTransaction(props)
  .then(function(txHash) {
    cb(txHash);
  }).catch(function(err) {
    console.log(err);
    cb(null, err);
  });
}

function call(api, from, to, data, cb) {
  var props;
  if (from)
    props = { from: from, data: data, to: to };
  else
    props = { data: data, to: to };

  api.eth.call(props)
  .then(function(data) {
    cb(data);
  }).catch(function(err) {
    console.log(err);
    cb(null, err);
  });
}