import React, { createContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const GameContext = createContext(null);

export const GameProvider = ({children}) => {
    const [isRunning, setIsRunning] = useLocalStorage('isRunning', false);
    const [time, setTime] = useState('Time', '');
    const [timeControl, setTimeControl] = useLocalStorage('timeControl', "");
    
    return <GameContext.Provider value={{isRunning, setIsRunning, time, setTime, timeControl, setTimeControl}}>
        {children}
    </GameContext.Provider>
}

export default GameContext;
