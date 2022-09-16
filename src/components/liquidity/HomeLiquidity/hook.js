import { useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as actions from "../../../actions";
import RouteName from "../../../constants/routeName.constants";
import {
  selectAllAddresses,
  selectUserAddedPoolsAddresses,
  selectIsLoadingPoolAddresses,
} from "../../../reducers/userAssetPools.reducer";
import { selectAccount, selectWeb3 } from "../../../reducers/web3.reducer";

const useLiquidityFacade = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const web3 = useSelector(selectWeb3);
  const account = useSelector(selectAccount);
  const poolAddresses = useSelector(selectAllAddresses);
  const userPoolAddresses = useSelector(selectUserAddedPoolsAddresses);
  const isLoadingPools = useSelector(selectIsLoadingPoolAddresses);

  useEffect(() => fetchPoolAssets(), [account]);

  const addLiquidity = () => {
    navigate(RouteName.ADD_LIQUIDITY);
  };

  const onFindOtherLPClicked = () => navigate(RouteName.POOL);

  async function fetchPoolAssets() {
    await dispatch(actions.fetchPairs());
  }

  return {
    poolAddresses,
    userPoolAddresses,
    isLoadingPools,
    addLiquidity,
    onFindOtherLPClicked,
  };
};

export default useLiquidityFacade;
