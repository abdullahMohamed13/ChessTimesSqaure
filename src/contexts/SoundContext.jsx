import React, { createContext, useState, useContext } from "react";

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
    const [muted, setMuted] = useState(false);

    const toggleSound = () => setMuted(prev => !prev);

    const playSound = async (soundKey) => {
        if(!muted && soundKey) {
            const soundModule = await import(/* @vite-ignore */ soundKey);
            const audio = new Audio(soundModule.default);
            audio.play().catch((e) => {
                console.warn('Playback failed:', e);
            });
            // audio.volume = 0.4;
        }
        return
    };

    return (
        <SoundContext.Provider value={{ muted, toggleSound, playSound }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => useContext(SoundContext);
