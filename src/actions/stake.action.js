import queryString from "query-string";
import { ethers } from "ethers";
import { stakeConstants } from "../constants";

import ERC20ABI_VB from '../_contracts/assets/VB.json';
import ERCABI_STAKE from "../_contracts/staking/StakeRanking.json";

import * as actions from ".";
import { addressWalletCompact, nFormatter, numberWithCommas, randomKeyUUID } from "../utils/lib";
import promise from "redux-promise";

const ADDR_STAKING_VB = process.env.REACT_APP_STAKING_VEBANK;

const SECONDS_IN_YEAR = 31536000;

// ------------------------ STAKE VB ------------------------ //
/**
 * 
 * 
 * 
 * "(emissionsPerSecond * (seconds in a year)) / current stakes
 * seconds in a year = 31104000 seconds
 * current stakes = StakedVebank.totalSupply()"
 */
export const loadAccountStakedVB = (addressStaking) => async (dispatch, getState) => {

  const state = getState();

  let { web3, account } = state.web3;

  let accountStaked = 0;
  let amountPending = 0;
  let accountRewards = 0;
  let totalSupply = 0;
  let stakedAPR = 0;
  let accountApproveStake= 0;
  let cooldownSeconds = 0;
  let UNSTAKE_WINDOW = 0;
  let stakersCooldowns = 0 ;
  let perMonth = 0;

  let dueTimeEnd = null;

  if (web3 && account && addressStaking) {

      let contractStaking = new web3.eth.Contract(ERCABI_STAKE, addressStaking);

      if (contractStaking) {

          try {

            totalSupply = await contractStaking.methods.totalSupply().call();
            //totalSupply = ethers.utils.formatEther(totalSupply);
            console.log("totalSupply",totalSupply);

            // amount staked
            accountStaked = await contractStaking.methods.balanceOf(account).call();
           // accountStaked = ethers.utils.formatEther(accountStaked);
            console.log("accountStaked",accountStaked);

            // amount rewards 
            accountRewards = await contractStaking.methods.getTotalRewardsBalance(account).call();
            accountRewards = ethers.utils.formatEther(accountRewards);
            //console.log("accountRewards", accountRewards);

            let assetStaked = await contractStaking.methods.assets(addressStaking).call();
            //console.log("assetStaked", assetStaked);

            cooldownSeconds = await contractStaking.methods.COOLDOWN_SECONDS().call();
            //console.log("cooldownSeconds", cooldownSeconds);

            UNSTAKE_WINDOW = await contractStaking.methods.UNSTAKE_WINDOW().call();
            //console.log("UNSTAKE_WINDOW", UNSTAKE_WINDOW);

            stakersCooldowns = await contractStaking.methods.stakersCooldowns(account).call();
            //console.log("stakersCooldowns", stakersCooldowns);

            if(Number(totalSupply)){
                stakedAPR = (assetStaked.emissionPerSecond * SECONDS_IN_YEAR)/totalSupply;
            }
            
            //=> VB per month = emissionPerSecond * 3600 * 4 * 30 * user_staked_balance / total_staked"
            if( Number(totalSupply)){
                perMonth = (assetStaked.emissionPerSecond  * 3600 * 4 * 30 * accountStaked) / totalSupply;
            }

            if(accountStaked){
                accountStaked = ethers.utils.formatEther(accountStaked);
            }

            if(totalSupply){
                totalSupply = ethers.utils.formatEther(totalSupply);
            }

            if(perMonth){
                perMonth = perMonth.toLocaleString('fullwide', {useGrouping:false});
                perMonth = ethers.utils.formatEther(perMonth);
            }

            if(stakersCooldowns){
                
                const currentTime = parseInt(new Date().getTime() / 1000);
                // console.log("currentTime",currentTime);
                // console.log("before unstake", Number(cooldownSeconds) + Number(stakersCooldowns));
                // console.log("unstaked", Number(UNSTAKE_WINDOW) + Number(stakersCooldowns));

                if(currentTime > Number(UNSTAKE_WINDOW) + Number(stakersCooldowns)){
                    //console.log("dueTimeEnd  ---------1 ");
                    dueTimeEnd = 0;
                }else if( (Number(cooldownSeconds) + Number(stakersCooldowns) ) < currentTime &&  Number(UNSTAKE_WINDOW) + Number(stakersCooldowns) > currentTime){
                    //console.log("dueTimeEnd  ---------2 ");
                    dueTimeEnd =   (Number(UNSTAKE_WINDOW) + (Number(stakersCooldowns) - 4) ) - currentTime;
                }else if(Number(cooldownSeconds) + Number(stakersCooldowns)  >  currentTime){
                    //console.log("dueTimeEnd  ---------3 ");
                    dueTimeEnd =  (Number(cooldownSeconds) + Number(stakersCooldowns) + Number(UNSTAKE_WINDOW)) - currentTime;
                }

                if(dueTimeEnd < 0){
                    dueTimeEnd = 0;
                }

            }

          } catch (error) {
              console.log("-------error", error);
          }

      }

      dispatch({
          addressStaking,
          accountStaked,
          accountRewards,
          totalSupply,
          stakedAPR: nFormatter(stakedAPR,2),
          perMonth,
          amountPending,
          accountApproveStake,
          UNSTAKE_WINDOW,
          cooldownSeconds,
          stakersCooldowns,
          dueTimeEnd,
          type: addressStaking === ADDR_STAKING_VB  ? stakeConstants.GET_ACCOUNT_STAKED_VB : stakeConstants.GET_ACCOUNT_STAKED_VETVB,
          contractStaking
      });

      return contractStaking;

  } else {
      dispatch({
          accountStaked,
          accountRewards,
          totalSupply,
          stakedAPR,
          amountPending,
          type: addressStaking === ADDR_STAKING_VB  ? stakeConstants.GET_ACCOUNT_STAKED_VB : stakeConstants.GET_ACCOUNT_STAKED_VETVB,
          contractStaking: null,
      });
  }

};

