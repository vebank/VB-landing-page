
import { useCallback, useEffect, useRef, useState } from 'react';
import moment from 'moment';

const calculateDuration = eventTime => moment.duration(Math.max(eventTime - (Math.floor(Date.now() / 1000)), 0), 'seconds');

const CountdownPeriod = ({ eventTime, interval , clearCooldown}) => {

    const [duration, setDuration] = useState(calculateDuration(eventTime));

    const timerRef = useRef(0);

    const timerCallback = useCallback(() => {
        setDuration(calculateDuration(eventTime));
    }, [eventTime])

    useEffect(() => {
        timerRef.current = setInterval(timerCallback, interval);
        return () => {
            clearInterval(timerRef.current);
        }
    }, [eventTime]);

    const pad = (n) => n < 10 ? `0${n}` : n;

    useEffect(() => {
        if (duration._milliseconds === 0) {
            clearCooldown();
        }
    }, [duration]);


    return (
        <div className='box-countdown fade-in-box flex items-center space-x-1'>

            {duration.days()?<>
                <span className='flex flex-1'>
                    <div className='number-ct'>{pad(duration.days())}</div>
                    <div className='label-ct ml-[2px]'> d</div>
                </span>
                <span>:</span>
            </>
            :"" }

            {duration.hours() ? <>
                <span className='flex flex-1'>
                    <div className='number-ct'>{pad(duration.hours())}</div>
                    <div className='label-ct ml-[2px]'>h</div>
                </span>
                {duration.hours() > 1 ?<span>:</span>:"" }
            </>:""}
            
            {duration.minutes() ? <>
                <span className='flex flex-1'>
                    <div className='number-ct'>{pad(duration.minutes())}</div>
                    <div className='label-ct ml-[2px]'>m</div>
                </span>
                {duration.minutes() > 1 ?<span>:</span>:"" }
            </>:""}
            
            {duration.seconds() ? <>
            <span className='flex flex-1'>
                <div className='number-ct'>{pad(duration.seconds())}</div>
                <div className='label-ct ml-[2px]'>sec</div>
            </span>
            </>:""}

        </div>
    )
}

export default CountdownPeriod;