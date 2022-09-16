import React from 'react'
import ImgComingSoon from '../../assets/images/img_coming_soon.jpg';

const ComingSoon = () => {
    return (
       <div className='h-[80vh] md:h-fit flex justify-items-center justify-center items-center bg-[#051625] fade-in-box overflow-hidden'>
         <img className='w-full' src={ImgComingSoon} alt="" />
       </div>
    );
};

export default React.memo(ComingSoon);