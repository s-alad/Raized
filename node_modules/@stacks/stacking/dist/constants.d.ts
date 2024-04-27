export declare enum PoXAddressVersion {
    P2PKH = 0,
    P2SH = 1,
    P2SHP2WPKH = 2,
    P2SHP2WSH = 3,
    P2WPKH = 4,
    P2WSH = 5,
    P2TR = 6
}
export declare const BitcoinNetworkVersion: {
    readonly mainnet: {
        readonly P2PKH: 0;
        readonly P2SH: 5;
    };
    readonly testnet: {
        readonly P2PKH: 111;
        readonly P2SH: 196;
    };
    readonly devnet: {
        readonly P2PKH: 111;
        readonly P2SH: 196;
    };
    readonly mocknet: {
        readonly P2PKH: 111;
        readonly P2SH: 196;
    };
};
export declare const B58_ADDR_PREFIXES: RegExp;
export declare const SEGWIT_V0_ADDR_PREFIX: RegExp;
export declare const SEGWIT_V1_ADDR_PREFIX: RegExp;
export declare const SegwitPrefix: {
    readonly mainnet: "bc";
    readonly testnet: "tb";
    readonly devnet: "bcrt";
    readonly mocknet: "bcrt";
};
export declare const SEGWIT_ADDR_PREFIXES: RegExp;
export declare const SEGWIT_V0 = 0;
export declare const SEGWIT_V1 = 1;
export declare enum PoxOperationPeriod {
    Period1 = "Period1",
    Period2a = "Period2a",
    Period2b = "Period2b",
    Period3 = "Period3"
}
export declare enum StackingErrors {
    ERR_STACKING_UNREACHABLE = 255,
    ERR_STACKING_CORRUPTED_STATE = 254,
    ERR_STACKING_INSUFFICIENT_FUNDS = 1,
    ERR_STACKING_INVALID_LOCK_PERIOD = 2,
    ERR_STACKING_ALREADY_STACKED = 3,
    ERR_STACKING_NO_SUCH_PRINCIPAL = 4,
    ERR_STACKING_EXPIRED = 5,
    ERR_STACKING_STX_LOCKED = 6,
    ERR_STACKING_PERMISSION_DENIED = 9,
    ERR_STACKING_THRESHOLD_NOT_MET = 11,
    ERR_STACKING_POX_ADDRESS_IN_USE = 12,
    ERR_STACKING_INVALID_POX_ADDRESS = 13,
    ERR_STACKING_ALREADY_REJECTED = 17,
    ERR_STACKING_INVALID_AMOUNT = 18,
    ERR_NOT_ALLOWED = 19,
    ERR_STACKING_ALREADY_DELEGATED = 20,
    ERR_DELEGATION_EXPIRES_DURING_LOCK = 21,
    ERR_DELEGATION_TOO_MUCH_LOCKED = 22,
    ERR_DELEGATION_POX_ADDR_REQUIRED = 23,
    ERR_INVALID_START_BURN_HEIGHT = 24,
    ERR_NOT_CURRENT_STACKER = 25,
    ERR_STACK_EXTEND_NOT_LOCKED = 26,
    ERR_STACK_INCREASE_NOT_LOCKED = 27,
    ERR_DELEGATION_NO_REWARD_SLOT = 28,
    ERR_DELEGATION_WRONG_REWARD_SLOT = 29,
    ERR_STACKING_IS_DELEGATED = 30,
    ERR_STACKING_NOT_DELEGATED = 31
}
