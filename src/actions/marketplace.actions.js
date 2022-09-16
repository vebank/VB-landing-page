import { ethers, FixedNumber } from 'ethers';
import { marketplaceConstants } from '../constants';
import * as actions from './';

import ERC20ABI_PROTOCOL from '../_contracts/lend/AaveProtocolDataProvider.json';
import ERC20ABI_POOL from '../_contracts/lend/Pool.json';
import ERC20ABI_ISEER_ORACLE from '../_contracts/SeerOracle.json';
import ERCABI_REWARD from '../_contracts/lend/RewardsController.json';
import ERCABI_UIINCENTIVE from '../_contracts/lend/UiIncentiveDataProviderV3.json';

import { fixedBalanceEtherZero, truncate } from '../utils/lib';

// VET : dung de staking duy tri he thong
// VTH0 : dung de tra vi chay smart Contract

const TOKEN_AAVE = process.env.REACT_APP_ADDRESS_PROTOCOL;
const ADDRESS_POOL = process.env.REACT_APP_ADDRESS_POOL;
const ADDRESS_REWARD = process.env.REACT_APP_REWARD_CONTROLLER;

const ListKeyISeerOracle = {
    "VET": process.env.REACT_APP_ISO_VET,
    "VTHO": process.env.REACT_APP_ISO_VETHO,
    "VB": process.env.REACT_APP_ISO_VB,
    "VEUSD": process.env.REACT_APP_ISO_VEUSD
}

