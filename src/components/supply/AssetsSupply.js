import IcCheckList from "../../assets/images/ic_checklist.svg";
import IcWarning from "../../assets/images/ic-warning-circle.svg";
import BtnOpenSupply from "./BtnOpenBorrow";

const AssetsSupply = () => {
  return (
    <div className="w-full min-h-max rounded-lg bg-[#141432] mt-16 p-10 fade-in-box">
      <h4 className="font-poppins text-[30px] leading-9">Assets to supply</h4>

      <div className="p-3 mt-5">
        <div className="p-2 flex flex-row justify-start items-center space-x-4 w-full text-right cursor-pointer bg-[#1B1A43]">
          <div className="block">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={true}
                className="w-4 h-4 border-0 focus:ring-0"
              />
              <span className="ml-4 font-poppins text-base leading-6">
                Show assets with 0 balance
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="tbl-veb mt-8">
        <div className="grid grid-cols-5 gap-5 justify-items-center content-around">
          <div className="px-4 py-2">Assets</div>
          <div className="px-4 py-2">Wallet balance</div>
          <div className="px-4 py-2">APY</div>
          <div className="px-4 py-2">Can be collateral</div>
          <div></div>
        </div>

        <div className="grid grid-cols-5 gap-5 mt-6 bg-[#1B1A43] justify-items-center content-around font-poppins text-lg">
          <div className="p-2 flex flex-row justify-center items-center space-x-4 w-full text-right cursor-pointer">
            <img
              className="w-6 h-6"
              src="https://s3-alpha-sig.figma.com/img/63b8/0ba4/e17d8cf47adbdc845047e5c2eba0e8e5?Expires=1651449600&Signature=HZ7riBcgpeAWRTg6o1deCxabVzsv81yaab2vUaSJFu92d5SC65trDhN13ZZcTLLSPdqWc-PTUqm-zqn3HR-VRKtAabwvCy~TdwE43i7Gey0TahfHcpN~jg06E6ijdhjpYWMshhypo4vQBKG7Dwsc~~Aj4zjba7daY8YXiU7AH0mqawmWUxHCkQx5fxSEZv3yjc1uPx04UuKDJkX-tavOTATp8OvW0DY7gyNDo8bSGGtyvIL--QYIM7eNcugYVjUz5NInom2mwJUF-i6RL2X-IhXAbn-uLfpOKfR2qxGxV1qA5Kp8TCcGfSj7IHvV-wF6LpZjOIPcOBSDTBmQ~OnheA__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"
            />
            <span className="text-lg font-semibold w-12 text-left">VET</span>
          </div>

          <div className="p-2 flex justify-center items-center font-semibold">
            0.05
          </div>
          <div className="p-2 flex flex-col justify-center items-center content-center">
            <div className="text-lg font-semibold">4.03 %</div>
          </div>
          <div className="p-2 flex justify-center items-center font-semibold">
            <img src={IcCheckList} className="w-6 h-16" />
          </div>
          <div className="p-2 flex justify-center items-center">
            <BtnOpenSupply id={"VET"} />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-5 mt-6 bg-[#1B1A43] justify-items-center content-around font-poppins text-lg">
          <div className="p-2 flex flex-row justify-center items-center space-x-4 w-full text-right cursor-pointer">
            <img
              className="w-6 h-6"
              src="https://s3-alpha-sig.figma.com/img/61ea/9ddb/59d8a613c5c74e77b86fe65c5e4283f4?Expires=1651449600&Signature=Q3cCCT0kHQY7qsMZCmU~Mb13iiQ90Y12b2cxR~sirNRyUY2W0IsVSCS5owd6oboEKEEB~55PJwMTOUGv2gBatmwyrwTtA-~bbJ5i3053fcr8L5KSSglwjQUhZ02e0FwBN5~L3gzJLh0J~219sF1JL5VJ5yg8hxiPyhjPXutRBeiVMzPWTaZ7xoW7YQOVIpJm~l6zNGuq1mU4l0W0humOMJuXQZAHNd1aw15JWKD3s3jBp19r58Q4D1f-Gq~kSIGOq40TW~mmBfGnsPDOP-FPLvUs72GzRSNv9QWor7r1J4deY2OCFB5W2q2eot-RE1xOhbItU-z7m817MNHH0~BkGQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"
            />
            <span className="text-lg font-semibold w-12 text-left">FEI</span>
          </div>

          <div className="p-2 flex justify-center items-center font-semibold">
            0.05
          </div>
          <div className="p-2 flex flex-col justify-center items-center content-center">
            <div className="text-lg font-semibold">4.03 %</div>
          </div>
          <div className="p-2 flex justify-center items-center font-semibold">
            -
          </div>
          <div className="p-2 flex justify-center items-center">
            <BtnOpenSupply id={"FEI"} />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-5 mt-6 bg-[#1B1A43] justify-items-center content-around font-poppins text-lg">
          <div className="p-2 flex flex-row justify-center items-center space-x-4 w-full text-right cursor-pointer">
            <img
              className="w-6 h-6"
              src="https://s3-alpha-sig.figma.com/img/6b7f/ca37/00c4e43540a3ed6937b4dba531ba994e?Expires=1651449600&Signature=ZMKNm4wo9RepLhKSCIUro~nUoCccH4Hh0BIzttdTMB03kpgz1vrO~xwqv6mdWekzPP-VjizZQmRN6RPYYA81QyJk7LutX56AcSJrT6hVNZLMoKBq5vL6Q2FCJEPzILAxY~WEt0aVWLReYPVQXyXqvsiXIRA6RFTEGNDcwurC34UZ2KQwhj8xmKpfarx94SxdUmD9PLzNVO4LcPXFywkhnQsgyu4Qb9cxQ5eSWWRNdmejg2OzMEkXu6Qe-dGkw0Lf7XUX~vWlxaPL8GV4HmVEW1c4ds5lAlUGTcKSlvkOdWbXv42r73rKPwLlAC-HOqvDX1XOY59TFMcmAwfyM~LFCg__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"
            />
            <span className="text-lg font-semibold w-12 text-left">Aave</span>
          </div>

          <div className="p-2 flex justify-center items-center font-semibold">
            0.05
          </div>
          <div className="p-2 flex flex-col justify-center items-center content-center">
            <div className="text-lg font-semibold">4.03 %</div>
          </div>
          <div className="p-2 flex justify-center items-center font-semibold">
            <img src={IcCheckList} className="w-6 h-16" />
          </div>
          <div className="p-2 flex justify-center items-center">
            <BtnOpenSupply id={"Aave"} />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-5 mt-6 bg-[#1B1A43] justify-items-center content-around font-poppins text-lg">
          <div className="p-2 flex flex-row justify-center items-center space-x-4 w-full text-right cursor-pointer">
            <img
              className="w-6 h-6"
              src="https://s3-alpha-sig.figma.com/img/56c8/724e/949d7ca0f95e1529ac216ded7709b26e?Expires=1651449600&Signature=Q8sFQCPy09MWc4M3~JxZmB48HandM8xjcXhiSO5KGPFoS9PNe3tBlWmwtfSD3fGGiZq7AIsug3bRo6ivuXchg-l9hz33Odhtp0iGkW0tekmQOX43~cQ5ggN9aBGe2a6td476X~ghL4q8AHBkagP3J8gdkddCJFuT16225BE5Y51gkCEm76XlgcV-uEFXyfOjgN6GEQbEGXxudsIpoVzWggeOlLG-u0x706nURXUYg86t6YCIQCDnyAvZ4QFqaK8jZiUonLRbBsvt9xqjOD9L0Eo~c6cmIyaq47z1oY91J6mtpVGDbwmPBXzRP2YntVLc9vqTzIpXMFl5O2mUCxRKDA__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"
            />
            <span className="text-lg font-semibold w-12 text-left">USDP</span>
          </div>

          <div className="p-2 flex justify-center items-center font-semibold">
            0.05
          </div>
          <div className="p-2 flex flex-col justify-center items-center content-center">
            <div className="text-lg font-semibold">4.03 %</div>
          </div>
          <div className="p-2 flex justify-center items-center">
            <img src={IcCheckList} className="w-6 h-16" />
          </div>
          <div className="p-2 flex justify-center items-center">
            <BtnOpenSupply id={"USDP"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsSupply;
