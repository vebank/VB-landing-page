import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BtnOpenAddLiquidity = ({ item }) => {

  const btnLabel = "Add Liquidity";

  const navigate = useNavigate();

  const [hasAdded, setHasAdded] = useState(false);

  const handlerOpenModal = async () => {
    navigate("/liquidity-add");
  };

  return (
    <>
      {hasAdded ? (
        <button
          className="btn-veb h-10 bg-btn-veb-disabled border-[1px] border-[#4B5C86]"
          disabled={hasAdded}
          type="submit"
        >
          {btnLabel}
        </button>
      ) : (
        <button
          onClick={(e) => handlerOpenModal(e)}
          className="btn-veb text-base h-12"
          type="submit"
        >
          {btnLabel}
        </button>
      )}
    </>
  );
};

export default BtnOpenAddLiquidity;