export const getMarketAssets = () => async (dispatch, getState) => {

    const state = getState();

    const { web3 } = state.web3;
    const { listAsset ,data} = state.assetsMarketReducer;

    let dataTotal = {
        totalSupply: 0,
        totalBorrow: 0
    }

    let dataList = [];

    if (web3 && TOKEN_AAVE && listAsset.length > 0) {

        let contractPROTOCOL = new web3.eth.Contract(ERC20ABI_PROTOCOL, TOKEN_AAVE);
        const contractPOOL = new web3.eth.Contract(ERC20ABI_POOL, ADDRESS_POOL);

        const RAY = 10**27; // 10 to the power 27
        const SECONDS_PER_YEAR = 31536000;
        let totalChange = 0;

        for await (const item of listAsset) {

            if(item.isLend){

                const getReserveDataPool = await contractPOOL.methods.getReserveData(item.assetsAddress).call();
                const getReserveData = await contractPROTOCOL.methods.getReserveData(item.assetsAddress).call();

                const {
                    variableBorrowRate,
                    stableBorrowRate,
                    liquidityRate
                } = getReserveData

                // Deposit and Borrow calculations
                // APY and APR are returned here as decimals, multiply by 100 to get the percents
                const depositAPR = liquidityRate.toString() / RAY;
                const variableBorrowAPR = variableBorrowRate.toString() / RAY;
                const stableBorrowAPR = stableBorrowRate.toString() / RAY;

                var depositAPY = ((1 + (depositAPR / SECONDS_PER_YEAR)) ** SECONDS_PER_YEAR) - 1;
                var variableBorrowAPY = ((1 + (variableBorrowAPR / SECONDS_PER_YEAR)) ** SECONDS_PER_YEAR) - 1;
                var stableBorrowAPY = ((1 + (stableBorrowAPR / SECONDS_PER_YEAR)) ** SECONDS_PER_YEAR) - 1;

                // console.table([
                //     ["assetsAddress",item.assetsAddress],
                //     ["depositAPR",depositAPR],
                //     ["variableBorrowAPR",variableBorrowAPR],
                //     ["stableBorrowAPR",stableBorrowAPR],
                //     ["depositAPY",depositAPY],
                //     ["variableBorrowAPY",variableBorrowAPY],
                //     ["stableBorrowAPY",stableBorrowAPY]
                // ]);

                let balanceSupply = 0;
                if (getReserveData.totalAToken) {
                    balanceSupply = ethers.utils.formatUnits(getReserveData.totalAToken, item.assetsDecimals);
                    dataTotal.totalSupply = dataTotal.totalSupply + Number(balanceSupply);
                }

                let balanceBorrow = 0;
                if (getReserveData.totalStableDebt || getReserveData.totalVariableDebt) {

                    // const totalStableDebt = ethers.utils.formatUnits(getReserveData.totalStableDebt || '0', item.assetsDecimals);
                    const totalVariableDebt = ethers.utils.formatUnits(getReserveData.totalVariableDebt || '0', item.assetsDecimals);
                    balanceBorrow = totalVariableDebt;
                    dataTotal.totalBorrow = dataTotal.totalBorrow + Number(balanceBorrow);

                }

                const totalDebtBase =  FixedNumber.from(getReserveData.totalStableDebt).addUnsafe(FixedNumber.from(getReserveData.totalVariableDebt)).toString();
                let totalUserCollateralPool = FixedNumber.from(getReserveData.totalAToken).subUnsafe(FixedNumber.from(totalDebtBase)).toString();
                
                // let totalUserCollateralPool = getReserveData.totalAToken - (getReserveData.totalStableDebt  + getReserveData.totalVariableDebt)
                totalUserCollateralPool = fixedBalanceEtherZero(totalUserCollateralPool).toLocaleString('fullwide', {useGrouping:false});
                totalUserCollateralPool = ethers.utils.formatUnits(totalUserCollateralPool, item.assetsDecimals);

                balanceSupply = balanceSupply.toLocaleString('fullwide', {useGrouping:false});

                dataList.push({
                    ...item,
                    aTokenAddress: getReserveDataPool.aTokenAddress,
                    stableDebtTokenAddress:getReserveDataPool.stableDebtTokenAddress,
                    variableDebtTokenAddress:getReserveDataPool.variableDebtTokenAddress,
                    totalAToken: getReserveData.totalAToken,
                    totalStableDebt: getReserveData.totalStableDebt ,
                    totalVariableDebt: getReserveData.totalVariableDebt,
                    totalSupplied: balanceSupply,
                    totalBorrowed: balanceBorrow,
                    supplyAPY: parseFloat((depositAPY * 100)),
                    borrowAPY: parseFloat((variableBorrowAPY * 100)),
                    depositAPY,
                    variableBorrowAPY,
                    totalUserCollateralPool,
                })

            }

        }

        dataTotal.totalBorrow = dataTotal.totalBorrow.toFixed(2);
        dataTotal.totalSupply = dataTotal.totalSupply.toFixed(2);

        dispatch({
            type: marketplaceConstants.FETCH_ASSETS_MARKET_SUCCESS,
            ...dataTotal,
            contractPROTOCOL,
            data: dataList
        });

       dispatch(actions.getIcentivesAssets(dataList));
   

    } else {
        dispatch({
            type: marketplaceConstants.FETCH_ASSETS_MARKET_SUCCESS,
            ...dataTotal,
            data:[]
        });
    }

    return dataList;

};

export const getCurrentAssets = () => async (dispatch, getState) => {

    const state = getState();

    const { web3 } = state.web3;
    const { listAsset } = state.assetsMarketReducer;

    let dataList = {};

    if (web3 && listAsset.length > 0) {

        for await (const item of listAsset) {

            if (ListKeyISeerOracle[item.assetsSymbol]) {

                let contractISeerOracle = new web3.eth.Contract(ERC20ABI_ISEER_ORACLE, ListKeyISeerOracle[item.assetsSymbol]);

                let currentPriceUSD = await contractISeerOracle.methods.latestAnswer().call();

                currentPriceUSD = ethers.utils.formatUnits(currentPriceUSD || '0', 18);;

                dataList[item.assetsAddress] = Number(currentPriceUSD);

            }

        }

        dispatch({
            type: marketplaceConstants.FETCH_ASSETS_PRICE_SUCCESS,
            data: dataList
        });

    }

    return dataList;

};

