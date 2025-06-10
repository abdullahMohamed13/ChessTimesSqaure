import { useContext, useState } from 'react';
import PlayerContext from '../contexts/PlayerContext';

export default function useCustomTimeControl(setIsCustomTime, isRunning, setTimeControl) {
    const [finalCustomTime, setFinalCustomTime] = useState({ time: null, inc: null });
    const {setPlayer} = useContext(PlayerContext);

const handleTimeChange = (e) => {
    if (!isRunning) {
        const minutes = parseInt(document.querySelector('.minutes')?.value) || 0;
        const seconds = parseInt(document.querySelector('.seconds')?.value) || 0;
        const increment = parseInt(document.querySelector('.increment')?.value) || 0;

        const totalTime = minutes * 60 + seconds;

        // Save to state
        setFinalCustomTime({ time: totalTime, inc: increment });

        // Update players
        setPlayer(prev => ({
            ...prev,
            whitePlayer: { ...prev.whitePlayer, time: totalTime },
            blackPlayer: { ...prev.blackPlayer, time: totalTime },
            increment: increment
        }));

        // Set time control based on total time
        if (totalTime >= 3600) {
            setTimeControl('classical');
        } else if (totalTime >= 600) {
            setTimeControl('rapid');
        } else if (totalTime >= 120) {
            setTimeControl('blitz');
        } else if (totalTime > 0) {
            setTimeControl('bullet');
        } else {
            setTimeControl('custom');
        }

        setIsCustomTime(true);
    }
};

    return { finalCustomTime, handleTimeChange, setFinalCustomTime };
}