export const listenEventStakeVB = (addressStaking) => async (dispatch, getState) => {

    const state = getState();
    const { web3, account } = state.web3;

    const { isSubscribeListener, stakeTransferEvent } = state.stakeReducer;
    
    if(web3 && account && addressStaking){
        
        let contractStaking = new web3.eth.Contract(ERCABI_STAKE, addressStaking);
        let _isSubscribed = isSubscribeListener ?? false;
        let _transferEvent = stakeTransferEvent;

        if (contractStaking && !_isSubscribed) {
          _transferEvent = contractStaking.events.Transfer?.();
          _transferEvent.on("data", async (data) => {

            const {txOrigin} = data.meta;
            if (txOrigin.equals(account) ) {

                dispatch({
                    type: stakeConstants.GET_ACCOUNT_STAKED_VB,
                    loading: false
                });

                dispatch(actions.loadAccountStakedVB(addressStaking));

            }
          });

          contractStaking.events.Cooldown?.().on("data", async (data) => {
            const {txOrigin} = data.meta;
            if (txOrigin.equals(account) ) {
                let stakersCooldowns = await contractStaking.methods.stakersCooldowns(account).call();

                dispatch({
                    type: stakeConstants.GET_ACCOUNT_STAKED_VB,
                    stakersCooldowns,
                    loadingCooldown:false,
                    loading: false
                });
            }
          })

          contractStaking.events.RewardsClaimed?.().on("data", async (data) => {
            const {txOrigin} = data.meta;
            if (txOrigin.equals(account) ) {

               let accountRewards = await contractStaking.methods.getTotalRewardsBalance(account).call();
                accountRewards = ethers.utils.formatEther(accountRewards);

                dispatch({
                    type: stakeConstants.GET_ACCOUNT_STAKED_VB,
                    accountRewards,
                    loading: false
                });
            }
          })
          
          _isSubscribed = true;

        }

    }

};

