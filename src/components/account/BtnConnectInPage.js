import { useState } from "react";
import { useDispatch } from "react-redux";

import * as actions from "../../actions";

const BtnConnectInPage = ({ ...props }) => {

  const [isConnecting, setIsConnecting] = useState(false);
  const dispatch = useDispatch();

  const connectWalletHandler = async () => {
    if (!isConnecting) {
      setIsConnecting(true);
      await dispatch(actions.web3Connect(true))
      .then(() => {
        setIsConnecting(false);
      })
      .catch((e) => {
        setIsConnecting(false);
      });
    }
  };

  return (
    <>
      <button {...props} onClick={connectWalletHandler} type="submit">
        {isConnecting ? "Connecting..." : "Connect to a wallet"}
      </button>
    </>
  );
};

export default BtnConnectInPage;
