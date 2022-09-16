import React, { useState, useRef, useEffect } from 'react';

import launchpad_team1 from "../../assets/images/launchpad/launchpad_team1.jpg";

import launchpad_team4 from "../../assets/images/launchpad/launchpad_team4.jpg";
import team1 from "../../assets/images/launchpad/launchpad-mb/team_1.jpg";
import team2 from "../../assets/images/launchpad/launchpad-mb/team_2.jpg";
import team3 from "../../assets/images/launchpad/launchpad-mb/team_3.jpg";
import team4 from "../../assets/images/launchpad/launchpad-mb/team_4.jpg";
import teamKhiem from "../../assets/images/launchpad/launchpad_member.png";
import teamCEO from "../../assets/images/launchpad/launchpad_member2.png";
import teamTram from "../../assets/images/launchpad/launchpad_member3.png";
import teamCFO from "../../assets/images/launchpad/launchpad_member4.png";
import teamCCO from "../../assets/images/launchpad/launchpad_member5.png";
import teamThong   from "../../assets/images/launchpad/launchpad_member6.png";
import teamJean from "../../assets/images/launchpad/launchpad_member7.png";
import teamCMO from "../../assets/images/launchpad/launchpad_member8.png";
import Team from "../../components/launchpad/team/team";
import TeamSwiper from "./team/TeamSwiper";

