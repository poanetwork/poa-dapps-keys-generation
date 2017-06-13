function generateAddress(cb) {
  var params = { keyBytes: 32, ivBytes: 16 };

  // synchronous
  var dk = keythereum.create(params);
  // dk:
  /*{
      privateKey: <Buffer ...>,
      iv: <Buffer ...>,
      salt: <Buffer ...>
  }*/

  // asynchronous
  keythereum.create(params, function (dk) {
    var options = {};
    var password = generatePassword();
    keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options, function (keyObject) {
      console.log(keyObject);
      console.log(JSON.stringify(keyObject));
      //keythereum.exportToFile(keyObject);
      cb(keyObject, password);
    });
  });
}

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}