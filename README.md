# POA Network Ceremony Dapp

Deployed versions:

For Core (production) network use: https://core-ceremony.poa.network/
For Sokol (test) network use: https://sokol-ceremony.poa.network

## Supported browsers

* Google Chrome v 59.0.3071.115+

## MetaMask plugin setup

* Connect to POA Network in MetaMask plugin (See [Connect to POA Network via MetaMask](https://github.com/poanetwork/wiki/blob/master/MetaMask-connect.md#connect-to-poa-network-via-metamask))

* Import your initial key to MetaMask Plugin: browse keystore file, received from invitation, and enter password for the key (See [Importing of keys from wiki](https://github.com/poanetwork/wiki/blob/master/MetaMask-connect.md#importing-of-keys)).

## Ceremony Dapp lifecycle

Check [Ceremony Dapp section from wiki](https://github.com/poanetwork/wiki/blob/master/ceremony.md)

## Initial page
![](./docs/index.png)

## Results page
![](./docs/results.png)

## Configuration file
It is configured with [POA Network contract](https://github.com/poanetwork/poa-network-consensus-contracts)

Path: [`./src/addresses.js`](./src/addresses.js)

```
module.exports = {
  KEYS_MANAGER_ADDRESS: '0xfc90125492e58dbfe80c0bfb6a2a759c4f703ca8'
}
```

## Building from source

1) `npm i`

2) `npm start`
