import keythereum from 'keythereum'
import passwordGenerator from 'password-generator'

export default function generateAddress(cb) {
  return new Promise((resolve, reject) => {
    var params = { keyBytes: 32, ivBytes: 16 }

    keythereum.create(params, function(dk) {
      var options = {}
      var password = passwordGenerator(20, false)
      keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options, function(jsonStore) {
        resolve({ jsonStore, password })
      })
    })
  })
}