export const getAccountAssets = (dataAssets) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account } = state.web3;

    let dataList = [];

    if (web3 && account) {

        const contractPOOL = new web3.eth.Contract(ERC20ABI_POOL, ADDRESS_POOL);
        const contractPROTOCOL = new web3.eth.Contract(ERC20ABI_PROTOCOL, TOKEN_AAVE);

        if (contractPROTOCOL && account) {

            const accountData = await contractPOOL.methods.getUserAccountData(account).call();
            
            let availableBorrowsBase = ethers.utils.formatUnits(accountData.availableBorrowsBase || '0', 18);

            for await (const item of dataAssets) {

                const accountReserve = await contractPROTOCOL.methods.getUserReserveData(item.assetsAddress, account).call();

                let balanceSupply = 0;
                if (accountReserve.currentATokenBalance !== "0") {
                    balanceSupply = ethers.utils.formatUnits(accountReserve.currentATokenBalance, item.assetsDecimals);
                    balanceSupply = balanceSupply.toLocaleString('fullwide', {useGrouping:false});
                }

                let balanceBorrow = 0;
                let accountVariableDebt = 0;
                let accountStableDebt = 0;
               
                if (accountReserve.currentStableDebt || accountReserve.currentVariableDebt) {

                    const currentStableDebt = ethers.utils.formatUnits(accountReserve.currentStableDebt || '0', item.assetsDecimals);
                    accountStableDebt = Number(currentStableDebt);

                    const currentVariableDebt = ethers.utils.formatUnits(accountReserve.currentVariableDebt || '0', item.assetsDecimals);
                    accountVariableDebt = Number(currentVariableDebt);

                    balanceBorrow = accountVariableDebt + accountStableDebt;

                }
             
                if (balanceSupply || balanceBorrow) {
                  
                    dataList.push({
                        ...item,
                        totalSupplied: balanceSupply,
                        totalBorrowed: balanceBorrow,
                        accountStableDebt: accountStableDebt,
                        accountVariableDebt: accountVariableDebt,
                        availableBorrowsBase,
                    })
                  
                }

            }
            
            dispatch({
                type: marketplaceConstants.FETCH_ACCOUNT_ASSETS_SUCCESS,
                contractPROTOCOL,
                availableBorrowsBase,
                data: dataList
            });

        }

      

    } else {

        dispatch({
            type: marketplaceConstants.FETCH_ACCOUNT_ASSETS_SUCCESS,
            data: dataList
        });
    }

    return dataList;

};

export const getIcentivesAssets = (dataAssets) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account } = state.web3;
    const dataPrice = state.assetsPriceReducer.data;

    let dataList = [];
    if (web3  && ADDRESS_REWARD) {

        const SECONDS_PER_YEAR = 31536000;
        const contractPOOL = new web3.eth.Contract(ERC20ABI_POOL, ADDRESS_POOL);
        const contractIcentives = new web3.eth.Contract(ERCABI_REWARD, ADDRESS_REWARD);

        if (contractPOOL ) {

            for await (const item of dataAssets) {

                let incentiveDepositAPRPercent = 0;
                let incentiveBorrowAPRPercent = 0;

                // Get data
                const aEmissionPerSecond = await contractIcentives.methods.getRewardsData(item.aTokenAddress,process.env.REACT_APP_TOKEN_VEBANK).call();
              
                const vEmissionPerSecond = await contractIcentives.methods.getRewardsData(item.variableDebtTokenAddress,process.env.REACT_APP_TOKEN_VEBANK).call();

                // Incentives calculation
                const aEmissionPerYear = ethers.utils.formatUnits( (aEmissionPerSecond[1]),18) *SECONDS_PER_YEAR;
                const vEmissionPerYear = ethers.utils.formatUnits( (vEmissionPerSecond[1]),18) * SECONDS_PER_YEAR;

                const REWARD_PRICE_ETH = dataPrice[process.env.REACT_APP_TOKEN_VEBANK];

                if(Number(item.totalAToken)){
                    incentiveDepositAPRPercent = 100 * (
                        (aEmissionPerYear * REWARD_PRICE_ETH )/
                        (( ethers.utils.formatUnits(item.totalAToken, item.assetsDecimals)) *  dataPrice[item.assetsAddress] )
                    )
                }

                if(Number(item.totalVariableDebt) >0){
                    incentiveBorrowAPRPercent = 100 * (
                        (vEmissionPerYear * REWARD_PRICE_ETH)/
                        ((ethers.utils.formatUnits(item.totalVariableDebt, item.assetsDecimals)) * dataPrice[item.assetsAddress])
                    )
                }
            
                dataList.push({
                    ...item,
                    incentiveDepositAPRPercent,
                    incentiveBorrowAPRPercent
                })

            }

            dispatch({
                type: marketplaceConstants.FETCH_ICENTIVES_MARKET_SUCCESS,
                data: dataList
            });
        }

    } 

    return dataList;

};

