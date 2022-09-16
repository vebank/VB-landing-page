import React, {useEffect, useState} from 'react';
import {NavLink, useLocation} from "react-router-dom";
import IcChevronRight from "../../assets/images/ic_chevron_right.svg";
import LaunchPadItem1 from "../../assets/images/launchpad/launchpad_item_1.jpg";
import LaunchPadItem2 from "../../assets/images/launchpad/launchpad_item_2.jpg";
import LaunchPadItem3 from "../../assets/images/launchpad/launchpad_item_3.jpg";

const LaunchPadItems = () => {
    const location = useLocation();
    const [keyHash, setKeyHash] = useState("#rising");

    useEffect(() => {
        if (["#upcoming", "#rising", "#completed"].includes(location.hash)) {
            setKeyHash(location.hash);
        } else {
            setKeyHash("#rising");
        }
    }, [location]);

    return (
        <div className="w-4/5 pt-5">
            <div className="flex justify-between">
                <div className="launchpad-filter-tab rounded-full">

                    <NavLink
                        className={({isActive}) => (keyHash === "#rising" && isActive ? 'active' : 'inactive')}
                        key={"launchpad-rising"}
                        to="/launchpad#rising"
                    >
                        Rising
                    </NavLink>

                    <NavLink
                        className={({isActive}) => (keyHash === "#upcoming" && isActive ? 'active' : 'inactive')}
                        key={"launchpad-upcoming"}
                        to="/launchpad#upcoming"
                    >
                        Upcoming
                    </NavLink>

                    <NavLink
                        className={({isActive}) => (keyHash === "#completed" && isActive ? 'active' : 'inactive')}
                        key={"launchpad-completed"}
                        to="/launchpad#completed"
                    >
                        Completed
                    </NavLink>

                </div>
                <div className="w-1/4 flex justify-end items-center space-x-2 cursor-pointer">
                    <p>Explore All </p>
                    <img className="h-5" src={IcChevronRight} alt=""/>
                </div>
            </div>

            <div className="flex justify-start pt-5 space-x-5">
                <div className="w-1/3">
                    <img className="rounded-xl" src={LaunchPadItem1} alt=""/>
                </div>
                <div className="w-1/3">
                    <img className="rounded-xl" src={LaunchPadItem2} alt=""/>
                </div>
                <div className="w-1/3">
                    <img className="rounded-xl" src={LaunchPadItem3} alt=""/>
                </div>
            </div>
        </div>
    );
};

export default LaunchPadItems;
