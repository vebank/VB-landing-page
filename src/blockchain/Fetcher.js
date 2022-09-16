import JSBI from "jsbi"
import { find } from 'lodash'
import { TokenAmount } from './fractions'
import { Pair } from './Pair'
import invariant from 'tiny-invariant'
import { ERC20_ABI } from '../abis/ERC20'
import { IVEBANKV1PAIR_ABI } from '../abis/IVeBankV1Pair'
import { ChainId } from '../constants'
import { Token } from './Token'

let TOKEN_DECIMALS_CACHE = {
    [ChainId.MAINNET]: {
        '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A': 9 // DGD
    }
}

/**
 * Contains methods for constructing instances of pairs and tokens from on-chain data.
 */
export class Fetcher {
    /**
     * Cannot be constructed.
     */
    constructor() {}

    /**
     * Fetch information for a given token on the given chain, using the given ethers provider.
     * @param chainId chain of the token
     * @param address address of the token on the chain
     * @param connex optional name of the token
     * @param symbol optional symbol of the token
     * @param name optional name of the token
     */
    static async fetchTokenData(
        chainId,
        address,
        connex,
        symbol,
        name,
    ) {     // return Promise<Token>
        const abi = find(ERC20_ABI, { name: 'decimals' })
        const method = connex.thor.account(address).method(abi)

        const parsedDecimals =
            typeof TOKEN_DECIMALS_CACHE?.[chainId]?.[address] === 'number'
                ? TOKEN_DECIMALS_CACHE[chainId][address]
                : await method.call().then(({ decoded }) => Number(decoded[0])).then((decimals) => {
                    TOKEN_DECIMALS_CACHE = {
                        ...TOKEN_DECIMALS_CACHE,
                        [chainId]: {
                            ...TOKEN_DECIMALS_CACHE?.[chainId],
                            [address]: decimals
                        }
                    }
                    return decimals

                })
        return new Token(chainId, address, parsedDecimals, symbol, name)
    }

    /**
     * Fetches information about a pair and constructs a pair from the given two tokens.
     * @param tokenA first token
     * @param tokenB second token
     * @param connex the provider to use to fetch the data
     */
    static async fetchPairData(
        tokenA,
        tokenB,
        connex
    ) {    // return Promise<Pair>
        invariant(tokenA.chainId === tokenB.chainId, 'CHAIN_ID')
        const pairAddress = Pair.getAddress(tokenA, tokenB)

        const getReservesABI = find(IVEBANKV1PAIR_ABI.abi, { name: 'getReserves' });
        const getReservesMethod = connex.thor.account(pairAddress).method(getReservesABI);

        const reserves = (await getReservesMethod.call()).decoded;
        const { _reserve0, _reserve1 } = reserves
        const balances = tokenA.sortsBefore(tokenB) ? [_reserve0, _reserve1] : [_reserve1, _reserve0]
        const swapFee = JSBI.BigInt(3)

        return new Pair(new TokenAmount(tokenA, balances[0]),
            new TokenAmount(tokenB, balances[1]),
            swapFee)
    }
}
