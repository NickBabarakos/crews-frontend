import {useState, useEffect } from 'react';

export const useEventTimer = (startDateStr, endDateStr) => {
    const [status, setStatus] = useState('loading'); //upcoming, active, ended
    const [countdown, setCountdown] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(()=> {
        if(!startDateStr || !endDateStr) return;

        const calculate = () => {
            const startStr = startDateStr.includes('Z') ? startDateStr : `${startDateStr} PST`;
            const endStr = endDateStr.includes('Z') ? endDateStr : `${endDateStr} PST`;

            const start = new Date(startStr)
            const end = new Date(endStr)
            const now = new Date();
            
            const totalDuration = end.getTime() - start.getTime();

            if(now < start){
                setStatus('upcoming');
                const diff = start.getTime() - now.getTime();
                setCountdown(`${formatDuration(diff)}`);
                setProgress(0);
            } else if (now >= start && now <= end){
                setStatus('active');
                const diff = end.getTime() - now.getTime();
                const elapsed = now.getTime() - start.getTime();

                setCountdown(formatDuration(diff));
                const pct = Math.min(100, Math.max(0, (elapsed/totalDuration)*100));
                setProgress(pct);
            } else {
                setStatus('ended');
                setCountdown('-');
                setProgress(100);
            }
        };

        const formatDuration = (ms) => {
            if (ms < 0) return "0m";
            const days = Math.floor(ms/ (1000*60*60*24));
            const hours = Math.floor((ms/(1000*60*60))%24);
            const minutes = Math.floor((ms/1000/60)%60);

            let str="";
            if(days > 0) str += `${days}d `;
            if(hours>0) str += `${hours}h `;
            str += `${minutes}m`;
            return str.trim();
        };
        calculate();

        const timer = setInterval(calculate, 1000);
        return () => clearInterval(timer);
    }, [startDateStr, endDateStr]);

    return {status, countdown, progress};
};