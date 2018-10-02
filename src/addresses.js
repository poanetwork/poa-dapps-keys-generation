import { constants } from "./constants";
import helpers from "./helpers";
//const local = {
//    "KEYS_MANAGER_ADDRESS": "0x3ef32bb244016ad9af8c8f45398511e7e551b581"   
//}

export default (web3Config) => {
    let branch;
    
    switch (web3Config.netId) {
        case constants.NETID_DAI_TEST:
            branch = "dai-test";
            break;
        case constants.NETID_SOKOL:
            branch = "sokol";
            break;
        case constants.NETID_DAI:
            branch = "dai";
            break;
        case constants.NETID_CORE:
        default:
            branch = "core";
            break;
    }
    return new Promise((resolve, reject) => {
        fetch(helpers.addressesURL(branch)).then((response) => { 
            response.json().then((json) => {
                resolve({addresses: json, web3Config});
            })
        }).catch(function(err) {
            let addr = helpers.addressesURL(branch);
            helpers.wrongRepoAlert(addr);
            reject(err);
        });
    })
}
