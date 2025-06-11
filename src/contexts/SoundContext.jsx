import React, { createContext, useState, useContext } from "react";

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
    const [muted, setMuted] = useState(false);

    const toggleSound = () => setMuted(prev => !prev);

    const playSound = (soundPath) => {
        if (!muted && soundPath) {
            const audio = new Audio(soundPath);
            audio.volume = 0.8;
            audio.play().catch((e) => {
                console.warn('Playback failed:', e);
            });
        }
    };

    return (
        <SoundContext.Provider value={{ muted, toggleSound, playSound }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => useContext(SoundContext);
