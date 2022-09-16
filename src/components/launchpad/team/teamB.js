import React from "react";
import './team.scss';
import titleTeam from '../../assets/img/team/title.svg';
import teamMember from '../../assets/img/team/team-member.png';
import linkedInIcon from '../../assets/img/team/linkedIn.png';

import teamKhiem from   "../../assets/images/launchpad/launchpad_member.png";
import teamCEO from "../../assets/images/launchpad/launchpad_member2.png";
import teamTram from "../../assets/images/launchpad/launchpad_member3.png";
import teamCFO from "../../assets/images/launchpad/launchpad_member4.png";
import teamCCO from "../../assets/images/launchpad/launchpad_member5.png";
import teamThong   from "../../assets/images/launchpad/launchpad_member6.png";
import teamJean from "../../assets/images/launchpad/launchpad_member7.png";
import teamCMO from "../../assets/images/launchpad/launchpad_member8.png";
const cards = [
  {
    
    id: 1,
    avatar: teamKhiem,
    name: 'Khiem Vuong', 
    title:'CEO',
    linked:'https://www.linkedin.com/in/bello-andrea-380572b4/',
    desc:'12+ years in finance.',
    content:'Founder and CEO of the WeFund blockchain project, previously founder and director of three start-ups in the technology and innovation sector, software develop on company like ABB, General Electric and Fund manager at AXA and Zurich'
  },
  {
    id: 2,
    avatar: teamCEO,
    name: 'Ika Afifah', 
    title:'CFO',
    linked:'https://www.linkedin.com/in/achuth-k-chandran-b17880102',
    desc:'A dynamic individual who worked at Tencent as an Operation Specialist, in the partnership division. Before Tencent, she was Senior Partnership Manager at Bigo, a Senior Account...',
    content:'A dynamic individual who worked at Tencent as an Operation Specialist, in the partnership division. Before Tencent, she was Senior Partnership Manager at Bigo, a Senior Account Executive position at one of the digital marketing agencies under Jet Group, and Manager at Waves, helping founders raise $1.2M in pre-seed funding. She is one of the founding partners and driving forces behind the concept of WeFund.'
  },
  {
    id: 3,
    avatar: teamTram,
    name: 'Achuth Chandran', 
    title:'CFO',
    linked:'https://www.linkedin.com/in/achuth-k-chandran-b17880102',
    desc:'Experienced financial professional and consultant. HEC Paris alumnus. ACCA Affiliate. With experience at KPMG, Sancta Capital and Trilogy Enterprises, Achuth has vast....',
    content:'Experienced financial professional and consultant. HEC Paris alumnus. ACCA Affiliate. With experience at KPMG, Sancta Capital and Trilogy Enterprises, Achuth has vast experience in the different avenues of corporate and investment finance. He currently leads Octave Advisory, a blockchain consulting firm based out of Dubai with the goal to help promote and expand the technology.'
  },
  {
    id: 4,
    avatar: teamCFO,
    name: 'Austin Taylor', 
    title:'CCO',
    linked:'https://www.linkedin.com/in/austintaylor19',
    desc:'Comes from a background in investment and corporate finance. After completing his education he worked as a Business Analyst for Harman International in Seattle...',
    content:'Comes from a background in investment and corporate finance. After completing his education he worked as a Business Analyst for Harman International in Seattle, Washington USA building AI applications to identify high-risk sale transactions. After this, he transitioned to Investment Management for Pegasus Tech Ventures located in Jakarta, Indonesia managing investment deals in the Southeast Asia region.'
  },
  {
    id: 5,
    avatar: teamCCO,
    name: 'Khiem Vuong', 
    title:'COO',
    linked:null,
    desc:'12+ years in finance.\n 3+ years in fintech start up company as a founder.',
    content:'12+ years in finance.\n 3+ years in fintech start up company as a founder.'
  },
  {
    id: 6,
    avatar: teamThong,
    name: 'Tram Vo', 
    title:'CTO',
    linked: 'https://www.linkedin.com/in/tram-vo-a72309199',
    desc:'8+ years in software development & leadership skills. 5 years of experience developing, implementing and supporting large scale streaming industry. 2 blockchain projects...',
    content:'8+ years in software development & leadership skills. 5 years of experience developing, implementing and supporting large scale streaming industry. 2 blockchain projects.'
  },
  {
    id: 7,
    avatar: teamJean,
    name: 'Sang Tai', 
    title:'Head of Blockchain',
    linked: 'https://www.linkedin.com/in/sangtaitat',
    desc:'4+ years experience of developing  finance, trading applications. 2+ years experience of research, develop on blockchain industry...',
    content:'4+ years experience of developing  finance, trading applications. 2+ years experience of research, develop on blockchain industry.'
  },
  {
    id: 8,
    avatar: teamCMO,
    name: 'Phat Nguyen', 
    title:'Head of Product',
    linked: 'https://www.linkedin.com/in/phat-nguyen-kim-715481233',
    desc:'7+ years of experience as a Senior DevOps Engineer at FPT, Galaxy, TikTikTrading. Specialized in streaming systems. Devops Lead Engineer at 2 project gamefi: Lunarush, Metaspets.',
    content:'7+ years of experience as a Senior DevOps Engineer at FPT, Galaxy, TikTikTrading. Specialized in streaming systems. Devops Lead Engineer at 2 project gamefi: Lunarush, Metaspets.'
  }
]

