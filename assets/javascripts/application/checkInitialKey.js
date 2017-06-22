function checkInitialKey(web3, func, initialKey, contractAddr, cb) {
  var funcParamsNumber = 1;
  var standardLength = 32;

  SHA3Encrypt(web3, func, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);

    var data = funcEncodePart
    + toUnifiedLengthLeft(initialKey);

    call(web3, "0x" + initialKey, contractAddr, data, function(respHex) {
      console.log(respHex);
      cb(parseInt(respHex, 16));
    });
  });
}