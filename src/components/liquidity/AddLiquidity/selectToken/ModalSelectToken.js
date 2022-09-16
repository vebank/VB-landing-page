import { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import "../styles.scss";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { numberWithCommas } from "../../../../utils/lib";
import IcQuestionOutline from "../../../../assets/images/buttons/ic_question_outline.svg";
import IcCloseWhite from "../../../../assets/images/buttons/ic_close.svg";
import IcSortBalance from "../../../../assets/images/sort_balance.svg";
import IcSortBalanceLowest from "../../../../assets/images/sort_balance_lowest.svg";

import * as actions from "../../../../actions";
import {
  selectOpenChooseTokenState,
  selectTokenSelecting,
  selectFirstToken,
  selectSecondToken,
} from "../../../../reducers/liquid.reducer";
import SearchBar from "../../../partials/SearchBar";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import GradientStrokeWrapper from "../../../partials/GradientStrokeWrapper";
import {
  selectBalancesIds,
  selectUserAssetsBalance,
  selectUserAssetsBalanceSortLowest,
} from "../../../../reducers/accountBalance.reducer";
import AssetExcerpt from "./AssetExcerpt";
import PopularTokens from "./PopularTokens";

const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -30%)",
    background: "#182233",
    borderWidth: "0px",
    borderRadius: "1rem",
    // borderColor: "#3EE8FF",
    padding: "2.5rem",
    width: "450px",
    position: "relative",
  },
};

const ModalSelectToken = () => {
  const isSelectTokenModalOpen = useSelector(selectOpenChooseTokenState);
  const firstToken = useSelector(selectFirstToken);
  const secondToken = useSelector(selectSecondToken);
  const tokenName = useSelector(selectTokenSelecting);
  const assetAddressList = useSelector(selectUserAssetsBalance);
  const assetListSortLowest = useSelector(
    selectUserAssetsBalanceSortLowest,
    shallowEqual
  );
  const assetAddressPopular = [
    { id: "0xe88c871CEA576DdD59FA91a744Eb6C6d5b93AB40" },
    { id: "0xA00fe119Efa9d8F7Ef00aD16b4D702e6a5F6CB6A" },
    { id: "0x0000000000000000000000000000456E65726779" },
    { id: "0x033BBC923A9378600C6b52Fa9aADA608c4cC7ECE" },
  ];
  // const assetPriceList = useSelector(selectAssetPrice, shallowEqual);

  const dispatch = useDispatch();

  useEffect(() => fetchUserAssets(), []);

  const fetchUserAssets = async () => {
    // await dispatch(actions.getCurrentAssets());
    // await dispatch(actions.fetchAccountInit());
  };

  const closeModal = () => {
    onSearchValueChange("");
    setSort(false);
    dispatch(actions.closeSelectToken());
  };
  const handlerStepToStep = (e) => {};

  const onTokenSelected = useCallback(
    async (tokenData) => {
      await dispatch(actions.selectToken(tokenData));
      dispatch(actions.loadDetailAddLiquidity());
    },
    [dispatch]
  );

  const [searchValue, setSearchValue] = useState("");
  const [assetAddressFilter, setAssetAddressFilter] =
    useState(assetAddressList);
  const [sort, setSort] = useState(false);

  const onSearchValueChange = (value) => {
    setSearchValue(value);
    setFilterData(assetAddressList, value);
  };

  const setFilterData = (dataList, searchKey) => {
    setAssetAddressFilter(
      dataList.filter((item) => {
        if (item.assetsSymbol.includes(searchKey.toUpperCase())) {
          return true;
        }
        return false;
      })
    );
  };

  useEffect(() => {
    if (sort) {
      setFilterData(assetListSortLowest, searchValue);
    } else {
      setFilterData(assetAddressList, searchValue);
    }
  }, [sort, searchValue, assetAddressList, assetListSortLowest]);

  return (
    <Modal
      isOpen={isSelectTokenModalOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      style={customStyles}
      className="add-liquid-list-select-token"
      overlayClassName="vb-modal-overlay"
    >
      <GradientStrokeWrapper className="-z-50" borderRadius="1rem" />
      <div className="header flex flex-row justify-between">
        <span className="font-poppins_bold text-xl text-white">
          Select a token
        </span>
        <img
          alt=""
          src={IcCloseWhite}
          className="cursor-pointer"
          onClick={closeModal}
        />
      </div>

      <div className="content-modal mt-6">
        {/* STEP 1 */}
        <SearchBar
          searchValue={searchValue}
          onSearchValueChange={onSearchValueChange}
        />
        <div className="flex flex-row space-x-2 items-center mt-8">
          <p className="font-poppins_semi_bold text-base text-white">
            Popular tokens
          </p>
          {/* <img src={IcQuestionOutline} alt="" className="w-4 h-4" /> */}
        </div>

        <div className="flex flex-row items-center justify-between space-x-3 mt-[20px]">
          {assetAddressPopular.map((item) => (
            <PopularTokens
              key={item.id}
              id={item.id}
              onTokenSelected={onTokenSelected}
            />
          ))}
        </div>

        <div className="flex flex-row w-full justify-between my-6">
          <span className="font-poppins_semi_bold text-base text-white">
            Token name
          </span>
          <div className="flex items-center space-x-2">
            <span className="font-poppins_semi_bold text-base text-white">
              Balance
            </span>
            <img
              src={sort ? IcSortBalanceLowest : IcSortBalance}
              onClick={() => setSort(!sort)}
              className="cursor-pointer"
              alt="search_icon"
            />
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto pb-4">
          {assetAddressFilter &&
            assetAddressFilter.length > 0 &&
            assetAddressFilter.map((assetAddress) => (
              <AssetExcerpt
                key={assetAddress.assetsAddress}
                id={assetAddress.assetsAddress}
                onTokenSelected={onTokenSelected}
                nameToken={tokenName}
                sourceToken={firstToken}
                desireToken={secondToken}
              />
            ))}
        </div>
      </div>

      {/* <div className="footer-modal mt-8">
        <button
          onClick={(e) => {
            handlerStepToStep(e);
          }}
          className={"w-full h-12 text-[#22D4EC] text-lg font-poppins_medium"}
        >
          Manage Tokens
        </button>
      </div> */}
    </Modal>
  );
};

export default ModalSelectToken;
