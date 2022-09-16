import Modal from "react-modal";
import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import {
  closeModalSelectToken,
  selectDesireToken,
  selectDesireTokenFromModal,
  selectNameTokenState,
  selectOpenChooseTokenState,
  selectSourceToken,
  selectSourceTokenFromModal,
  swapTokenDesire,
} from "../../reducers/swap.reducer";
import {
  selectUserAssetsBalance,
  selectUserAssetsBalanceSortLowest,
} from "../../reducers/accountBalance.reducer";

import SearchBar from "../partials/SearchBar";
import { marketplaceConstants, swapConstants } from "../../constants";
import { iconsModalSelectToken } from "../../assets";
import GradientStrokeWrapper from "../partials/GradientStrokeWrapper";
import AssetExcerpt from "../liquidity/AddLiquidity/selectToken/AssetExcerpt";

import IcSortBalance from "../../assets/images/sort_balance.svg";
import IcSortBalanceLowest from "../../assets/images/sort_balance_lowest.svg";
import { isAddress } from "ethers/lib/utils";
import {
  useToken,
  serializeToken,
  useFetchTokenByAddress,
  assetToken,
} from "../../hooks/TokensHook";
import * as actions from "../../actions";
import AssetAdd from "./AssetAdd";

const customStyles = {
  content: {
    top: "40%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -30%)",
    background: "#182233",
    borderWidth: "0px",
    borderRadius: "1rem",
    padding: "2.5rem",
    position: "absolute",
  },
};

const ModalSelectToken = () => {
  const dispatch = useDispatch();
  const nameToken = useSelector(selectNameTokenState);
  const isSelectTokenModalOpen = useSelector(selectOpenChooseTokenState);

  const sourceTokenAddress = useSelector(selectSourceToken);
  const desireTokenAddress = useSelector(selectDesireToken);

  const fetchTokenByAddress = useFetchTokenByAddress();

  const assetListSortHightest = useSelector(
    selectUserAssetsBalance,
    shallowEqual
  );
  const assetListSortLowest = useSelector(
    selectUserAssetsBalanceSortLowest,
    shallowEqual
  );

  const closeModal = () => {
    onSearchValueChange("");
    setSort(false);
    dispatch(closeModalSelectToken());
  };

  const [assetAddressFilter, setAssetAddressFilter] = useState(
    assetListSortHightest
  );
  const [sort, setSort] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [tokenCanAdd, setTokenCanAdd] = useState(null);
  const [importTokenAddress, setImportTokenAddress] = useState("");

  const token = useToken(importTokenAddress);

  const onSearchValueChange = (value) => {
    onFindToken(value);
    setTokenCanAdd(null);
    setSearchValue(value);
    setImportTokenAddress(value);
    setFilterData(assetListSortHightest, value);
  };

  const setFilterData = useCallback((dataList, searchKey) => {
    setAssetAddressFilter(
      dataList.filter(
        (item) =>
          item.assetsSymbol.toLowerCase().includes(searchKey.toLowerCase()) ||
          item.assetsAddress.toLowerCase().includes(searchKey.toLowerCase())
      )
    );
  }, []);

  const onFindToken = useCallback(
    async (searchKey) => {
      const address = isAddress(searchKey);
      if (address && !token) {
        const resultToken = await fetchTokenByAddress(searchKey);
        if (resultToken) {
          setTokenCanAdd(assetToken(resultToken));
        }
      } else {
      }
    },
    [fetchTokenByAddress, token]
  );

  useEffect(() => {
    if (sort) {
      setFilterData(assetListSortLowest, searchValue);
    } else {
      setFilterData(assetListSortHightest, searchValue);
    }
  }, [
    sort,
    searchValue,
    assetListSortHightest,
    assetListSortLowest,
    setFilterData,
  ]);

  const onTokenSelected = useCallback(
    async (tokenData) => {
      if (nameToken === swapConstants.FIRST_TOKEN) {
        await dispatch(
          tokenData !== desireTokenAddress
            ? selectSourceTokenFromModal(tokenData)
            : swapTokenDesire()
        );
      } else {
        await dispatch(
          tokenData !== sourceTokenAddress
            ? selectDesireTokenFromModal(tokenData)
            : swapTokenDesire()
        );
      }
    },
    [desireTokenAddress, dispatch, nameToken, sourceTokenAddress]
  );

  async function addUserToken() {
    fetchTokenByAddress(importTokenAddress).then((token) => {
      const serializedToken = serializeToken(token);
      let tokensAdded =
        JSON.parse(localStorage.getItem(swapConstants.TOKENS_KEY)) || {};
      tokensAdded[serializedToken.address] = serializedToken;
      localStorage.setItem(
        swapConstants.TOKENS_KEY,
        JSON.stringify(tokensAdded)
      );
      dispatch(actions.instantiateNewTokenContracts(serializedToken.address));
      dispatch({ type: marketplaceConstants.ADD_ASSET });
      setImportTokenAddress("");
    });
  }

  return (
    <Modal
      isOpen={isSelectTokenModalOpen}
      ariaHideApp={false}
      style={customStyles}
      portalClassName="modal-veb"
      overlayClassName="vb-modal-overlay"
      className={"sm:w-[450px] w-[350px] h-[560px]"}
    >
      <GradientStrokeWrapper className="-z-50" borderRadius="1rem" />
      <div className="header">
        <p className="text-white text-xl font-poppins_semi_bold">
          Select a token
        </p>
        <img
          alt=""
          src={iconsModalSelectToken.IcCloseWhite}
          className="cursor-pointer"
          onClick={closeModal}
        />
      </div>

      <div className="content-modal mt-12">
        <SearchBar onSearchValueChange={onSearchValueChange} />
        <div className="flex flex-row space-x-2 items-center mt-8 justify-between">
          <p className="font-poppins_medium text-base">Token name</p>
          <button
            className="flex flex-row space-x-2 items-center"
            onClick={() => setSort(!sort)}
          >
            <p className="font-poppins_medium text-base">Balance</p>
            <img
              src={sort ? IcSortBalanceLowest : IcSortBalance}
              alt="short balance"
              className="w-6 h-6"
            />
          </button>
        </div>

        <div className="view_asset flex flex-col max-h-[300px] mt-6 overflow-y-auto">
          {assetAddressFilter &&
            assetAddressFilter.length > 0 &&
            assetAddressFilter.map((item) => (
              <AssetExcerpt
                key={item.assetsAddress}
                id={item.assetsAddress}
                onTokenSelected={onTokenSelected}
                nameToken={nameToken}
                sourceToken={sourceTokenAddress}
                desireToken={desireTokenAddress}
              />
            ))}
          {tokenCanAdd && assetAddressFilter.length === 0 && (
            <AssetAdd tokenAdd={tokenCanAdd} onImportToken={addUserToken} />
          )}
          {!tokenCanAdd && assetAddressFilter.length === 0 && (
            <p className="text-center font-montserrat">No results found.</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalSelectToken;
