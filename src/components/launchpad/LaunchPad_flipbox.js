import React,{useState} from 'react';


const LaunchPad_flipbox = ({ img }) => {
    const [isActive, setIsActive] = useState(false);

    const handleClick = event => {
      // 👇️ toggle isActive state on click
      setIsActive(current => !current);
    };
    return (

            <div class="flip-card flex col-span-4 gap-4 flex-wrap flex-1">
                {(img.map((img, i) => {
                    return (
                        <div className={isActive ? 'flip-card-inner' : 'w-1/5'} onClick={handleClick}>
                            <div className="flip-card-front">
                                <img className='max-w-[150px] mb-[48px]' src={img} />
                            </div>
                            <div className="flip-card-back">

                            </div>
                        </div>
                    );
                })
                )}
            </div>

    );
};

export default LaunchPad_flipbox;