export const getAccountOverview = () => async (dispatch, getState) => {

    const state = getState();

    const { web3, account } = state.web3;

    const dataPrice = state.assetsPriceReducer.data;
    const dataAccountAssets = state.accountAssetsReducer.data;
    const dataMarketAssets = state.assetsMarketReducer.data;

    let healthFactor = 0;
    let currentLiquidationThreshold = 0;
    let totalDebtBase = 0;
    let totalCollateralBase = 0;
    let accountTotalSupplied= 0;
    let accountTotalBorrowed= 0;
    let netAPY = 0;
    let dataList = [];

    let totalUserUnclaimedRewards =0;

    const contractPOOL = new web3.eth.Contract(ERC20ABI_POOL, ADDRESS_POOL);

    if (web3 && account && dataPrice && dataAccountAssets) {

        if ( account) {

            try {

                const accountPool = await contractPOOL.methods.getUserAccountData(account).call();
                if (accountPool && accountPool.healthFactor && accountPool.healthFactor.length < 27) {
                    healthFactor = ethers.utils.formatUnits(accountPool.healthFactor || '0', 18);
                }

                if(accountPool.totalCollateralBase){
                    totalCollateralBase = accountPool.totalCollateralBase;;
                }

                if(accountPool.totalDebtBase){
                    totalDebtBase = accountPool.totalDebtBase;;
                }

                if(accountPool.totalCollateralBase){
                    totalCollateralBase = accountPool.totalCollateralBase;;
                }

                if(accountPool.currentLiquidationThreshold){
                    currentLiquidationThreshold = accountPool.currentLiquidationThreshold;;
                }

            } catch (error) {
                console.log("error getAccountOverview:", error);
            }

            if(ADDRESS_REWARD){
                
                let dataAssets = [];

                dataMarketAssets.map((item) => {
                  dataAssets.push(item.aTokenAddress);
                  dataAssets.push(item.variableDebtTokenAddress);
                });

                const contractREWARD = new web3.eth.Contract(
                    ERCABI_REWARD,
                    ADDRESS_REWARD
                );

                try {

                    totalUserUnclaimedRewards = await contractREWARD.methods.getUserRewards(dataAssets, account,process.env.REACT_APP_TOKEN_VEBANK).call();
                
                    if (totalUserUnclaimedRewards) {
                        totalUserUnclaimedRewards = ethers.utils.formatUnits(totalUserUnclaimedRewards, 18 );
                        totalUserUnclaimedRewards = truncate(totalUserUnclaimedRewards,4)
                    }
    
                } catch (error) {
                    console.log("error getAccountOverview:", error);
                }
    
            }

            let supplyAPYChange = 0;
            let borrowAPYChange = 0;

            for await (const item of dataAccountAssets) {

                if(item.totalSupplied){
                    supplyAPYChange =  ((dataPrice[item.assetsAddress] * item.totalSupplied) * item.depositAPY) +supplyAPYChange;
                    accountTotalSupplied = (dataPrice[item.assetsAddress] * item.totalSupplied) + accountTotalSupplied;
                }

                if(item.totalBorrowed){
                    borrowAPYChange =  ((dataPrice[item.assetsAddress] * item.totalBorrowed) * item.variableBorrowAPY) +borrowAPYChange;
                    accountTotalBorrowed = (dataPrice[item.assetsAddress] * item.totalBorrowed) + accountTotalBorrowed;
                }
                
            }

            netAPY =( (supplyAPYChange - borrowAPYChange) / accountTotalSupplied)*100;

        }

        dispatch({
            type: marketplaceConstants.FETCH_ACCOUNT_OVERVIEW_SUCCESS,
            data: {
                contractPOOL,
                accountTotalSupplied,
                accountTotalBorrowed,
                totalUserUnclaimedRewards,
                healthFactor,
                totalCollateralBase,
                totalDebtBase,
                currentLiquidationThreshold,
                netAPY
            }
        });

    } else {

        dispatch({
            type: marketplaceConstants.FETCH_ACCOUNT_OVERVIEW_SUCCESS,
            contractPOOL,
            healthFactor
        });
    }

    return dataList;

};

