import { messages } from "./messages";
import swal from 'sweetalert';
import helpers from "./helpers";
// const local = {
//    "KEYS_MANAGER_ADDRESS": "0x3ef32bb244016ad9af8c8f45398511e7e551b581"   
//}

let SOKOL_ADDRESSES = {};
let CORE_ADDRESSES = {};

function getContractsAddresses(branch) {
    let addr = helpers.addressesURL(branch);
    fetch(helpers.addressesURL(branch)).then(function(response) { 
        return response.json();
    }).then(function(contracts) {
        switch (branch) {
            case 'core':
                CORE_ADDRESSES = contracts;
                break;
            case 'sokol':
                SOKOL_ADDRESSES = contracts;
                break;
            default:
                CORE_ADDRESSES = contracts;
                break;
        }
    }).catch(function(err) {
        helpers.wrongRepoAlert(addr);
    });
}

getContractsAddresses('core');
getContractsAddresses('sokol');

export default (netId) => {
    switch (netId) {
        case '77':
            return SOKOL_ADDRESSES
        case '99':
            return CORE_ADDRESSES
        default:
            return CORE_ADDRESSES
    }
}
