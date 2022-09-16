import { useMemo } from "react";
import * as actions from "../../actions";
import { WVET } from "../../blockchain/Token";
import { useSwap } from "../../hooks/useSwap";
import { useSelector, useDispatch } from "react-redux";
import { ChainId, swapConstants } from "../../constants";
import { selectAccount } from "../../reducers/web3.reducer";
import { DUMMY_VET, INPUT_TYPE } from "../../hooks/constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { selectBalanceById } from "../../reducers/accountBalance.reducer";
import { selectAssetByAddress } from "../../reducers/assetsMarket.reducer";
import { selectPriceByTokenAddress } from "../../reducers/assetsPrice.reducer";
import {
  // selectPairsFee,
  selectReserveTo,
  swapTokenDesire,
  selectLoadingFee,
  selectDesireToken,
  selectSourceToken,
  selectReserveFrom,
  selectPoolAddress,
  selectEmptyAddress,
  openModalSelectToken,
  selectExchangeRateAB,
  selectExchangeRateBA,
  selectAccountApprove,
  selectNameTokenState,
} from "../../reducers/swap.reducer";
import {
  checkApproveToken,
  checkAssetExistsPools,
  checkExchangeRatePool,
  onApproveTokenForAccount,
  updateBalanceAccount,
} from "../../actions";
import {
  checkCharacterZero,
  checkDotEndText,
  checkLengthDecimal,
  compareString,
} from "../../utils/lib";
import {
  // useSwapFee,
  useAmountOutMin,
  useCheckBalance,
  useExchangeRate,
} from "../../hooks/useCalculate";
import { computeTradePriceBreakdown } from "../../hooks/Trades";

const insufficientErr = "Insufficient liquidity for this trade.";
const defaultErr = "Enter an amount to see more trading details.";
const slippageErr = "Slippage no smaller than 0.5% or no greater than 50%";

const chainId = ChainId.TESTNET;

