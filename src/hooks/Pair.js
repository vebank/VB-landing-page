import {useEffect, useRef, useMemo, useState} from 'react'
import {getLibrary} from "./TokensHook";
import {Fetcher} from "../blockchain/Fetcher";
import {find} from "lodash";
import {IVEBANKV1PAIR_ABI} from "../abis/IVeBankV1Pair";
import useSWR from 'swr'
import {Pair} from "../blockchain/Pair";

export const SWRKeys = {
    Allowances: 'allowances',
    Reserves: 'reserves',
    TotalSupply: 'totalSupply',
    V1PairAddress: 'v1PairAddress',
    TokenAddress: 'tokenAddress',
}

export function useKeepSWRDataLiveAsBlocksArrive(mutate) {
    const [blockNumber, setBlockNumber] = useState(null)
    const connex = getLibrary()
    // because we don't care about the referential identity of mutate, just bind it to a ref
    const mutateRef = useRef(mutate)
    useEffect(() => {
        mutateRef.current = mutate
    }, [connex])

    useEffect( () => {
        async function fetchBlockNumber() {
            if (connex) {
                const { number: bn } = await connex.thor.ticker().next()
                setBlockNumber(bn)
            }
        }
        fetchBlockNumber()
    }, [connex])

    // then, whenever a new block arrives, trigger a mutation
    useEffect(() => {
        mutateRef.current()
    }, [blockNumber, connex])
}

export function useContract(address) {
    const connex = getLibrary()
    const abi = find(IVEBANKV1PAIR_ABI.abi, { name: 'getReserves' })

    return useMemo(() => {
        try {
            return connex.thor.account(address).method(abi)
        } catch {
            return null
        }
    }, [address, abi, connex.thor])
}

function getPair(tokenA, tokenB) {
    const connex = getLibrary()

    return async () => {
        try {
            return await Fetcher.fetchPairData(tokenA, tokenB, connex)
        } catch {
            return null
        }
    }
}

export function usePair(tokenA, tokenB) {
    const pairAddress = !!tokenA && !!tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
    const method = useContract(pairAddress)

    const shouldFetch = !!method

    const { data, mutate } = useSWR(
        shouldFetch ? [pairAddress, tokenA.chainId, SWRKeys.Reserves] : null,
        getPair(tokenA, tokenB)
    )

    // useKeepSWRDataLiveAsBlocksArrive(mutate)

    return data
}