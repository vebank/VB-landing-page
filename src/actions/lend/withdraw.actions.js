
import { ethers, FixedNumber } from 'ethers';
import { marketplaceConstants } from '../../constants';

import ERC20ABI_PROTOCOL from '../../_contracts/lend/AaveProtocolDataProvider.json';
import ERC20ABI_WETH_GETAWAY from '../../_contracts/lend/WETHGateway.json';
import ERC20ABI_POOL from '../../_contracts/lend/Pool.json';
import ABI_ATOKEN from '../../_contracts/lend/AToken.json';

import { fixedBalanceEtherZero, formatLocaleString, numberWithCommas, randomKeyUUID } from '../../utils/lib';
import * as actions from '../.';

const ADDRESS_GATEWAY = process.env.REACT_APP_ADDRESS_GATEWAY; // WETHGateway (chinh là VET Asset)
const ADDRESS_POOL = process.env.REACT_APP_ADDRESS_POOL;
const TOKEN_AAVE = process.env.REACT_APP_ADDRESS_PROTOCOL;

const amountMaxApprove = 9999999999;

// ------------------------ WITHDRAW ------------------------ //
/**
 * 
 * @param {*} dataToken 
 * @returns dispatch strore
 * 
 */
export const loadModalWithdraw = (dataToken) => async (dispatch, getState) => {

    const state = getState();
    const { web3, account } = state.web3;
    const dataPrice = state.assetsPriceReducer.data;

    let accountBalance = 0;
    let accountApprove = 0;
    let totalUserCollateralPool =0;
    let assetThreshold = 0;

    if (!account) {
        return;
    }

    dispatch({
        type: marketplaceConstants.MODAL_OPEN_WITHDRAW_MARKET,
        loading:true,
        accountApprove,
        accountBalance: accountBalance,
        dataToken
    });

    if (dataToken.assetsAddress) {

        let contractPROTOCOL = new web3.eth.Contract(ERC20ABI_PROTOCOL, TOKEN_AAVE);
        
        const accountReserve = await contractPROTOCOL.methods.getUserReserveData(dataToken.assetsAddress, account).call();

        const getReserveData = await contractPROTOCOL.methods.getReserveData(dataToken.assetsAddress).call();
                  
        const reserveConfig = await contractPROTOCOL.methods.getReserveConfigurationData(dataToken.assetsAddress).call();

        if(reserveConfig.liquidationThreshold){
            assetThreshold = reserveConfig.liquidationThreshold;
        }
        
        if(Number(getReserveData.totalAToken) > 0){

            const totalDebtBase =  FixedNumber.from(getReserveData.totalStableDebt).addUnsafe( FixedNumber.from(getReserveData.totalVariableDebt)).toString();
            totalUserCollateralPool = FixedNumber.from(getReserveData.totalAToken).subUnsafe(FixedNumber.from(totalDebtBase)).toUnsafeFloat();
            
            //totalUserCollateralPool = getReserveData.totalAToken - (getReserveData.totalStableDebt  + getReserveData.totalVariableDebt)
            totalUserCollateralPool = fixedBalanceEtherZero(totalUserCollateralPool).toLocaleString('fullwide', {useGrouping:false});
            totalUserCollateralPool = ethers.utils.formatUnits(totalUserCollateralPool, dataToken.assetsDecimals);

        }

        const contractPOOL = new web3.eth.Contract(ERC20ABI_POOL, ADDRESS_POOL);
        const accountData = await contractPOOL.methods.getUserAccountData(account).call();
        
        // get balance A Token your account withdrawal is allowed
        if (Number(accountReserve.currentATokenBalance && Number(totalUserCollateralPool) > 0)) {
            accountBalance = ethers.utils.formatUnits(accountReserve.currentATokenBalance, dataToken.assetsDecimals);
            
            if(accountData && accountData.availableBorrowsBase){

                // totalUserCollateralPool : Tổng số lượng amount mà pool đang có thể withdraw
                // totalUserWithdraw : Tổng số lượng amount mà user có thể withdraw

                const extotalDebtBase = FixedNumber.from(accountData.totalDebtBase).divUnsafe(FixedNumber.from(accountData.ltv)).divUnsafe(FixedNumber.from("10000")).toString();
                let availableWithdraw = FixedNumber.from(accountData.totalCollateralBase).subUnsafe(FixedNumber.from(extotalDebtBase)).toUnsafeFloat();
              
                // let availableWithdraw = accountData.totalCollateralBase - (accountData.totalDebtBase /(accountData.ltv/10000));
                availableWithdraw = availableWithdraw.toLocaleString('fullwide', {useGrouping:false});
                availableWithdraw= ethers.utils.formatEther(availableWithdraw)

                 // availableWithdraw = ethers.utils.formatEther(availableWithdraw) / dataPrice[dataToken.assetsAddress];
                availableWithdraw = FixedNumber.from(availableWithdraw).divUnsafe(FixedNumber.from(dataPrice[dataToken.assetsAddress].toString())).toString();
               

                // console.log("currentATokenBalance", accountBalance); 
                // console.log("Available to withdraw", availableWithdraw); 
                // console.log("totalUserCollateralPool", totalUserCollateralPool);

                if(Number(accountBalance) >Number(availableWithdraw)){
                    accountBalance = availableWithdraw;
                }

                if(Number(accountBalance) > Number(totalUserCollateralPool) ){
                    accountBalance = totalUserCollateralPool;
                }

                if(accountBalance <0 ){
                    accountBalance = 0;
                }
                
            }

        }

        // totalCollateralBase - (totalDebtBase/ltv)
        let TOKEN_APPROVE = ADDRESS_POOL;
        if (dataToken.assetsSymbol === "VET") {
            TOKEN_APPROVE = ADDRESS_GATEWAY;
        }

        const contractATOKEN = new web3.eth.Contract(ABI_ATOKEN, process.env.REACT_APP_ATOKEN_VET);
        accountApprove = await contractATOKEN.methods.allowance(account, TOKEN_APPROVE).call();
        accountApprove = ethers.utils.formatUnits(accountApprove, 18);
        accountApprove = Number(accountApprove);

        accountApprove = 0;
        if (accountApprove < Number(accountBalance)) {
            accountApprove = 0;
        }

    }

    dispatch({
        type: marketplaceConstants.MODAL_OPEN_WITHDRAW_MARKET,
        loading:false,
        accountApprove,
        accountBalance: accountBalance,
        assetThreshold,
        dataToken
    });

};

