import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const FarmTab = ({ typeTab }) => {
  const location = useLocation();
  const [keyHash, setKeyHash] = useState("#rising");

  useEffect(() => {
    if (["#all", "#fusion", "#other"].includes(location.hash)) {
      setKeyHash(location.hash);
    } else {
      setKeyHash("#all");
    }
  }, [location]);
  return (
    <div className="farm__tab flex flex-row items-center w-fit rounded-3xl p-1">
      <NavLink
        className={({ isActive }) =>
          `w-[133px] text-center ${
            keyHash === "#all" && isActive ? "active" : "inactive"
          }`
        }
        key={"farm-all"}
        to="/farm#all"
      >
        All
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          `w-[133px] text-center ${
            keyHash === "#fusion" && isActive ? "active" : "inactive"
          }`
        }
        key={"farm-fusion"}
        to="/farm#fusion"
      >
        Fusion
      </NavLink>

      <NavLink
        className={({ isActive }) =>
          `w-[133px] text-center ${
            keyHash === "#other" && isActive ? "active" : "inactive"
          }`
        }
        key={"farm-other"}
        to="/farm#other"
      >
        Other
      </NavLink>
    </div>
  );
};

export default FarmTab;