import SwiperCore, { Autoplay, EffectCoverflow, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
SwiperCore.use([EffectCoverflow, Pagination, Autoplay]);
const cards = [
  {
    id: 1,
    avatar: teamKhiem,
    name: "Khiem Vuong",
    title: "CEO",
    linked: null,
    desc: [
      "• 12+ years in finance.",
      "• 3+ years in fintech start up company as a founder."
    ],
    content: [
      "• 12+ years in finance.",
      "• 3+ years in fintech start up company as a founder."
    ]
  },
  {
    id: 2,
    avatar: teamCEO,
    name: "Andrea Bello",
    title: "Head of Partnership",
    linked: "https://www.linkedin.com/in/bello-andrea-380572b4/",

    desc: [
      "• Founder and CEO of the WeFund blockchain project.",
      "• Founder and director of 3 start-up companies in the field of technology and innovation.",
      // "Software developer engineer at ABB.",
      // "General Electric and Fund manager at AXA and Zurich.",
    ],
    content: [
      "• Founder and CEO of the WeFund blockchain project.",
      "• Founder and director of 3 start-up companies in the field of technology and innovation.",
      "• Founder and director of 3 start-up companies in the field of technology and innovation.",
      "• Software developer engineer at ABB.",
      "• General Electric and Fund manager at AXA and Zurich.",
    ]
  },
  {
    id: 3,
    avatar: teamTram,
    name: "Tram VO",
    title: " CTO",
    linked: "https://www.linkedin.com/in/tram-vo-a72309199",

    desc: [
      "• 8+ years in software development & leadership skills. ",
      "• 5 years of experience developing, implementing and supporting large scale streaming industry. ",
    ],
    content: [
      "• 8+ years in software development & leadership skills. ",
      "• 5 years of experience developing, implementing and supporting large scale streaming industry. ",
      "• 2 blockchain projects technical leader."
    ]


  },
  {
    id: 4,
    avatar: teamCFO,
    name: "Achuth ChandraN",
    title: "CFO",
    linked: "https://www.linkedin.com/in/achuth-k-chandran-b17880102",
    desc: [
      "• Experienced financial professional and consultant. HEC Paris alumnus. ACCA Affiliate. ",
      "• With experience at KPMG, Sancta Capital and Trilogy Enterprises ..."
    ],
    content: [
      "• Experienced financial professional and consultant. HEC Paris alumnus. ACCA Affiliate. ",
      "• With experience at KPMG, Sancta Capital and Trilogy Enterprises, Achuth has vast experience in the different avenues of corporate and investment finance."
    ]
  },
  {
    id: 5,
    avatar: teamCCO,
    name: "Austin Taylor",
    title: "CCO",
    linked: "https://www.linkedin.com/in/austintaylor19",
    desc: ["• Comes from a background in investment and corporate finance. ",
      "• After completing his education he worked as a Business Analyst for ..."],
    content:
      ["• Comes from a background in investment and corporate finance. ",
        "• After completing his education he worked as a Business Analyst for Harman International in Seattle, Washington USA building AI applications to identify high-risk sale transactions."]
  },
  {
    id: 6,
    avatar: teamThong,
    name: "Thong nguyen",
    title: "COO",
    linked: "https://www.linkedin.com/in/thong-nguyen-92223734",
    desc: [
      "6 years of experience in financial analysis",
      "3+ years of blockchain market research",
      "6 years of experience as a bank manager."
    ],
    content: [
      "• 6 years of experience in financial analysis",
      "• 3+ years of blockchain market research",
      "• 6 years of experience as a bank manager."
    ]
  },
  {
    id: 7,
    avatar: teamJean,
    name: "Jean Nguyen",
    title: "Head of Blockchain",
    linked: "https://www.linkedin.com/in/hoang-anh-nguyen-994a16121",
    desc: [
      "• 12 years in Banking industry.",
      "• 5 years in Fintech industry."

    ],
    content: [
      "• 12 years in Banking industry.",
      "• 5 years in Fintech industry."

    ]
  },
  {
    id: 8,
    avatar: teamCMO,
    name: "Ika Afifah",
    title: "Marketing Advisor",
    linked: "https://www.linkedin.com/in/ika-nur-afifah",
    desc:[
      "• A dynamic individual who worked at Tencent as an Operation Specialist, in the partnership division. ",
      "• Before Tencent, she was Senior Partnership Manager ..."
    ],
    content: [
      "• A dynamic individual who worked at Tencent as an Operation Specialist, in the partnership division. ",
      "• Before Tencent, she was Senior Partnership Manager at Bigo, a Senior Account Executive position at one of the digital marketing agencies under Jet Group."
    ]
  },
];
const LaunchPadteampartner = () => {


    const scollToRef = useRef();
    const scollToRef1 = useRef();
    const scollToRef2 = useRef();

    const [isActive, setisActive] = useState("menu1");
    const slide_img = [
        team1,
        team2,
        team3,
        team4,
    ];
    const slide_team = [1, 2]
    useEffect(() => {

        window.addEventListener("scroll", () => {

            var menu1 = document.getElementById("menu1")?.offsetTop;
            var menu2 = document.getElementById("menu2")?.offsetTop;
            var menu3 = document.getElementById("menu3")?.offsetTop;

            if ((window.innerHeight + window.scrollY) + 1 >= document.body.offsetHeight) {
                setisActive("menu3")
            }
            else if (window.scrollY >= menu2 - 101 && window.scrollY < menu3) {
                setisActive("menu2")
            }
            else if (window.scrollY >= menu1 - 101 && window.scrollY < menu2) {
                setisActive("menu1")
            }
        });
    }, []);
    return (
        <div className="flex w-full pb-40">
            <div className="launchpad-content-1 md:block hidden">
                <div className="sticky top-1/4">
                    <a className={(isActive === "menu1" ? 'launchpad-contend-menu ' : 'inactive')}
                        onClick={() => { scollToRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" }); }}><p>Team</p>
                    </a>
                    <a className={(isActive === "menu2" ? 'launchpad-contend-menu ' : 'inactive')}
                        onClick={() => { scollToRef1.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" }); }}><p>Our team leaders</p>
                    </a>
                    <a className={(isActive === "menu3" ? 'launchpad-contend-menu ' : 'inactive')}
                        onClick={() => { scollToRef2.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" }); }}><p>Partners </p>
                    </a>
                </div>
            </div>
            <div className="launchpad-content-2 md:pl-12 px-4">

                <div id="menu1" ref={scollToRef} className="scrollmargin" ><p className="launchpad-content-title pb-6">Team</p></div>
                <div className="pb-6"><span className="launchpad-content-text ">With more than 25 experienced software engineers and a history of 5+ fintech & blockchain  projects, Esol Labs innovates rapidly to accelerate a range of use-cases, empowering consumers, organizations, regulators alike to connect and exchange value in more dynamic, efficient, safe and immediate ways.</span></div>
                <img className="w-full mb-12 rounded-3xl" src={launchpad_team1} />

                <div id="menu2" ref={scollToRef1} className="scrollmargin"><p className="launchpad-content-title pb-10">Our team leaders</p></div>
                <div className='md:block hidden z-[0] relative team-bg mb-12'>
                    <Team />
                </div>
                <div className="team__slider block z-[0] relative">
                    <TeamSwiper cards={cards} />
                </div>

                <div id="menu3" ref={scollToRef2} className="scrollmargin" ><p className="launchpad-content-title my-12">Partners</p></div>
                <img className="w-full rounded-3xl" src={launchpad_team4} />
            </div>
        </div>
    );
};

export default LaunchPadteampartner;