/**
 * 
 * @param {*} dataToken 
 * @param {*} rateMode 
 * @returns 
 * interestRateMode: 0, 1, 2  => 0: None, 1: Stable, 2: Variable
 */

export const approveWithdraw = (dataToken, rateMode = 2) => async (dispatch, getState) => {

    const state = getState();
    const { web3, account, connex } = state.web3;

    if (account && dataToken.assetsAddress && rateMode) {

        let TOKEN_APPROVE = ADDRESS_POOL;
        if (dataToken.assetsSymbol === "VET") {
            TOKEN_APPROVE = ADDRESS_GATEWAY;
        }

        let approveABI = ABI_ATOKEN.find(({ name, type }) => (name === "approve" && type === "function"));
        let approveMethod = connex.thor.account(process.env.REACT_APP_ATOKEN_VET).method(approveABI);

        if (approveMethod) {

            const key = randomKeyUUID();

            approveMethod.transact(TOKEN_APPROVE, web3.utils.toWei(amountMaxApprove.toString()))
                .comment(`approve withdraw ${TOKEN_APPROVE} on VeBank`)
                .accepted(() => {
                    dispatch(actions.alertActions.loading({
                        title: "Waiting For Approve",
                        description: `Approve withdraw ${dataToken.assetsSymbol} on VeBank`,
                    }, key));     
                })
                .request()
                .then(result => {

                    dispatch({
                        type: marketplaceConstants.MODAL_OPEN_WITHDRAW_MARKET,
                        accountApprove: amountMaxApprove
                    });

                    dispatch(actions.alertActions.update({
                        status: "success",
                        title: "Approve Success",
                        description: `Approve withdraw ${dataToken.assetsSymbol} on VeBank success!`,
                      }, key));

                    return result;

                }).catch((e) => {
                    console.log("error----", e);
                    dispatch(actions.alertActions.update({
                        status: "warning",
                        title: "Approve Withdraw Rejected",
                        description: e.message
                      }, key));
                    return e;
                });
        }
    }


};


/**
 * 
 * @param {number} id 
 * @returns dispatch strore
 *  borrow(addressAsset, amount, interestRateMode, referralCode, userAddress)  Ex: borrow(0x0fa8DC6200255Fc3382CDDb4B5358d7713D99c8d, "5000000000000000000", 1, 0, 0xeC310e7cC338f9087CaAcf291ba5023B3326626F)
 * 
 * 
 */