export const listenEventStakeVETVB = (addressStaking) => async (dispatch, getState) => {

    const state = getState();
    const { web3, account } = state.web3;

    const { isSubscribeListener_VETVB, stakeTransferEvent_VETVB } = state.stakeReducer;
    
    if(web3 && account && addressStaking){
        
        let contractStaking = new web3.eth.Contract(ERCABI_STAKE, addressStaking);
        let _isSubscribed = isSubscribeListener_VETVB ?? false;
        let _transferEvent = stakeTransferEvent_VETVB;

        if (contractStaking && !_isSubscribed) {
          _transferEvent = contractStaking.events.Transfer?.();
          _transferEvent.on("data", async (data) => {

            const {txOrigin} = data.meta;
            if (txOrigin.equals(account) ) {

                dispatch({
                    type: stakeConstants.GET_ACCOUNT_STAKED_VETVB,
                    loading: false
                });

                dispatch(actions.loadAccountStakedVB(addressStaking));

            }
          });

          contractStaking.events.Cooldown?.().on("data", async (data) => {
            const {txOrigin} = data.meta;
            if (txOrigin.equals(account) ) {
                let stakersCooldowns = await contractStaking.methods.stakersCooldowns(account).call();

                dispatch({
                    type: stakeConstants.GET_ACCOUNT_STAKED_VETVB,
                    stakersCooldowns,
                    loadingCooldown:false,
                    loading: false
                });
            }
          })

          contractStaking.events.RewardsClaimed?.().on("data", async (data) => {
            const {txOrigin} = data.meta;
            if (txOrigin.equals(account) ) {

               let accountRewards = await contractStaking.methods.getTotalRewardsBalance(account).call();
                accountRewards = ethers.utils.formatEther(accountRewards);

                dispatch({
                    type: stakeConstants.GET_ACCOUNT_STAKED_VETVB,
                    accountRewards,
                    loading: false
                });
            }
          })
          
          _isSubscribed = true;

        }

    }

};

/**
 *
 * @param {*} addressStaking
 * @returns dispatch strore
 *
 */
export const loadModalStake = (addressStaking, tokenStaking) => async (dispatch, getState) => {

    const state = getState();
    const { web3, account } = state.web3;

    let accountBalance = 0;
    let accountApprove = 0;
    // let contractBorrow;

    const contractVB = new web3.eth.Contract(ERC20ABI_VB, tokenStaking);

    try {

        //get balance stake by account
        const balanceBigN = await contractVB.methods.balanceOf(account).call();
        accountBalance = ethers.utils.formatEther(balanceBigN);
        accountBalance = Math.round(accountBalance * 100) / 100;

        // get the approved coin 
        accountApprove = await contractVB.methods.allowance(account, addressStaking).call();
        accountApprove = ethers.utils.formatEther(accountApprove);
        accountApprove = Number(accountApprove);

    } catch (error) {
        console.log("-------error", error);
    }

    dispatch({
        type: stakeConstants.MODAL_OPEN_STAKE,
        addressStaking,
        accountApprove,
        accountBalance: accountBalance,
        contractVB
    });

};

/**
 *
 * @param {*} addressStaking
 * @returns dispatch strore
 *
 */
export const loadModalUnStake = (addressStaking) => async (dispatch, getState) => {

    const state = getState();
    const { web3, account } = state.web3;

    let accountBalance = 0;
    let contractStaking = new web3.eth.Contract(ERCABI_STAKE, addressStaking);

    try {

        //get balance stake by account
        accountBalance = await contractStaking.methods.balanceOf(account).call();
        accountBalance = ethers.utils.formatEther(accountBalance);

    } catch (error) {
        console.log("-------error", error);
    }

    dispatch({
        type: stakeConstants.MODAL_OPEN_UNSTAKE,
        addressStaking,
        accountBalance,
        contractStaking
    });

};



/**
 *
 * @param {*} addressStaking
 * @returns dispatch strore
 *
 */
