import { ethers } from 'ethers';

import {  marketplaceConstants } from '../../constants';

import * as actions from '../.';

import ERC20ABI_VB from '../../_contracts/assets/VB.json';

import ERC20ABI_WETH_GETAWAY from '../../_contracts/lend/WETHGateway.json';
import ERC20ABI_POOL from '../../_contracts/lend/Pool.json';
import { numberWithCommas, randomKeyUUID } from '../../utils/lib';

const ADDRESS_GATEWAY = process.env.REACT_APP_ADDRESS_GATEWAY; // WETHGateway (chinh là VET Asset)
const ADDRESS_POOL = process.env.REACT_APP_ADDRESS_POOL;

// ------------------------ SUPPLY ------------------------ //
/**
 * 
 * @param {number} id 
 * @returns dispatch strore
 * depositETH(PoolAddress,UserAddress, referralCode) await iWETHGateway.depositETH("0x...","0x.....", 0, {value: "100000000000000000"})
 * 
 */
export const loadModalSupply = (dataToken) => async (dispatch, getState) => {

    const state = getState();
    const { web3, account } = state.web3;

    let accountBalance = 0;
    let accountApprove = 0;
    let contractSupply;

    if(!account){
        dispatch(actions.web3Connect(true));
        return;
    }
    
    contractSupply = new web3.eth.Contract(ERC20ABI_VB, dataToken.assetsAddress);

    if (dataToken.assetsSymbol === "VET") {

        const accountCoinVET = await dispatch(actions.instantiateVetContracts());

        if (accountCoinVET.balance) {
            accountBalance = ethers.utils.formatEther(accountCoinVET.balance);
            //accountBalance = Math.round(accountBalance * 100) / 100;
        }

    } else {

        if (contractSupply && account) {
            const balanceBigN = await contractSupply.methods.balanceOf(account).call();
            accountBalance = ethers.utils.formatUnits(balanceBigN, dataToken.assetsDecimals);
            //accountBalance = Math.round(accountBalance * 100) / 100;
        }

    }

    // get the approved coin MSP account
    accountApprove = await contractSupply.methods.allowance(account, ADDRESS_POOL).call();
    accountApprove = ethers.utils.formatEther(accountApprove);
    accountApprove = Number(accountApprove);

    if(accountApprove < Number(accountBalance)){
        accountApprove=0;
    }

    dispatch({
        type: marketplaceConstants.MODAL_OPEN_SUPPLY_MARKET,
        contractSupply,
        accountBalance: accountBalance,
        dataToken,
        accountApprove
    });

};