const Team = () => {

const handleClick =(e)  => { 

};  // checked

  return (
    <div className='team' id='team'>
      <div data-aos="zoom-in"><img className='team__titleImg' src={titleTeam} /></div>
      <div className="team__group">

        <div data-aos="flip-up" className="team__group__member ">
          <img className="team__group__member__avatar" src={teamCEO} />
            <p className="team__group__member__name">Andrea Bello</p>
            <div className="team__group__member__title">
              <p className="team__group__member__title">Founder & CEO</p>
              <a target="_blank" href="https://www.linkedin.com/in/bello-andrea-380572b4/"><img src={linkedInIcon}/></a>
            </div>
            <p className="team__group__member__description">Founder and CEO of the WeFund blockchain project, previously founder and director of three start-ups in the technology and innovation sector, software develop on company like ABB, General Electric...</p>
            <button className="btn-oval team__group__member__button" onClick={e=>handleClick(e)}>Read more</button>
        </div>

        <div data-aos="flip-up" className="team__group__member">
          <img className="team__group__member__avatar" src={teamCMO} />
          <p className="team__group__member__name">Ika Afifah</p>
          <div className="team__group__member__title">
            <p className="team__group__member__title">CMO</p>
            <a target="_blank" href="https://www.linkedin.com/in/ika-nur-afifah">
               {/* <img src={linkedInIcon}/> */}
            </a>
          </div>
          <p className="team__group__member__description">A dynamic individual who worked at Tencent as an Operation Specialist, in the partnership division. Before Tencent, she was Senior Partnership Manager at Bigo, a Senior Account...</p>
          <button className="btn-oval team__group__member__button">Read more</button>
        </div>

        <div data-aos="flip-up" className="team__group__member">
          <img className="team__group__member__avatar" src={teamCFO} />
          <p className="team__group__member__name">Achuth Chandran</p>
          <div className="team__group__member__title">
            <p className="team__group__member__title">CFO</p>
            <a target="_blank" href="https://www.linkedin.com/in/achuth-k-chandran-b17880102">
              {/* <img src={linkedInIcon}/> */}
            </a>
          </div>
          <p className="team__group__member__description">Experienced financial professional and consultant. HEC Paris alumnus. ACCA Affiliate. With experience at KPMG, Sancta Capital and Trilogy Enterprises, Achuth has vast....</p>
          <button className="btn-oval team__group__member__button">Read more</button>
        </div>

        <div data-aos="flip-up" className="team__group__member">
          <img className="team__group__member__avatar" src={teamCCO} />
          <p className="team__group__member__name">Austin Taylor</p>
          <div className="team__group__member__title">
            <p>CCO</p>
            <a target="_blank" href="https://www.linkedin.com/in/achuth-k-chandran-b17880102">
             {/* <img src={linkedInIcon}/> */}
            </a>
          </div>
          <p className="team__group__member__description">Comes from a background in investment and corporate finance. After completing his education he worked as a Business Analyst for Harman International in Seattle...</p>
          <button className="btn-oval team__group__member__button">Read more</button>
        </div>
      </div>
      <div className="team__group">
        <div data-aos="flip-down" className="team__group__member">
          <img className="team__group__member__avatar" src={teamKhiem} />
          <p className="team__group__member__name">Khiem Vuong</p>
          <div className="team__group__member__title">
            <p className="team__group__member__title">COO</p>
            {/* <img src={linkedInIcon}/> */}
          </div>
          <p className="team__group__member__description">
            12+ years in finance.<br/>
            3+ years in fintech start up company as a founder.
          </p>
          <button className="btn-oval team__group__member__button">Read more</button>
        </div>
        <div data-aos="flip-down" className="team__group__member">
          <img className="team__group__member__avatar" src={teamTram} />
          <p className="team__group__member__name">Tram Vo</p>
          <div className="team__group__member__title">
            <p className="team__group__member__title">CTO</p>
            <a target="_blank" href="https://www.linkedin.com/in/tram-vo-a72309199/">
              {/* <img src={linkedInIcon}/> */}
            </a>
       
          </div>
          <p className="team__group__member__description">
            8+ years in software development & leadership skills.
5 years of experience developing, implementing and supporting large scale streaming industry.
2 blockchain projects...</p>
          <button className="btn-oval team__group__member__button">Read more</button>
        </div>
        <div data-aos="flip-down" className="team__group__member">
          <img className="team__group__member__avatar" src={teamSang} />
          <p className="team__group__member__name">Sang Tai</p>
          <div className="team__group__member__title">
            <p className="team__group__member__title">Head of Blockchain</p>
            <a target="_blank" href="https://www.linkedin.com/in/sangtaitat">
              <img src={linkedInIcon}/>
            </a>
          </div>
          <p className="team__group__member__description">4+ years experience of developing  finance, trading applications. 2+ years experience of research, develop on blockchain industry.</p>
          <button className="btn-oval team__group__member__button">Read more</button>
        </div>
        <div data-aos="flip-down" className="team__group__member">
          <img className="team__group__member__avatar" src={teamPhat} />
          <p className="team__group__member__name">Phat Nguyen</p>
          <div className="team__group__member__title">
            <p>Head of Product</p>
            <a target="_blank" href="https://www.linkedin.com/in/phat-nguyen-kim-715481233">
            <img src={linkedInIcon}/>
            </a>
          </div>
          <p className="team__group__member__description">7+ years of experience as a Senior DevOps Engineer at FPT, Galaxy, TikTikTrading. Specialized in streaming systems. Devops Lead Engineer at 2 project gamefi: Lunarush, Metaspets.</p>
          <button className="btn-oval team__group__member__button">Read more</button>
        </div>
      </div>
    </div>
  )
}
export default Team;