import React, { createContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const PlayerContext = createContext(null);

export const PlayerProvider = ({children}) => {
    const [player, setPlayer] = useLocalStorage('playerStats', {
        whitePlayer: { username: '', rating: '', wins: 0, time: 0, chosenSite: '', avatar: ''},
        blackPlayer: { username: '', rating: '', wins: 0, time: 0, chosenSite: '', avatar: ''},
        draws: 0, increment: 0,
    });

    const [activePlayer, setActivePlayer] = useLocalStorage('activePlayer', 'whitePlayer');

    return <PlayerContext.Provider value={{player, setPlayer, activePlayer, setActivePlayer}}>
        {children}
    </PlayerContext.Provider>
}

export default PlayerContext;
