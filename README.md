# POA Network Ceremony Dapp

## Supported browsers

* Google Chrome v 59.0.3071.115+

## MetaMask plugin setup

* Connect to POA Network in MetaMask plugin (See [Connect to POA Network via MetaMask](https://github.com/oraclesorg/oracles-wiki/blob/master/MetaMask-connect.md#connect-to-oracles-network-via-metamask))

* Import your initial key to MetaMask Plugin: browse keystore file, received from invitation, and enter password for the key (See [Importing of keys from wiki](https://github.com/oraclesorg/oracles-wiki/blob/master/MetaMask-connect.md#importing-of-keys)).

## Ceremony Dapp lifecycle

Check [Ceremony Dapp section from wiki](https://github.com/oraclesorg/oracles-wiki/blob/master/ceremony.md)

## Initial page
![](./docs/index.png)

## Results page
![](./docs/results.png)

## Configuration file
It is configured with [Oracles network contract](https://github.com/oraclesorg/oracles-contract)

Path: `./assets/javascripts/config.json`

```
{
  "environment": "live",
  "Ethereum": {
    "live": {
      "contractAddress": "POA_Network_Consensus_contract_address"
    }
  }
}
```

## Building from source

1) `npm i`

2) `npm start`