export const approveStaking = (addressStaking) => async (dispatch, getState) => {

    const state = getState();

    const { connex ,web3, account } = state.web3;

    const amountMax = 10000000000;
    const key = randomKeyUUID();

    if (account && amountMax && addressStaking) {

        const tokenApprove  = addressStaking === process.env.ADDR_STAKING_VB ? process.env.REACT_APP_STAKING_VEBANK : process.env.REACT_APP_ADDRESS_PAIR_VETVB;

        const approveABI = { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }
        const approveMethod = connex.thor.account(tokenApprove).method(approveABI);

        await approveMethod
            .transact(addressStaking, web3.utils.toWei(amountMax.toString()))
            .comment(`approve staking on VeBank`)
            .request()
            .then(result => {

              setTimeout(() => {
                dispatch({
                    type: stakeConstants.MODAL_OPEN_STAKE,
                    accountApprove: amountMax
                });
              }, 1500);

                dispatch(actions.alertActions.update({
                    status: "success",
                    title: "Approve success",
                    description: `Approve staking on VeBank success!`,
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
 * @param {*} addressStaking
 * @returns dispatch strore
 *
 */
export const stakingVeBank = (addressStaking, amount) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account, connex} = state.web3;

    if (account && addressStaking && amount) {

        const key = randomKeyUUID();
        const amountStaking = web3.utils.toWei(amount.toString());

        const stakeABI = ERCABI_STAKE.find(({ name, type }) => (name === "stake" && type === "function"));
        const methodStaking = connex.thor.account(addressStaking).method(stakeABI);

        try {

          await  methodStaking.transact(account, amountStaking)
            .comment(`transfer ${amount} VB to Stake`)
            .accepted(() => {
                dispatch({
                    type: stakeConstants.MODAL_STAKE_REQUEST
                });
                dispatch(actions.alertActions.loading({
                    title: "Waiting For Confirmation",
                    description: `Staking ${numberWithCommas(amount)} VB`,
                }, key));
            })
            .request()
            .then( async transaction =>  {
    
                await dispatch({
                    type: stakeConstants.MODAL_STAKE_SUCCESS,
                    transaction
                });

                if(addressStaking === ADDR_STAKING_VB){
                    await dispatch({
                        type: stakeConstants.GET_ACCOUNT_STAKED_VB,
                        loading: true
                    });
                }else{
                    await dispatch({
                        type: stakeConstants.GET_ACCOUNT_STAKED_VETVB,
                        loading: true
                    });
                }
    
                if(transaction && transaction.signer === account){
                    await dispatch(actions.alertActions.update({
                        status: "success",
                        title: "Transaction Submitted",
                        description: `Transfer ${numberWithCommas(amount)} VB to Stake`,
                        }, key));
                }

                return transaction;
    
            }).catch((e) => {
    
                console.log("error----", e);
                dispatch({
                    type: stakeConstants.MODAL_STAKE_ERROR
                });

                dispatch(actions.alertActions.update({
                    status: "warning",
                    title: "Transaction Stake Rejected",
                    description: e.message
                    }, key));

                return e;
    
            });
        } catch (error) {
            console.log("error----", error);
        }
        
    }

};

/**
 *
 * @param {*} addressStaking
 * @returns dispatch strore
 *
 */
 export const unStakeVeBank = (addressStaking, amount) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account, connex} = state.web3;

    if (account && addressStaking && amount) {

        const key = randomKeyUUID();
        const amountStaking = web3.utils.toWei(amount.toString());

        const stakeABI = ERCABI_STAKE.find(({ name, type }) => (name === "redeem" && type === "function"));
        const methodStaking = connex.thor.account(addressStaking).method(stakeABI);

        try {

          await methodStaking.transact(account, amountStaking)
            .comment(`transfer ${amount} VB to unStake`)
            .accepted(() => {
                dispatch({
                    type: stakeConstants.MODAL_STAKE_REQUEST
                });
                dispatch(actions.alertActions.loading({
                    title: "Waiting For Confirmation",
                    description: `Unstaked ${numberWithCommas(amount)} VB`,
                }, key));
            })
            .request()
            .then( async transaction =>  {
    
                await dispatch({
                    type: stakeConstants.MODAL_UNSTAKE_SUCCESS,
                    transaction
                });
    
                if(transaction && transaction.signer === account){

                    if(addressStaking === ADDR_STAKING_VB){
                        await dispatch({
                            type: stakeConstants.GET_ACCOUNT_STAKED_VB,
                            loading: true
                        });
                    }else{
                        await dispatch({
                            type: stakeConstants.GET_ACCOUNT_STAKED_VETVB,
                            loading: true
                        });
                    }

                    await dispatch(actions.alertActions.update({
                        status: "success",
                        title: "Transaction Submitted",
                        description: `Transfer ${numberWithCommas(amount)} VB to Unstaked`,
                        }, key));
                }

                return transaction;
    
            }).catch((e) => {
    
                console.log("error----", e);
                dispatch({
                    type: stakeConstants.MODAL_UNSTAKE_ERROR
                });

                dispatch(actions.alertActions.update({
                    status: "warning",
                    title: "Transaction Stake Rejected",
                    description: e.message
                    }, key));

                return e;
    
            });
        } catch (error) {
            console.log("error----", error);
        }
        
    }

};

/**
 *
 * @param {*} addressStaking
 * @returns dispatch strore
 *
 */
export const coolDownsStaking = (addressStaking) => async (dispatch, getState) => {

    const state = getState();

    const { connex , account } = state.web3;
    // const { contractVB } = state.stakeReducer;

    const key = randomKeyUUID();

    if (account && addressStaking) {

        const cooldownABI = ERCABI_STAKE.find(({ name, type }) => (name === "cooldown" && type === "function"));
        const cooldownMethod = connex.thor.account(addressStaking).method(cooldownABI);

        await cooldownMethod
            .transact()
            .comment(`cooldown to unstake`)
            .request()
            .then(result => {

                dispatch({
                    type:  addressStaking === ADDR_STAKING_VB ? stakeConstants.GET_ACCOUNT_STAKED_VB : stakeConstants.GET_ACCOUNT_STAKED_VETVB,
                    loadingCooldown: true,
                    loading: true
                });

                return result;

            }).catch((e) => {

                console.log("error----", e);
                // dispatch(actions.alertActions.update({
                //     status: "warning",
                //     title: "Approve Supply Rejected",
                //     description: e.message
                //   }, key));
                return e;

            });

    }

};

export const loadModalClaimStaked = (addressStaking) => async (dispatch, getState) => {

    const state = getState();
  
    const { web3, account } = state.web3;
  
    let accountApprove = 0;
    let accountBalance = 0;
    let dataList = [];
  
    dispatch({
      type: stakeConstants.MODAL_OPEN_CLAIM_STAKED_MARKET,
      loading: true,
      addressStaking,
      accountApprove,
      accountBalance,
    });
  
    if (web3 && account ) {
  
        let contractStaking = new web3.eth.Contract(ERCABI_STAKE, addressStaking);
  
          try {

            accountBalance = await contractStaking.methods.getTotalRewardsBalance(account).call();
            accountBalance = ethers.utils.formatEther(accountBalance);

          } catch (error) {
            console.log("error getUserAccountData:", error);
          }
  
          dispatch({
            type: stakeConstants.MODAL_OPEN_CLAIM_STAKED_MARKET,
            loading: false,
            addressStaking,
            accountApprove:1,
            accountBalance,
          });
  
          dispatch(actions.getAccountOverview());
  
      }

    return dataList;
    
}

export const claimRewardStaked = (addressStaking, amoutClaim) => async (dispatch, getState) => {
    
    const state = getState();
    const { account, connex, web3 } = state.web3;

    if (connex && account && addressStaking) {

      try {

        const claimABI = ERCABI_STAKE.find(
          ({ name, type }) => name === "claimRewards" && type === "function"
        );
  
        const valueAmount = web3.utils.toWei(amoutClaim.toString());
        const methodClaim = connex.thor.account(addressStaking).method(claimABI);
  
        await methodClaim
          .transact(account, valueAmount)
          .comment(`transfer to Claim VeBank`)
          .request()
          .then(async (transaction) => {

            await  dispatch({
              type: stakeConstants.MODAL_CLAIM_STAKED_SUCCESS,
              transaction
            });
            
            await dispatch(
              actions.alertActions.success({
                title: "Claim successfully!",
                description: `Wallet ${addressWalletCompact(transaction.signer)}`,
              })
            );

            if(addressStaking === ADDR_STAKING_VB){
                await dispatch({
                    type: stakeConstants.GET_ACCOUNT_STAKED_VB,
                    loading: true
                });
            }else{
                await dispatch({
                    type: stakeConstants.GET_ACCOUNT_STAKED_VETVB,
                    loading: true
                });
            }
            
            await  dispatch({
              type: stakeConstants.MODAL_CLOSE_CLAIM_STAKED_MARKET
            });

            return transaction;
          })
          .catch((e) => {
            console.log("error----", e);
            dispatch({
              type: stakeConstants.MODAL_CLAIM_STAKED_ERROR,
            });
            dispatch(
              actions.alertActions.warning({
                title: "Claim failed!",
                description: `Wallet ${addressWalletCompact(account)}`,
              })
            );
            dispatch(actions.closeModalClaim());
            return e;
          });
      } catch (error) {
        console.log("error ----:", error);
      }
    }
  
    // return dataList;
};