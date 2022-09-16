
import React ,{ useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { shallowEqual, useSelector } from 'react-redux';
import { timeSinceAgo } from '../../utils/lib';
import CountdownPeriod from './CountdownPeriod';

// const calculateDuration = eventTime => moment.duration(Math.max(eventTime - (Math.floor(Date.now() / 1000)), 0), 'seconds');


const CooldownPeriod = ({ loadStakingAccount }) => {

    const [periodTime, setPeriodTime] = useState(null);
    const { addressStaking, accountStaked, cooldownSeconds, stakersCooldowns, UNSTAKE_WINDOW, dueTimeEnd } = useSelector((state) => state.accountStakedVBReducer,shallowEqual);

    useEffect(() =>{
        const currentTime = parseInt(new Date().getTime() / 1000);
        if(Number(accountStaked) > 0 && (Number(stakersCooldowns) + Number(UNSTAKE_WINDOW)) > currentTime){
            if( Number(stakersCooldowns) > 0 && accountStaked > 0 
                && (Number(stakersCooldowns) + Number(cooldownSeconds) > currentTime)){
                    setPeriodTime(Number(stakersCooldowns) + Number(cooldownSeconds) - 4);
            }else if(Number(stakersCooldowns) > 0 && currentTime <= (Number(stakersCooldowns) + Number(UNSTAKE_WINDOW)) ){
                setPeriodTime(Number(stakersCooldowns) + Number(UNSTAKE_WINDOW) + Number(cooldownSeconds) );
            }
        }
        if(Number(accountStaked) === 0){
            setPeriodTime(null) 
        }

    },[stakersCooldowns , dueTimeEnd]);

    useEffect(() =>{
        if(Number(accountStaked) === 0){
            clearCooldown();
        }
    },[accountStaked]);


    const clearCooldown = () => {
        setPeriodTime(null);
        if(addressStaking){
            loadStakingAccount(addressStaking);
        }
    }
      
    const CountDownDisplay = React.memo(function ({time}) {
        if(time){
            return <CountdownPeriod clearCooldown={clearCooldown} eventTime={time} interval={1000} />;
        }
    });

    const renderCooldownPeriod =  (periodTime) => {
        if(cooldownSeconds){
            if( periodTime){
                return <CountDownDisplay time={periodTime} />
            }
        }
        return timeSinceAgo(new Date(Date.now()-(cooldownSeconds*1000)));
    };
   
    return (
        <div className="text-sm text-hint">
            {renderCooldownPeriod(periodTime)}
        </div>
    )
}

export default CooldownPeriod;