import JSBI from "jsbi";
import {ChainId} from "../constants";
import {Token} from "../blockchain/Token";
import { Percent } from "../blockchain/fractions";

export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));

export const ROUTER_ADDRESS = process.env.REACT_APP_ADDRESS_ROUTER;

export const DUMMY_VET = {
    1: new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000000', 18, 'VET', 'Vechain'),
    3: new Token(ChainId.TESTNET, '0x0000000000000000000000000000000000000000', 18, 'VET', 'Vechain')
}

export const INPUT_TYPE = {
    INPUT: "INPUT",
    OUTPUT: "OUTPUT",
}