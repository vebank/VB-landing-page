import React from 'react';
import IcSearch from "../../assets/images/ic_search.png";

const FormSearchFarm = () => {
    return (

        <div className='flex flex-row-reverse flex-auto items-center flex-initial w-full'>

            <div className="hidden lg:flex flex-row bg-gradient-search rounded-lg ml-8 py-2 px-4 ra justify-between md:hidden lg:w-80 xl:w-96">
                <input
                    className="bg-transparent focus:outline-none placeholder-slate-300 font-poppins appearance-none text-sm w-full"
                    type="text"
                    placeholder={"Search by token"}
                />
                <img
                    alt="search_icon"
                    src={IcSearch}
                    className="ml-1 object-contain"
                />
            </div>

        </div>
    )
};

export default FormSearchFarm;