const useSwapFacade = () => {
  const dispatch = useDispatch();

  /* State */
  const [namePool, setNamePool] = useState("");
  const [isDelay, setIsDelay] = useState(false);
  const [error, setError] = useState(defaultErr);
  const [isSwitch, setIsSwitch] = useState(false);
  const [loadingSwap, setLoadingSwap] = useState(false);
  const [priceUpdate, setPriceUpdate] = useState(false);
  const [inputAmountIn, setInputAmountIn] = useState("");
  const [inputSlippage, setInputSlippage] = useState(0.5);
  const [inputAmountOut, setInputAmountOut] = useState("");
  const [showDetailInfo, setShowDetailInfo] = useState(true);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [inputType, setInputType] = useState(INPUT_TYPE.INPUT);
  const [loadingExchangeRate, setLoadingExchangeRate] = useState(false);

  /* Selector */
  // const fee = useSelector(selectPairsFee);
  const account = useSelector(selectAccount);
  const reserveTo = useSelector(selectReserveTo);
  const loadingFee = useSelector(selectLoadingFee);
  const poolAddress = useSelector(selectPoolAddress);
  const reserveFrom = useSelector(selectReserveFrom);
  const nameToken = useSelector(selectNameTokenState);
  const emptyAddress = useSelector(selectEmptyAddress);
  const accountApprove = useSelector(selectAccountApprove);
  const exchangeRateAB = useSelector(selectExchangeRateAB);
  const exchangeRateBA = useSelector(selectExchangeRateBA);
  const [firstLoadFlag, setFirstLoadFlag] = useState(false);
  const sourceTokenAddress = useSelector(selectSourceToken);
  const desireTokenAddress = useSelector(selectDesireToken);

  const sourceTokenInfo = useSelector((state) =>
    selectAssetByAddress(state, sourceTokenAddress)
  );
  const desireTokenInfo = useSelector((state) =>
    selectAssetByAddress(state, desireTokenAddress)
  );
  const sourceTokenPrice = useSelector((state) =>
    selectPriceByTokenAddress(state, sourceTokenAddress)
  );
  const desireTokenPrice = useSelector((state) =>
    selectPriceByTokenAddress(state, desireTokenAddress)
  );
  const sourceTokenBalance = useSelector((state) =>
    selectBalanceById(state, sourceTokenAddress)
  );
  const desireTokenBalance = useSelector((state) =>
    selectBalanceById(state, desireTokenAddress)
  );
  const vthoBalance = useSelector((state) =>
    selectBalanceById(state, process.env.REACT_APP_TOKEN_VTHO)
  );

  /* Ref */
  const poolErrRef = useRef("");
  const userInputRef = useRef("");
  const reserveToRef = useRef("");
  const reserveFromRef = useRef("");
  const poolAddressRef = useRef("");
  const amountInRef = useRef(inputAmountIn);
  const amountOutRef = useRef(inputAmountOut);
  const tokenARef = useRef(sourceTokenAddress);
  const tokenBRef = useRef(desireTokenAddress);

  const sourcePerDesireTokenPrice = useMemo(
    () => sourceTokenPrice / desireTokenPrice,
    [sourceTokenPrice, desireTokenPrice]
  );
  const desireTokenAmount = useMemo(
    () => inputAmountIn * exchangeRateAB,
    [inputAmountIn, exchangeRateAB]
  );

  const desirePerSourceTokenPrice = useMemo(
    () => desireTokenPrice / sourceTokenPrice,
    [sourceTokenPrice, desireTokenPrice]
  );
  const sourceTokenAmount = useMemo(
    () => inputAmountOut * desirePerSourceTokenPrice,
    [inputAmountOut, desirePerSourceTokenPrice]
  );

  // const swapFee = useSwapFee(fee, inputAmountIn, sourceTokenAddress);

  const amountOutMin = useAmountOutMin(
    desireTokenAddress,
    inputAmountOut,
    inputSlippage
  );

  const exchangeRate = useExchangeRate(
    inputAmountIn,
    inputAmountOut,
    sourceTokenAddress,
    desireTokenAddress
  );

  const { bestTrade, tokens, parsedAmounts, path } = useSwap(
    inputType === INPUT_TYPE.INPUT ? inputAmountIn : inputAmountOut,
    inputType,
    sourceTokenAddress,
    desireTokenAddress
  );

  const { priceImpactWithoutFee, realizedLPFee } =
    computeTradePriceBreakdown(bestTrade);

  const isBalanceAvailable = useCheckBalance(sourceTokenBalance, inputAmountIn);

  /* Function */
  const sleep = async (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const getExchangeRateLoop = async () => {
    setIsDelay(true);
    onCheckExchangeRatePool();
    await sleep(60000);
    setIsDelay(false);
  };

  const onFocusInputField = () => {
    document
      .getElementById(
        `${
          nameToken === swapConstants.FIRST_TOKEN
            ? "amountInInput"
            : "amountOutInput"
        }`
      )
      .focus();
  };

  const onSwapDesireToken = () => {
    amountInRef.current = inputAmountOut;
    amountOutRef.current = inputAmountIn;
    dispatch(swapTokenDesire());
    handleInputAmount();
  };

  const onSwapAssetToken = () => {
    setLoadingSwap(true);
    dispatch(
      actions.swapAsset({
        amountInToSwap: inputAmountIn,
        amountsOut: inputAmountOut,
        minAmountOut: amountOutMin,
        tokenAInfo: sourceTokenInfo,
        tokenBInfo: desireTokenInfo,
        path: path,
      })
    )
      .unwrap()
      .then((originalPromiseResult) => {
        if (originalPromiseResult) {
          onReloadPage();
          dispatch(
            updateBalanceAccount({
              addressTokenA: sourceTokenAddress,
              addressTokenB: desireTokenAddress,
            })
          );
          onUpdatePriceChange();
        }
        setLoadingSwap(false);
      })
      .catch((rejectedValueOrSerializedError) => {
        setLoadingSwap(false);
      });
  };

  const onReloadPage = () => {
    setInputAmountIn("");
    setInputAmountOut("");
    poolErrRef.current = "";
    userInputRef.current = "";
    setError(defaultErr);
  };

  const onApproveToken = () => {
    setLoadingApprove(true);
    dispatch(
      onApproveTokenForAccount({
        tokenInfo: sourceTokenInfo,
      })
    )
      .unwrap()
      .then((originalPromiseResult) => {
        setLoadingApprove(false);
      })
      .catch((rejectedValueOrSerializedError) => {
        setLoadingApprove(false);
      });
  };

  const onShowModalSelectToken = (nameToken) => {
    dispatch(openModalSelectToken(nameToken));
  };

  const onShowDetailInfo = () => {
    setShowDetailInfo(!showDetailInfo);
  };

  const onSwitchExchangeRate = () => {
    setIsSwitch(!isSwitch);
  };

  const onCheckApproveToken = useCallback(() => {
    dispatch(
      checkApproveToken({
        tokenInfo: sourceTokenInfo,
      })
    );
  }, [dispatch, sourceTokenInfo]);

  const onCheckExchangeRatePool = () => {
    setLoadingExchangeRate(true);
    dispatch(
      checkExchangeRatePool({
        tokenAddressA: sourceTokenAddress,
        tokenAddressB: desireTokenAddress,
        assetsPoolAddress: poolAddressRef.current,
      })
    )
      .unwrap()
      .then((originalPromiseResult) => {
        setLoadingExchangeRate(false);
        const { reserves1, reserves2 } = originalPromiseResult;
        if (
          (compareString(tokenARef.current, sourceTokenAddress) &&
            reserveFrom !== reserves1) ||
          (compareString(tokenBRef.current, desireTokenAddress) &&
            reserveTo !== reserves2)
        ) {
          if (userInputRef.current !== "") {
            setPriceUpdate(true);
          }
        }
        if (!firstLoadFlag) {
          reserveFromRef.current = reserves1;
          reserveToRef.current = reserves2;
          tokenARef.current = sourceTokenAddress;
          tokenBRef.current = desireTokenAddress;
          onFocusInputField();
        }
      })
      .catch((rejectedValueOrSerializedError) => {
        setLoadingExchangeRate(false);
      });
  };

  const onUpdatePriceChange = () => {
    setPriceUpdate(false);
    handleInputAmount();
  };

  const handleInputAmount = () => {
    if (
      amountInRef.current === userInputRef.current &&
      amountInRef.current !== ""
    ) {
      setInputAmountIn(userInputRef.current);
      document.getElementById("amountInInput").focus();

      const isInputValidate = checkInput(
        userInputRef.current,
        sourceTokenAddress
      );
      if (isInputValidate) {
        handleSwap(userInputRef.current, INPUT_TYPE.INPUT);
      } else {
        setInputAmountOut("");
        setPriceUpdate(false);
        setError(defaultErr);
      }
    }
    if (
      amountOutRef.current === userInputRef.current &&
      amountOutRef.current !== ""
    ) {
      setInputAmountOut(userInputRef.current);
      document.getElementById("amountOutInput").focus();
      const isInputValidate = checkInput(
        userInputRef.current,
        desireTokenAddress
      );
      if (isInputValidate) {
        setInputAmountIn("");
        handleSwap(userInputRef.current, INPUT_TYPE.OUTPUT);
      } else {
        setInputAmountIn("");
        setPriceUpdate(false);
        setError(defaultErr);
      }
    }
  };

  const onChangeSlippage = (value) => {
    let regex = /^(0|[1-9]|[1-4][0-9]|50|\.\.\d{1,2})($|\.$|\.\d{1,2}$)/gm;
    if (regex.test(value)) {
      if (value === "0") {
        setError(slippageErr);
        setInputSlippage(value);
        return;
      }
      if (
        value === "0." ||
        value === "0.0" ||
        value === "0.1" ||
        value === "0.2" ||
        value === "0.3" ||
        value === "0.4"
      ) {
        setError(slippageErr);
        setInputSlippage("0.");
        return;
      } else {
        setError("");
        setInputSlippage(value);
      }
    } else {
      if (value === "") {
        setError(slippageErr);
        setInputSlippage("");
      }
    }
  };

  const checkInput = (value, tokenAddress) => {
    const isEndDot = checkDotEndText(value);
    const isZeRo = checkCharacterZero(value);
    const isLargeLength = checkLengthDecimal(value, tokenAddress);
    if (!isZeRo && !isLargeLength && !isEndDot) {
      return true;
    } else {
      return false;
    }
  };

  const handleSwap = (value, type) => {
    setInputType(type);
    if (type === INPUT_TYPE.INPUT) {
      setInputAmountIn(value);
    } else {
      setInputAmountOut(value);
    }
  };

  const onChangeSourceInput = useCallback(
    (value) => {
      userInputRef.current = value;
      if (value === "") {
        setInputAmountOut("");
        setInputAmountIn("");
        setPriceUpdate(false);
        setError(defaultErr);
      } else {
        let pattern = /^\d+\.?\d*$/;
        if (pattern.test(value)) {
          if (value === "0" || value === "00" || value === "0.") {
            if (value === "00") {
              setInputAmountIn("0");
            } else {
              setInputAmountIn(value);
            }
            setInputAmountOut("");
            setPriceUpdate(false);
            setError(defaultErr);
          } else {
            const isInputValidate = checkInput(value, sourceTokenAddress);
            if (isInputValidate) {
              handleSwap(value, INPUT_TYPE.INPUT);
            } else {
              setInputAmountIn(value);
              setInputAmountOut("");
              setPriceUpdate(false);
              setError(defaultErr);
            }
          }
        }
      }
    },
    [sourceTokenAddress]
  );

  const onChangeDesireInput = useCallback(
    (value) => {
      userInputRef.current = value;
      if (value === "") {
        setInputAmountIn("");
        setInputAmountOut("");
        setPriceUpdate(false);
        setError(defaultErr);
      } else {
        let pattern = /^\d+\.?\d*$/;
        if (pattern.test(value)) {
          if (value === "0" || value === "00" || value === "0.") {
            if (value === "00") {
              setInputAmountOut("0");
            } else {
              setInputAmountOut(value);
            }
            setInputAmountIn("");
            setPriceUpdate(false);
            setError(defaultErr);
          } else {
            const isInputValidate = checkInput(value, desireTokenAddress);
            if (isInputValidate) {
              handleSwap(value, INPUT_TYPE.OUTPUT);
            } else {
              setInputAmountOut(value);
              setInputAmountIn("");
              setPriceUpdate(false);
              setError(defaultErr);
            }
          }
        }
      }
    },
    [desireTokenAddress]
  );

  /* Effect */
  useEffect(() => {
    if (isBalanceAvailable) {
      if (inputAmountIn === "") {
        setError(defaultErr);
      } else {
        const isInputValidate = checkInput(inputAmountIn, sourceTokenAddress);
        if (!isInputValidate) return;
        setError("");
        poolErrRef.current = "";
      }
    } else {
      setError(`Insufficient ${sourceTokenInfo?.assetsSymbol} balance`);
      poolErrRef.current = `Insufficient ${sourceTokenInfo?.assetsSymbol} balance`;
    }
  }, [
    inputAmountIn,
    isBalanceAvailable,
    sourceTokenAddress,
    sourceTokenInfo?.assetsSymbol,
  ]);

  useEffect(() => {
    if (!isDelay && firstLoadFlag) {
      getExchangeRateLoop();
    }
  }, [isDelay]);

  useEffect(() => {
    if (!firstLoadFlag) {
      dispatch(
        checkAssetExistsPools({
          tokenAInfo: sourceTokenInfo,
          tokenBInfo: desireTokenInfo,
        })
      )
        .unwrap()
        .then((originalPromiseResult) => {
          const { emptyAddress, assetsPoolAddress } = originalPromiseResult;
          poolAddressRef.current = assetsPoolAddress;
          if (!emptyAddress) {
            getExchangeRateLoop();
          }
        })
        .catch((rejectedValueOrSerializedError) => {});
      setFirstLoadFlag(!firstLoadFlag);
    }
  }, []);

  useEffect(() => {
    onCheckApproveToken();
  }, [sourceTokenInfo, account, onCheckApproveToken]);

  useEffect(() => {
    if (bestTrade) {
      if (poolErrRef.current === insufficientErr) {
        setError("");
        poolErrRef.current = "";
      }
      const isUnwrap =
        tokens[INPUT_TYPE.INPUT]?.equals(WVET[chainId]) &&
        tokens[INPUT_TYPE.OUTPUT]?.equals(DUMMY_VET[chainId]);
      const isWrap =
        tokens[INPUT_TYPE.INPUT]?.equals(DUMMY_VET[chainId]) &&
        tokens[INPUT_TYPE.OUTPUT]?.equals(WVET[chainId]);
      const decimals = isUnwrap || isWrap ? 100 : 6;

      let symbolPath = bestTrade.route.path.map((item) => {
        return item.symbol;
      });
      setNamePool(
        symbolPath.length === 2 ? "VeBank Pool" : symbolPath.join(" > ")
      );

      if (inputType === INPUT_TYPE.OUTPUT) {
        const amountInResult =
          parsedAmounts[INPUT_TYPE.INPUT].toSignificant(decimals);
        setInputAmountIn(amountInResult);
      } else {
        const amountOutResult =
          parsedAmounts[INPUT_TYPE.OUTPUT].toSignificant(decimals);
        setInputAmountOut(amountOutResult);
      }
    } else {
      const isInputValidate = checkInput(
        inputType === INPUT_TYPE.INPUT ? inputAmountIn : inputAmountOut,
        inputType === INPUT_TYPE.INPUT ? sourceTokenAddress : desireTokenAddress
      );
      if (isInputValidate) {
        if (inputType === INPUT_TYPE.INPUT) {
          setInputAmountOut("");
        } else {
          setInputAmountIn("");
        }
        setError(insufficientErr);
        poolErrRef.current = insufficientErr;
      }
    }
  }, [bestTrade, inputAmountIn, inputAmountOut]);

  return {
    error,
    account,
    isSwitch,
    namePool,
    poolErrRef,
    loadingFee,
    priceUpdate,
    poolAddress,
    loadingSwap,
    vthoBalance,
    amountOutMin,
    emptyAddress,
    userInputRef,
    inputSlippage,
    inputAmountIn,
    showDetailInfo,
    accountApprove,
    loadingApprove,
    onApproveToken,
    inputAmountOut,
    exchangeRateAB,
    exchangeRateBA,
    sourceTokenInfo,
    desireTokenInfo,
    setInputSlippage,
    setInputAmountIn,
    onShowDetailInfo,
    onChangeSlippage,
    onSwapAssetToken,
    sourceTokenPrice,
    desireTokenPrice,
    sourceTokenAmount,
    desireTokenAmount,
    setInputAmountOut,
    onSwapDesireToken,
    sourceTokenAddress,
    desireTokenAddress,
    sourceTokenBalance,
    desireTokenBalance,
    onChangeSourceInput,
    onChangeDesireInput,
    loadingExchangeRate,
    onUpdatePriceChange,
    onSwitchExchangeRate,
    priceImpactWithoutFee,
    onShowModalSelectToken,
    onCheckExchangeRatePool,
    sourcePerDesireTokenPrice,
    pricePaidPerA: exchangeRate?.pricePaidPerA,
    pricePaidPerB: exchangeRate?.pricePaidPerB,
    realizedLPFee: realizedLPFee ? realizedLPFee.toSignificant(4) : "-",
  };
};

export default useSwapFacade;
