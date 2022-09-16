import React, { useEffect, useState } from "react";
import SwiperCore, { Autoplay, EffectCoverflow, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import FlipCard from "./FlipCard";
SwiperCore.use([EffectCoverflow, Pagination, Autoplay]);

const TeamSwiper = ({ cards }) => {
  const [mobileScreen, setMobileScreen] = useState(1);
  const [winWidth, setWinWidth] = useState(window.innerWidth);
  const detectSize = () => {
    setWinWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);
    if (winWidth < 600) {
      setMobileScreen(1);
    } else setMobileScreen("auto");
  }, [winWidth, mobileScreen]);
  return (
    <Swiper
    effect={"fade"}
    grabCursor={true}
    centeredSlides={true}
    // slidesPerView={"auto"}
    loop={true}
    pagination={true}
    autoplay={{ delay: 2000 }}
    spaceBetween={20}
    disableOnInteraction= {false}
    breakpoints={{
      1440: {
        // width: 768,
        slidesPerView: 4,
      },
      1024: {
        // width: 768,
        slidesPerView: 3,
      },
      0: {
        // width: 768,
        slidesPerView: 1  ,
      },
    }}
    className="mySwiper"
  >
      {cards.map((member, index) => {
        return (
          <SwiperSlide key={index}>
            <FlipCard member={member} key={index} />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default TeamSwiper;