//amount_debt:borrow_amount or repay_amount
//amount_collaterral:supply_amount or withdraw_amount
export const newHealthFactor = (assetsAddress, amount_debt, amount_collaterral, asset_threshold) => async (dispatch, getState) => {

    const state = getState();
    const { web3, account } = state.web3;
    const dataPrice = state.assetsPriceReducer.data;

    const { contractPOOL } = state.accountOverviewReducer;

    if (web3 && account && asset_threshold) {

        const accountPool = await contractPOOL.methods.getUserAccountData(account).call();

        const {    
            healthFactor,
            totalCollateralBase,
            totalDebtBase,
            currentLiquidationThreshold
        } = accountPool;

        let newHF = healthFactor;

        if(amount_debt){
            amount_debt = amount_debt * dataPrice[assetsAddress];
            amount_debt= web3.utils.toWei(amount_debt.toString())

            newHF = (totalCollateralBase * (Number(currentLiquidationThreshold)/10000) )/ (Number(totalDebtBase) + Number(amount_debt));

        }
    
        if(amount_collaterral){

            amount_collaterral = amount_collaterral * dataPrice[assetsAddress];
            amount_collaterral = web3.utils.toWei(amount_collaterral.toString());

            // New_avgThreshold = (totalCollateralBase * currentLiquidationThreshold + amount_collaterral * asset_threshold) / (totalCollateralBase + amount_collaterral)
            let new_avgThreshold = ((totalCollateralBase * (currentLiquidationThreshold/10000)) + (amount_collaterral * (Number(asset_threshold)/10000))) / (totalCollateralBase + amount_collaterral)

            // New_HF = (totalCollateralBase + amount_collaterral) * New_avgThreshold / (totalDebtBase + amount_debt)
            newHF = (Number(totalCollateralBase) + Number(amount_collaterral)) * new_avgThreshold / (Number(totalDebtBase) + Number(amount_debt));
            
        }

        return  newHF.toLocaleString('fullwide', {useGrouping:false});

    }

    return "...";

};

export const listenEventPool = () => async (dispatch, getState) => {

    const state = getState();

    const { web3, account } = state.web3;

    let dataAssets = state.assetsMarketReducer.data;

    if (web3 && account && dataAssets) {

        const contractPOOL = new web3.eth.Contract(ERC20ABI_POOL, ADDRESS_POOL);

        if (contractPOOL && account) {

            let  _poolTransferEvent = contractPOOL.events.allEvents?.();
            _poolTransferEvent.on("data", async (data) => {

                if(data.signature){
                    
                    let dataListNew = [];
                    if(data.event=== "ReserveDataUpdated" ){
                        dataListNew = await dispatch(actions.getMarketAssets());
                    }

                    if(dataListNew.length > 0){
                        dataAssets= dataListNew;
                    }

                    if(data.event=== "Repay" || data.event=== "Withdraw" || data.event=== "Supply" || data.event=== "Borrow" ){
                        await dispatch(actions.getAccountAssets(dataAssets));
                        await dispatch(actions.getAccountOverview());
                    }

                }
                   
            })


        }

     
    } 

};

export const reloadAccountAssets = () => async (dispatch, getState) => {

    const state = getState();

    const { web3, account } = state.web3;

    if (web3 && account) {

        // setTimeout(async () => {
        //     await dispatch(getAccountAssets());
        //     await dispatch(getMarketAssets());
        // }, 3000);

        // setTimeout(async () => {
        //     await dispatch(getAccountAssets());
        //     await dispatch(getMarketAssets());
        // }, 6000);

    }

};
