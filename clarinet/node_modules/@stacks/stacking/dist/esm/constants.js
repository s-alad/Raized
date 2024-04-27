export var PoXAddressVersion;
(function (PoXAddressVersion) {
    PoXAddressVersion[PoXAddressVersion["P2PKH"] = 0] = "P2PKH";
    PoXAddressVersion[PoXAddressVersion["P2SH"] = 1] = "P2SH";
    PoXAddressVersion[PoXAddressVersion["P2SHP2WPKH"] = 2] = "P2SHP2WPKH";
    PoXAddressVersion[PoXAddressVersion["P2SHP2WSH"] = 3] = "P2SHP2WSH";
    PoXAddressVersion[PoXAddressVersion["P2WPKH"] = 4] = "P2WPKH";
    PoXAddressVersion[PoXAddressVersion["P2WSH"] = 5] = "P2WSH";
    PoXAddressVersion[PoXAddressVersion["P2TR"] = 6] = "P2TR";
})(PoXAddressVersion || (PoXAddressVersion = {}));
export const BitcoinNetworkVersion = {
    mainnet: {
        P2PKH: 0x00,
        P2SH: 0x05,
    },
    testnet: {
        P2PKH: 0x6f,
        P2SH: 0xc4,
    },
    devnet: {
        P2PKH: 0x6f,
        P2SH: 0xc4,
    },
    mocknet: {
        P2PKH: 0x6f,
        P2SH: 0xc4,
    },
};
export const B58_ADDR_PREFIXES = /^(1|3|m|n|2)/;
export const SEGWIT_V0_ADDR_PREFIX = /^(bc1q|tb1q|bcrt1q)/i;
export const SEGWIT_V1_ADDR_PREFIX = /^(bc1p|tb1p|bcrt1p)/i;
export const SegwitPrefix = {
    mainnet: 'bc',
    testnet: 'tb',
    devnet: 'bcrt',
    mocknet: 'bcrt',
};
export const SEGWIT_ADDR_PREFIXES = /^(bc|tb)/i;
export const SEGWIT_V0 = 0;
export const SEGWIT_V1 = 1;
export var PoxOperationPeriod;
(function (PoxOperationPeriod) {
    PoxOperationPeriod["Period1"] = "Period1";
    PoxOperationPeriod["Period2a"] = "Period2a";
    PoxOperationPeriod["Period2b"] = "Period2b";
    PoxOperationPeriod["Period3"] = "Period3";
})(PoxOperationPeriod || (PoxOperationPeriod = {}));
export var StackingErrors;
(function (StackingErrors) {
    StackingErrors[StackingErrors["ERR_STACKING_UNREACHABLE"] = 255] = "ERR_STACKING_UNREACHABLE";
    StackingErrors[StackingErrors["ERR_STACKING_CORRUPTED_STATE"] = 254] = "ERR_STACKING_CORRUPTED_STATE";
    StackingErrors[StackingErrors["ERR_STACKING_INSUFFICIENT_FUNDS"] = 1] = "ERR_STACKING_INSUFFICIENT_FUNDS";
    StackingErrors[StackingErrors["ERR_STACKING_INVALID_LOCK_PERIOD"] = 2] = "ERR_STACKING_INVALID_LOCK_PERIOD";
    StackingErrors[StackingErrors["ERR_STACKING_ALREADY_STACKED"] = 3] = "ERR_STACKING_ALREADY_STACKED";
    StackingErrors[StackingErrors["ERR_STACKING_NO_SUCH_PRINCIPAL"] = 4] = "ERR_STACKING_NO_SUCH_PRINCIPAL";
    StackingErrors[StackingErrors["ERR_STACKING_EXPIRED"] = 5] = "ERR_STACKING_EXPIRED";
    StackingErrors[StackingErrors["ERR_STACKING_STX_LOCKED"] = 6] = "ERR_STACKING_STX_LOCKED";
    StackingErrors[StackingErrors["ERR_STACKING_PERMISSION_DENIED"] = 9] = "ERR_STACKING_PERMISSION_DENIED";
    StackingErrors[StackingErrors["ERR_STACKING_THRESHOLD_NOT_MET"] = 11] = "ERR_STACKING_THRESHOLD_NOT_MET";
    StackingErrors[StackingErrors["ERR_STACKING_POX_ADDRESS_IN_USE"] = 12] = "ERR_STACKING_POX_ADDRESS_IN_USE";
    StackingErrors[StackingErrors["ERR_STACKING_INVALID_POX_ADDRESS"] = 13] = "ERR_STACKING_INVALID_POX_ADDRESS";
    StackingErrors[StackingErrors["ERR_STACKING_ALREADY_REJECTED"] = 17] = "ERR_STACKING_ALREADY_REJECTED";
    StackingErrors[StackingErrors["ERR_STACKING_INVALID_AMOUNT"] = 18] = "ERR_STACKING_INVALID_AMOUNT";
    StackingErrors[StackingErrors["ERR_NOT_ALLOWED"] = 19] = "ERR_NOT_ALLOWED";
    StackingErrors[StackingErrors["ERR_STACKING_ALREADY_DELEGATED"] = 20] = "ERR_STACKING_ALREADY_DELEGATED";
    StackingErrors[StackingErrors["ERR_DELEGATION_EXPIRES_DURING_LOCK"] = 21] = "ERR_DELEGATION_EXPIRES_DURING_LOCK";
    StackingErrors[StackingErrors["ERR_DELEGATION_TOO_MUCH_LOCKED"] = 22] = "ERR_DELEGATION_TOO_MUCH_LOCKED";
    StackingErrors[StackingErrors["ERR_DELEGATION_POX_ADDR_REQUIRED"] = 23] = "ERR_DELEGATION_POX_ADDR_REQUIRED";
    StackingErrors[StackingErrors["ERR_INVALID_START_BURN_HEIGHT"] = 24] = "ERR_INVALID_START_BURN_HEIGHT";
    StackingErrors[StackingErrors["ERR_NOT_CURRENT_STACKER"] = 25] = "ERR_NOT_CURRENT_STACKER";
    StackingErrors[StackingErrors["ERR_STACK_EXTEND_NOT_LOCKED"] = 26] = "ERR_STACK_EXTEND_NOT_LOCKED";
    StackingErrors[StackingErrors["ERR_STACK_INCREASE_NOT_LOCKED"] = 27] = "ERR_STACK_INCREASE_NOT_LOCKED";
    StackingErrors[StackingErrors["ERR_DELEGATION_NO_REWARD_SLOT"] = 28] = "ERR_DELEGATION_NO_REWARD_SLOT";
    StackingErrors[StackingErrors["ERR_DELEGATION_WRONG_REWARD_SLOT"] = 29] = "ERR_DELEGATION_WRONG_REWARD_SLOT";
    StackingErrors[StackingErrors["ERR_STACKING_IS_DELEGATED"] = 30] = "ERR_STACKING_IS_DELEGATED";
    StackingErrors[StackingErrors["ERR_STACKING_NOT_DELEGATED"] = 31] = "ERR_STACKING_NOT_DELEGATED";
})(StackingErrors || (StackingErrors = {}));
//# sourceMappingURL=constants.js.map