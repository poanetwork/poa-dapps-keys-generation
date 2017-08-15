# Oracles network Ceremony Dapp

## Supported browsers

* Google Chrome v 59.0.3071.115+

## MetaMask plugin setup

* Connect to Oracles network in MetaMask plugin (See [Connect to Oracles network via MetaMask](https://github.com/oraclesorg/oracles-wiki/blob/master/MetaMask-connect.md#connect-to-oracles-network-via-metamask))

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
      "contractAddress": "Oracles_contract_address"
    }
  }
}
```

## Building from source

1) `npm install`

2) `npm run sass`

3) `npm run coffee`

4) `npm start`
