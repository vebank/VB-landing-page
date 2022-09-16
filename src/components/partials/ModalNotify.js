import Modal from "react-modal";
import { useLayoutEffect, useState } from "react";
import { useEffect } from "react";
const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "460px",
    transform: "translate(-50%, -30%)",
    background: "#182233",
    borderWidth: "1px",
    borderRadius: "16px",
    borderColor: "#3EE8FF",
    padding: "2rem",
    position: "relative",
  },
};

const ModalNotify = () => {

  const [notify, setNotify] = useState(false);

  const closeModal = () => {
    setNotify(false);
  };

  useLayoutEffect(() => {
    if(process.env.REACT_APP_ENV === "staging"){
      setNotify(true);
    }
  }, [])

  return (
    <Modal
      isOpen={notify}
      onRequestClose={closeModal}
      ariaHideApp={false}
      style={customStyles}
      overlayClassName="vb-modal-overlay"
    >
      <div className="flex flex-col justify-center items-center space-y-8">
        <span className="ont-poppins_bold text-white text-lg">
          Notification
        </span>
        <span className="text-white text-base">
          VeBank Team is internal testing from August 11.
        </span>
        <button
          className="font-poppins_semi_bold text-white w-full py-4 rounded-lg bg-gradient-to-r from-[#0FE3E3] to-[#02A4FF]"
          onClick={closeModal}
        >
          OK
        </button>
      </div>
    </Modal>
  );
};

export default ModalNotify;
