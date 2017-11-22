function generateAddress(cb) {
  var params = { keyBytes: 32, ivBytes: 16 };

  var dk = keythereum.create(params);

  keythereum.create(params, function (dk) {
    var options = {};
    var password = generatePassword();
    keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options, function (keyObject) {
      console.log(keyObject);
      console.log(JSON.stringify(keyObject));
      cb(keyObject, password);
    });
  });
}

function generatePassword() {
  return passwordGenerator(20, false);
}