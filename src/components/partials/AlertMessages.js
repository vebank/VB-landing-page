import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { randomKeyUUID } from "../../utils/lib";

import AlertCustom from "./AlertCustom";

const contextClass = {
  success: "bg-popupVb",
  error: "bg-popupVb",
  info: "bg-popupVb",
  warning: "bg-popupVb",
  loading: "bg-popupVb",
  update: "bg-popupVb",
  default: "bg-popupVb",
  dark: "bg-popupVb",
};

const AlertMessages = () => {

  const alert = useSelector((state) => state.alert);

  const getItemAlert  = (item) =>{
    const key = item.key || randomKeyUUID();
    
    const option = {
      toastId: key,
      type: item.message.status ? item.message.status : item.type,
      render:  <AlertCustom dataItem={item} key={key} status={ item.message.status ? item.message.status : item.type} />,
      isLoading: false,
      autoClose: item.duration || item.type === "loading"
    }

    switch (alert.type) {
      case "error":
        toast.error(option.render, option);
        break;
      case "warning":
        toast.warning(option.render, option);
        break;
      case "success":
        toast.success(option.render, option);
        break;
      case "loading":
        toast.loading(option.render, {
          ...option,
          autoClose:false,
          isLoading: true
        });
        break;
      case "update":
        toast.update(key, option);
        break;
      default:
        break;
    }

  }

  useEffect(() => {
    if (alert && alert.type) {
      getItemAlert(alert);
    }
  }, [alert]);

  return (
    <ToastContainer
      toastClassName={({ type }) =>
        contextClass[type || "default"] +
        ` relative flex px-4 py-4 border-2 border-solid ${
          type === "warning" ? "border-notiWarning" : "border-notiSuccess"
        } rounded-md justify-between overflow-hidden cursor-pointer`
      }
      position={toast.POSITION.BOTTOM_RIGHT}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      icon={false}
      closeButton={false}
    />
  );
};

export default AlertMessages;