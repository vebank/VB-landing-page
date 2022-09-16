import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
SwiperCore.use([Navigation]);
const MENU_LINKS = [
  {
    name: "Trade",
    path: "/trade",
    sub: [
      {
        name: "Swap",
        path: "/swap",
      },
      {
        name: "Liquidity",
        path: "/liquidity",
      }
    ]
  },
  {
    name: "Lend",
    path: "/markets",
  },
  {
    name: "Pool",
    path: "/pool",
  },
  {
    name: "Stake",
    path: "/stake",
  },
  {
    name: "Farm",
    path: "/farm",
  },
  {
    name: "Launch",
    path: "/launchpad",
    sub: [
      {
        name: "Launchpad",
        path: "/launchpad",
      },
      {
        name: "My Launches",
        path: "/mylaunches",
      }
    ]
  },
];
const MENU_SUB_launch = [
  {
    name: "Launchpad",
    path: "/launchpad",
  },
  {
    name: "My Launches",
    path: "/mylaunches",
  }]
const MENU_SUB_trade = [
  {
    name: "Swap",
    path: "/swap",
  },
  {
    name: "Liquidity",
    path: "/liquidity",
  }]
const MenuLink = ({ menuToggleHandler, setIsNavOpen }) => {
  const location = useLocation();
  const [activeMenu, setactiveMenu] = useState("");
  const [isMenuHover, setOnMenuHover] = useState(false);
  const [islaunchMenuHover, setOnlaunchMenuHover] = useState(false);

  const onMouseOver = (_) => {
    if (!isMenuHover) setOnMenuHover(true);
  };

  const onMouseOut = (_) => {
    if (isMenuHover) {
      setOnMenuHover(false);
    }

  };
  const onMouselaunchOver = (_) => {
    if (!islaunchMenuHover) setOnlaunchMenuHover(true);
  };

  const onMouselaunchOut = (_) => {
    if (islaunchMenuHover) {
      setOnlaunchMenuHover(false);
    }
  };
  const navBarMenuEvent = (item) => () => {
    setactiveMenu(item.name)
    if(item.name !== "Launch" && item.name !== "Trade"){
      setIsNavOpen(false)}
  };
  const mapArrayitem = (item, index) => (
    <li
      key={index}
      className="flex items-center h-24 md:h-full p-8 md:p-0"
    >
      <NavLink
        to={item.path}
        onClick={navBarMenuEvent(item)}
        className={`${item.path === location?.pathname ? "text-linear" : ""} px-6 font-bold text-base text-gray-300 hover:brightness-150`}
      >
        {item.name}
      </NavLink>
    </li>
  )
  const checkMenuActive = (item) => {

    if (item.name === "Lend" && (location?.pathname === "/markets")) {
      return true;
    }

    if (item.name === "Pool" && (location?.pathname === "/pool")) {
      return true;
    }

    if (item.name === "Stake" && (location?.pathname === "/stake")) {
      return true;
    }

    if (item.name === "Farm" && (location?.pathname === "/farm")) {
      return true;
    }

    if (item.name === "Trade" && (location?.pathname === "/swap" || location?.pathname === "/liquidity")) {
      return true;
    }
    if (item.name === "Launch" && (location?.pathname === "/launchpad" || location?.pathname === "/mylaunches")) {
      return true;
    }

  };
  return (
    <>
      {/* // <ul className="flex flex-col items-center justify-between "> */}
      {!menuToggleHandler ? (
        <ul
          className="box-menus flex flex-col md:flex-row items-center justify-center md:space-x-2 lg:space-x-4 font-semibold"
          style={{ marginTop: "0px", marginBottom: "0px", height: "100%" }}
        >
          {MENU_LINKS.map((item, index) => (
            <li
              key={index}
              className="flex items-center h-24 md:h-full p-8 md:p-0"
              onMouseOver={(item.name === "Trade" ? onMouseOver : undefined || item.name === "Launch" ? onMouselaunchOver : undefined)}
              onMouseLeave={(item.name === "Trade" ? onMouseOut : undefined || item.name === "Launch" ? onMouselaunchOut : undefined)}

            >
              <NavLink
                to={item.path}
                className={`${checkMenuActive(item) ? "text-linear" : ""} px-6 font-bold text-base text-gray-300 hover:brightness-150`}
              >
                {item.name}
              </NavLink>
              {item.name === "Trade" && isMenuHover && !menuToggleHandler && (
                item?.sub &&
                <div
                  className="navbar-sub-menu absolute w-full col text-base justify-center items-start top-16 md:w-[160px] p-4 md:p-0 rounded-lg z-50"
                >
                  {item?.sub.map((subItem, index) => {
                    return (
                      <NavLink
                        key={index}
                        to={subItem.path}
                        className={`${subItem.path === location?.pathname ? "text-linear" : ""} block px-6 py-2 font-bold text-base text-gray-300 hover:brightness-150 hover:text-linear`}
                      >
                        {subItem.name}
                      </NavLink>
                    )
                  })}
                </div>
              )}
              {item.name === "Launch" && islaunchMenuHover && !menuToggleHandler && (
                item?.sub &&
                <div
                  className="navbar-sub-menu absolute w-full col text-base justify-center items-start top-16 md:w-[160px] p-4 md:p-0 rounded-lg z-50"
                >
                  {item?.sub.map((subItem, index) => {
                    return (
                      <NavLink
                        key={index}
                        to={subItem.path}
                        className={`${subItem.path === location?.pathname ? "text-linear" : ""} block px-6 py-2 font-bold text-base text-gray-300 hover:brightness-150 hover:text-linear`}
                      >
                        {subItem.name}
                      </NavLink>
                    )
                  })}
                </div>
              )}
              {/* {item.name === "Launch" && islaunchMenuHover &&  (
            <div
              className="navbar-sub-menu absolute w-full col text-sm justify-center items-start top-16 md:w-[160px] p-4 md:p-0 rounded-lg z-50"
            >
              <NavLink
                to="/launchpad"
                className={`block px-6 py-2 font-bold text-sm text-gray-300 hover:brightness-150 ${
                  islaunchMenuHover ? "text-linear" : ""
                }`}
              >
                Launchpad
              </NavLink>
              <NavLink
                to="/launchpad#mylaunches"
                className={`block px-6 py-2 font-bold text-sm text-gray-300 hover:brightness-150 ${
                  islaunchMenuHover ? "text-linear" : ""
                }`}
              >
                My Launches
              </NavLink>
            </div>
          )} */}
            </li>

          ))}
        </ul>
      ) : (

        <div className="w-full flex-col justify-center">
          <Swiper
            effect={"fade"}
            grabCursor={true}
            centeredSlides={true}
            allowTouchMove={false}
            pagination={false}
            autoplay={false}
            slidesPerView={1}
            navigation={{
              nextEl: ".next",
              prevEl: ".prev"
            }}
            className="mySwiper"
          >


            <SwiperSlide>
              <div className="flex justify-center items-center h-full">
                <ul
                  className="box-menus flex flex-col md:flex-row items-center justify-center md:space-x-2 lg:space-x-4 font-semibold"
                  style={{ marginTop: "0px", marginBottom: "0px", height: "100%" }}
                >
                  {MENU_LINKS.map((item, index) => (
                    <li
                      key={index}
                      className={`${item.name === "Launch" || item.name === "Trade" ? "next" : ""}  flex items-center h-24 md:h-full p-8 md:p-0 `}
                      onClick={navBarMenuEvent(item)}
                    >
                      <NavLink
                        to={item.path}
                        className={`${checkMenuActive(item) ? "text-linear" : ""} px-6 font-bold text-base text-gray-300 hover:brightness-150`}
                      >
                        {item.name}
                      </NavLink>
                    </li>

                  ))}
                </ul>
              </div>

            </SwiperSlide>

            <SwiperSlide className="w-full">
              <div className="flex justify-center items-center h-full">
                <ul
                  className="box-menus flex flex-col md:flex-row items-center justify-center md:space-x-2 lg:space-x-4 font-semibold"
                  style={{ marginTop: "0px", marginBottom: "0px", height: "100%" }}
                >
                  <div className="prev text-[#4B5C86]">Back</div>
                  {activeMenu === "Launch" && MENU_SUB_launch.map(mapArrayitem)}
                  {activeMenu === "Trade" && MENU_SUB_trade.map(mapArrayitem)}
                  <div></div>
                </ul>
              </div>
            </SwiperSlide>

          </Swiper>
        </div>
      )}
    </>
  );
};

export default MenuLink;
