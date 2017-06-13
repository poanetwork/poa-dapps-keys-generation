function checkInitialKey(api, config, func, initialKey, contractAddr, cb) {
  var funcHex = func.hexEncode();
  var funcParamsNumber = 1;
  var standardLength = 32;

  SHA3Encrypt(api, funcHex, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);

    var data = funcEncodePart
    + toUnifiedLengthLeft(initialKey);

    call(api, "0x" + initialKey, contractAddr, data, function(respHex) {
      console.log(respHex);
      cb(parseInt(respHex, 16));
    });
  });
}