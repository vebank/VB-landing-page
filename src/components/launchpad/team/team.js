import React from "react";
import "./team.scss";


import teamKhiem from "../../../assets/images/launchpad/launchpad_member.png";
import teamCEO from "../../../assets/images/launchpad/launchpad_member2.png";
import teamTram from "../../../assets/images/launchpad/launchpad_member3.png";
import teamCFO from "../../../assets/images/launchpad/launchpad_member4.png";
import teamCCO from "../../../assets/images/launchpad/launchpad_member5.png";
import teamThong from "../../../assets/images/launchpad/launchpad_member6.png";
import teamJean from "../../../assets/images/launchpad/launchpad_member7.png";
import teamCMO from "../../../assets/images/launchpad/launchpad_member8.png";
import FlipCard from "./FlipCard";

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
];

const card2s = [
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



const Team = () => {
  return (
    <div className="team" id="team">
      <div className="team__main">
        <div className="team__group">
          {cards.map((member, index) => (
            <FlipCard member={member} key={index} />
          ))}
        </div>
        <div className="team__group">
          {card2s.map((member, index) => (
            <FlipCard member={member} key={index} />
          ))}
        </div>
      </div>

    </div>
  );
};
export default Team;
