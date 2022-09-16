import React, { useState } from "react";
import linkedInIcon from "../../../assets/images/launchpad/linkedIn.png";


function FlipCard({ member }) {
  const [isActive, setActive] = useState(false);

  const handleToggle = () => {
    setActive(!isActive);
  };


  return (
    <div className="card">
      <div data-aos="flip-up" className="team__group__member">
        <div
          className={`cardBack ${isActive ? "flipped" : ""}`}
          style={{ opacity: `${!isActive ? "0" : "1"}`, transition: "all 1s" }}
        >
          <div className="team__group__member__description">
            {" "}
            {member.content.map?.((item,i) => (
              <a key={i}>{item}</a>
            ))}
          </div>
        </div>

        <div
          className={`cardFront ${isActive ? "flipped flex flex-col items-center" : "flex flex-col items-center"}`}
          style={{ opacity: `${isActive ? "0" : "1"}`, transition: "all 1s" }}
        >
          <img
            className="team__group__member__avatar"
            src={member.avatar}
            alt="avatar"
          />
          <p className="team__group__member__name">{member.name}</p>
          <div className="team__group__member__title w-full pl-2">
            <p className="team__group__member__title border-l-4 border-[#FAAD14] pl-2">{member.title}</p>
            {member.linked ? (
              <a target="_blank" href={member.linked}>
                <img src={linkedInIcon} />
              </a>
            ) : (
              ""  
            )}
          </div>
          <p className="team__group__member__description">
            {member.desc.map?.((item,i) => (
              <a key={i}>{item}</a>
            ))}
          </p>
        </div>

        <button
          className="btn-oval team__group__member__button"
          onClick={(e) => handleToggle(e)}
        >
          {" "}
          {isActive ? "Close" : "Read more"}
        </button>
      </div>
    </div>
  );
}

export default FlipCard;