export const approveSupply = (dataToken) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account, connex } = state.web3;

    const { contractSupply } = state.supplyReducer;

    const amountMax = 1000000000;

    if (account && contractSupply && dataToken.assetsAddress) {
        const key = randomKeyUUID();

        dispatch(actions.alertActions.loading({
            title: "Waiting For Approve",
            description: `Approve Supply ${dataToken.assetsSymbol} on VeBank`,
          }, key));

        const approveABI = { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }
        const approveMethod = connex.thor.account(dataToken.assetsAddress).method(approveABI);

        let TOKEN_APPROVE = ADDRESS_POOL;
        // if (dataToken.assetsSymbol === "VET") {
        //     TOKEN_APPROVE = process.env.REACT_APP_ADDRESS_GATEWAY;
        // }

        approveMethod
            .transact(TOKEN_APPROVE, web3.utils.toWei(amountMax.toString()))
            .comment(`approve ${dataToken.assetsSymbol} on VeBank`)
            .request()
            .then(result => {


              setTimeout(() => {
                dispatch({
                    type: marketplaceConstants.MODAL_OPEN_SUPPLY_MARKET,
                    accountApprove: amountMax
                });
              }, 1500);

                dispatch(actions.alertActions.update({
                    status: "success",
                    title: "Approve success",
                    description: `Approve supply ${dataToken.assetsSymbol} on VeBank success!`,
                  }, key));

                return result;

            }).catch((e) => {

                console.log("error----", e);
                dispatch(actions.alertActions.update({
                    status: "warning",
                    title: "Approve Supply Rejected",
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
 * depositETH(PoolAddress,UserAddress, referralCode) await iWETHGateway.depositETH("0x...","0x.....", 0, {value: "100000000000000000"})
 * 
 */
export const supplyMarket = (dataToken, amount) => async (dispatch, getState) => {

    const state = getState();

    const { account, connex } = state.web3;

    if (connex && account && dataToken.assetsAddress) {

        const key = randomKeyUUID();

        const supplyABI = ERC20ABI_POOL.find(({ name, type }) => (name === "supply" && type === "function"));
        const methodSupply = connex.thor.account(ADDRESS_POOL).method(supplyABI);

        // const valueAmount = web3.utils.toWei(amount.toString());
        const valueAmount = ethers.utils.parseUnits(amount.toString(), dataToken.assetsDecimals);

        // console.log(dataToken.assetsAddress, valueAmount, account, 0);
        methodSupply.transact(dataToken.assetsAddress, valueAmount, account, 0)
        .comment(`transfer ${numberWithCommas(amount)} ${dataToken.assetsSymbol} to Supply VeBank`)
        .accepted(() => {
            dispatch({
                type: marketplaceConstants.MODAL_SUPPLY_MARKET_REQUEST
            });
            dispatch(actions.alertActions.loading({
                title: "Waiting For Confirmation",
                description: `Supply ${numberWithCommas(amount)} ${dataToken.assetsSymbol}`,
            }, key));
        })
        .request()
        .then(transaction => {

            dispatch({
                type: marketplaceConstants.MODAL_SUPPLY_MARKET_SUCCESS,
                transaction
            });

            if(transaction && transaction.signer === account){
                dispatch(actions.alertActions.update({
                    status: "success",
                    title: "Transaction Submitted",
                    description: `Transfer ${numberWithCommas(amount)} ${dataToken.assetsSymbol} to Supply VeBank`,
                    }, key));
            }

            return transaction;

        }).catch((e) => {

            console.log("error----", e);
            dispatch({
                type: marketplaceConstants.MODAL_SUPPLY_MARKET_ERROR
            });
            dispatch(actions.alertActions.update({
                status: "warning",
                title: "Transaction Supply Rejected",
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
 * depositETH(PoolAddress,UserAddress, referralCode) await iWETHGateway.depositETH("0x...","0x.....", 0, {value: "100000000000000000"})
 * 
 */
export const supplyDepositVETMarket = (addressAsset, amount) => async (dispatch, getState) => {
    
    const state = getState();

    const { web3, account, connex } = state.web3;

    if (connex && account && amount) {

        const key = randomKeyUUID();

        const depositVET_ABI = ERC20ABI_WETH_GETAWAY.find(({ name, type }) => name === "depositETH" && type === "function");
        const methodDepositETH = connex.thor.account(ADDRESS_GATEWAY).method(depositVET_ABI);

        methodDepositETH.value(web3.utils.toWei(amount.toString()));

        methodDepositETH.transact(ADDRESS_POOL, account, 0)
            .comment(`Transfer ${amount} VET to supply to the market`)
            .accepted(() => {
                dispatch({
                    type: marketplaceConstants.MODAL_SUPPLY_MARKET_REQUEST
                });
                dispatch(actions.alertActions.loading({
                    title: "Waiting For Confirmation",
                    description: `Supply ${numberWithCommas(amount)} ${addressAsset.assetsSymbol}`,
                }, key));
            })
            .request()
            .then(transaction => {

                dispatch({
                    type: marketplaceConstants.MODAL_SUPPLY_MARKET_SUCCESS,
                    transaction
                });

                dispatch(actions.alertActions.update({
                    status: "success",
                    title: "Transaction Submitted",
                    description: `Transfer ${numberWithCommas(amount)} VET into the market successfully`,
                  }, key));

                return transaction;

            }).catch((e) => {

                console.log("error----", e);
                
                dispatch({
                    type: marketplaceConstants.MODAL_SUPPLY_MARKET_ERROR
                });

                dispatch(actions.alertActions.update({
                    status: "warning",
                    title: "Transaction Supply Rejected",
                    description: e.message
                  }, key));

                return e;

            });

    }

};