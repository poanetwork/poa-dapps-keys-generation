# Oracles network Initial Key Distribution Dapp

## Supported browsers

Google Chrome v 59.0.3071.115+

Import your initial key to Oracles Chrome Plugin: browse keystore file, received from invitation, and enter password for the key (See [Importing of keys](https://github.com/oraclesorg/oracles-wiki#importing-of-keys)).

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
