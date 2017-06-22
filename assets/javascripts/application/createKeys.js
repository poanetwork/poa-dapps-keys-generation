function createKeys(web3, func, keys, address, contractAddr, cb) {
  var funcParamsNumber = 3;
  var standardLength = 32;

  var parameterLocation = standardLength*funcParamsNumber;

  SHA3Encrypt(web3, func, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);

    var data = funcEncodePart
    + toUnifiedLengthLeft(keys.miningKey.miningKeyObject.address)
    + toUnifiedLengthLeft(keys.payoutKey.payoutKeyObject.address)
    + toUnifiedLengthLeft(keys.votingKey.votingKeyObject.address);

    estimateGas(web3, address, contractAddr, data, null, function(estimatedGas) {
      estimatedGas += 100000;
      sendTx(web3, address, contractAddr, data, null, estimatedGas, function(txHash, err) {
        if (err) {
          cb(txHash, err);
          return;
        }
        cb(txHash);
      });
    });
  });
}