export const withdrawMarket = (dataToken, amount) => async (dispatch, getState) => {
   
    const state = getState();

    const { account, connex } = state.web3;

    if (connex && account && dataToken.assetsAddress) {

        const key = randomKeyUUID();

        //let amountWithdraw = web3.utils.toWei(amount.toString());

        const amountWithdraw = ethers.utils.parseUnits(amount.toString(), dataToken.assetsDecimals);

        const withdrawETH_ABI = ERC20ABI_POOL.find(({ name, type }) => name === "withdraw" && type === "function");
        const methodWithdraw = connex.thor.account(ADDRESS_POOL).method(withdrawETH_ABI);

        const c2_withdraw = methodWithdraw.asClause(dataToken.assetsAddress, amountWithdraw, account)

        connex.vendor
            .sign('tx', [c2_withdraw])
            .comment(`withdraw ${amount} ${dataToken.assetsSymbol}`)
            .accepted(() => {
                dispatch({
                    type: marketplaceConstants.MODAL_WITHDRAW_MARKET_REQUEST
                });
                dispatch(actions.alertActions.loading({
                    title: "Waiting For Confirmation",
                    description: `Withdraw ${numberWithCommas(amount)} ${dataToken.assetsSymbol}`,
                  }, key));
            })
            .request()
            .then(transaction => {

                dispatch({
                    type: marketplaceConstants.MODAL_WITHDRAW_MARKET_SUCCESS,
                    transaction
                });

                dispatch(actions.alertActions.update({
                    status: "success",
                    title: "Transaction Submitted",
                    description: `Transfer ${numberWithCommas(amount)} ${dataToken.assetsSymbol} to Withdraw VeBank`,
                  }, key));

                return transaction;

            }).catch((e) => {

                console.log("error----", e);
                dispatch({
                    type: marketplaceConstants.MODAL_WITHDRAW_MARKET_ERROR
                });
                dispatch(actions.alertActions.update({
                    status: "warning",
                    title: "Transaction Withdraw Rejected",
                    description: e.message
                  }, key));
                return e;

            });

    }


};


/**
 * 
 * @param {number} id 
 * @returns dispatch strore
 * borrowETH(PoolAddress, amount, interestRateMode, referralCode) await iWETHGateway.borrowETH("0x", "80000000000000000", 2, 0);
 * "interestRateMode: 0, 1, 2 => 0: None, 1: Stable, 2: Variable"
 */
export const withdrawETHMarket = (dataToken, amount) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account, connex } = state.web3;

    if (connex && account && amount) {

        const key = randomKeyUUID();

        const amountWithdraw = web3.utils.toWei(amount.toString());

        // approve Atoken 
        let approveABI = ABI_ATOKEN.find(({ name, type }) => name === "approve" && type === "function");
        let approveMethod = connex.thor.account(process.env.REACT_APP_ATOKEN_VET).method(approveABI);
        const c1_approve = approveMethod.asClause(ADDRESS_GATEWAY, web3.utils.toWei(amountMaxApprove.toString()))

        const withdrawETH_ABI = ERC20ABI_WETH_GETAWAY.find(({ name, type }) => name === "withdrawETH" && type === "function");
        const methodWithdraw = connex.thor.account(ADDRESS_GATEWAY).method(withdrawETH_ABI);
        const c2_withdraw = methodWithdraw.asClause(ADDRESS_POOL, amountWithdraw, account)


        connex.vendor
            .sign('tx', [ c2_withdraw])
            .comment(`withdraw ${numberWithCommas(amount)} ${dataToken.assetsSymbol}`)
            .accepted(() => {
                dispatch({
                    type: marketplaceConstants.MODAL_WITHDRAW_MARKET_REQUEST
                });
                dispatch(actions.alertActions.loading({
                    title: "Waiting For Confirmation",
                    description: `Withdraw ${numberWithCommas(amount)} ${dataToken.assetsSymbol}`,
                }, key));
            })
            .request()
            .then(transaction => {

                setTimeout(() => {
                    dispatch({
                        type: marketplaceConstants.MODAL_WITHDRAW_MARKET_SUCCESS,
                        transaction: 1
                    });
                }, 1500);
              
                dispatch(actions.alertActions.update({
                    status: "success",
                    title: "Transaction Submitted",
                    description: `Transfer ${numberWithCommas(amount)} to withdraw`,
                  }, key));

                return transaction;

            }).catch((e) => {

                console.log("error----", e);
                dispatch({
                    type: marketplaceConstants.MODAL_WITHDRAW_MARKET_ERROR
                });

                dispatch(actions.alertActions.update({
                    status: "warning",
                    title: "Transaction Withdraw Rejected",
                    description: e.message
                  }, key));

                return e;

            });

    }


};
