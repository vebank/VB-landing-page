import React from "react";
import SwiperCore, { Autoplay, EffectCoverflow, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";

SwiperCore.use([EffectCoverflow, Pagination, Autoplay]);
// if you want to use array
// const slide_img = [
//   "https://swiperjs.com/demos/images/nature-1.jpg",
//   "https://swiperjs.com/demos/images/nature-2.jpg",
//   "https://swiperjs.com/demos/images/nature-3.jpg",
//   "https://swiperjs.com/demos/images/nature-4.jpg",
//   "https://swiperjs.com/demos/images/nature-5.jpg",
//   "https://swiperjs.com/demos/images/nature-6.jpg",
//   "https://swiperjs.com/demos/images/nature-7.jpg",
//   "https://swiperjs.com/demos/images/nature-8.jpg",
//   "https://swiperjs.com/demos/images/nature-9.jpg",
// ];

const LazyloadImage = ({ val }) => {
  return (
      <Swiper
        effect={"fade"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        loop={true}
        pagination={true}
        autoplay={{ delay: 2000 }}
        breakpoints={{
          768: {
            // width: 768,
            slidesPerView: 1,
          },
        }}
        className="mySwiper"
      >
        {(val.map((img, i) => {
          return (
            <SwiperSlide key={i}>
              <img className="w-full rounded-2xl" src={img} alt="" />
            </SwiperSlide>
          );
        })
        )}
      </Swiper>
  );
};

export default LazyloadImage;