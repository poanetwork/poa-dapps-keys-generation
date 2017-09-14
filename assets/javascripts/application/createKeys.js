function createKeys(web3, func, keys, address, contractAddr, abi, cb) {

  attachToContract(web3, abi, contractAddr, function(err, oraclesContract) {
    console.log("attach to oracles contract");
    if (err) {
      console.log(err)
      return cb();
    }

    console.log(keys);
    
    oraclesContract.createKeys.sendTransaction(
      "0x" + keys.miningKey.miningKeyObject.address, 
      "0x" + keys.payoutKey.payoutKeyObject.address, 
      "0x" + keys.votingKey.votingKeyObject.address,
      function(err, txHash) {
        if (err) {
          cb(txHash, err);
          return;
        }
        cb(txHash);
    });
  });

  /*var funcParamsNumber = 3;
  var standardLength = 32;

  var parameterLocation = standardLength*funcParamsNumber;

  SHA3Encrypt(web3, func, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);

    var data = funcEncodePart
    + toUnifiedLengthLeft(keys.miningKey.miningKeyObject.address)
    + toUnifiedLengthLeft(keys.payoutKey.payoutKeyObject.address)
    + toUnifiedLengthLeft(keys.votingKey.votingKeyObject.address);

    getGasPrice(function(gasPrice) {
      estimateGas(web3, address, contractAddr, data, null, function(estimatedGas) {
        estimatedGas += 100000;
        sendTx(web3, address, contractAddr, data, null, estimatedGas, gasPrice, function(txHash, err) {
          if (err) {
            cb(txHash, err);
            return;
          }
          cb(txHash);
        });
      });
    });
  });*/
}