import React, { useContext, useEffect, useState, useRef, lazy } from "react";
import { useLocation } from 'react-router-dom';
import '../css/clock-controls.css';
// Contexts
import GameContext from "../contexts/GameContext";
import PlayerContext from '../contexts/PlayerContext';
// Custom Components
import Button from './Button';
// Overlays
const CountdownOverlay = lazy(() => import('./CountdownOverlay'));
const GameOverOverlay = lazy(() => import('./GameOverOverlay'));
// Custom Hooks
import useMediaQuery from '../hooks/useMediaQuery';
import { useSound } from "../contexts/SoundContext";
// Libraries
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay, faCirclePlay, faRightLeft, faArrowRotateLeft, faFlagCheckered, } from '@fortawesome/free-solid-svg-icons';

export default function ClockControls({ cusTime, sPPos }) {
    const isMobile = useMediaQuery('(max-width: 768px)')
    // Contexts
    const {time, isRunning, setIsRunning, timeControl, setTimeControl} = useContext(GameContext)
    const { player, setPlayer, activePlayer, setActivePlayer } = useContext(PlayerContext);
    // Stats
    const [paused, setPaused] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);
    const [loserIsWhite, setLoserIsWhite] = useState(false);
    
    // Refs
    const intervalRef = useRef(null);
    const activePlayerRef = useRef(activePlayer);
    // Custom Hooks
    const {playSound} = useSound();

    // Manage when the user changes tabs or goes to another app
    const location = useLocation();
    const previousPathRef = useRef(location.pathname);
    
    // if the user goes to another tap
    useEffect(() => {
        if (location.pathname !== previousPathRef.current && isRunning &&!paused) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setPaused(true);
        }

        previousPathRef.current = location.pathname;
    }, [location, isRunning, paused])

    // if the user changes the app
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && isRunning && !paused) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                setPaused(true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isRunning, paused])

    useEffect(() => {
        activePlayerRef.current = activePlayer;
    }, [activePlayer])

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [])

    const handleCountdownComplete = () => {
        setShowCountdown(false);
        startClock();
    }
    const handleGameOverClose = () => {
        setShowGameOver(false);
        resetClock();
    }

    const checkTime = (t) => {
        if (t <= 0) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsRunning(false);
            setLoserIsWhite(activePlayerRef.current === 'whitePlayer');
            setShowGameOver(true);
            return 0;
        }
        return t - 1;
    }

    const startClock = () => {
        if (intervalRef.current !== null || !timeControl) return;
        
        if (time || cusTime) {
            setIsRunning(true);
            intervalRef.current = setInterval(() => {
                setPlayer(prev => {
                    const current = activePlayerRef.current;
                    if (!prev || !prev[current]) return prev;
                    return {
                        ...prev,
                        [current]: {
                            ...prev[current],
                            time: checkTime(prev[current].time || 0)
                        }
                    };
                });
            }, 1000);
        }
    }

    const pauseClock = () => {
        if (paused) {
            startClock();
        } else {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setPaused(!paused);
    }

    const stopClockBase = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setPaused(false);
        setTimeControl("");
        setActivePlayer('whitePlayer');
        document.querySelector('.minutes').value = '';
        document.querySelector('.seconds').value = '';
        document.querySelector('.increment').value = '';
    }

    const resetClock = () => {
        stopClockBase();
        setPlayer(prev => ({
            ...prev,
            increment: 0,
            whitePlayer: {...prev.whitePlayer, rating: '', username: '', time: 0, chosenSite: '', avatar: ''},
            blackPlayer: {...prev.blackPlayer, rating: '', username: '', time: 0, chosenSite: '',  avatar: ''}
        }));
        sPPos(true);
    }

    const endMatch = () => {
        stopClockBase();
        setPlayer(prev => ({
            ...prev,
            increment: 0,
            whitePlayer: {...prev.whitePlayer, time: 0,},
            blackPlayer: {...prev.blackPlayer, time: 0, }
        }));
    }

    const switchPlayer = () => {
        const curr = activePlayerRef.current;
        if (player.increment) {
            setPlayer(prev => ({...prev,[curr] : {
                ...prev[curr], time: prev[curr].time + player.increment
            }}))
        }
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setActivePlayer(prev => prev === 'whitePlayer' ? 'blackPlayer' : 'whitePlayer');
        startClock();
    }

    const handleStartClick = () => {
        if (intervalRef.current !== null || !timeControl) {
            playSound('/sounds/illegal.mp3');
            return;
        }
        
        setShowCountdown(true);
        playSound('/sounds/game-start.mp3');
    }

    const whiteKeys = ['q', 'w', 'e', 'a', 's', 'd'];
    const blackKeys = ['p', 'o', 'i', 'l', 'k', 'j'];

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();

            if (key === ' ') {
                event.preventDefault(); // Prevent space bar scrolling
                switchPlayer();
                playSound('/sounds/switch.mp3')
                return;
            }

            if (activePlayerRef.current === 'whitePlayer' && whiteKeys.includes(key)) {
                switchPlayer();
                playSound('/sounds/switch.mp3')
            }

            if (activePlayerRef.current === 'blackPlayer' && blackKeys.includes(key)) {
                switchPlayer();
                playSound('/sounds/switch.mp3')
            }
        };

        isRunning && window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isRunning]);

    return <>
            {showCountdown && <CountdownOverlay onComplete={handleCountdownComplete} />}
            {showGameOver && <GameOverOverlay isWhite={loserIsWhite} onClose={handleGameOverClose} />}
            
            <div className="controls">
                {isRunning ?
                    <>
                        <Button cName='pause' onClick={pauseClock} ariaLabel='Pause Clock' title={paused ? 'Resume' : 'Pause'}
                        text={paused ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faPause} />}/>
                        <Button cName='reset' onClick={() => {playSound('/sounds/game-end.webm'); endMatch()}} ariaLabel='End Match'
                        text={<FontAwesomeIcon icon={faFlagCheckered} />} title="End Game"/>
                        <Button cName='switch' onClick={() => {playSound('/sounds/switch.mp3'); switchPlayer()}} ariaLabel='Switch Move'
                        text={<FontAwesomeIcon icon={faRightLeft} />} title="Switch Turns"/>
                    </> : 
                    <>
                        <Button cName='start' onClick={handleStartClick} ariaLabel='Start Clock' title='Start Clock'
                        text={<FontAwesomeIcon icon={faCirclePlay} />}/>

                        <Button cName='reset' onClick={resetClock} ariaLabel='Reset Clock' title='Reset Clock'
                        text={<FontAwesomeIcon icon={faArrowRotateLeft} />}/>
                    </>
                }
            </div>
            {!isMobile && <div className="clock-keys">
                <p>
                    ⌨️ <strong>Shortcuts:</strong> Either player can press the <span className="highlight">Space</span>
                    key to switch turns.
                </p>
                <p>
                    ♜ <strong>White Player Shortcuts:</strong><br />
                    You can also use any of these keys:
                    {whiteKeys.map((key) => (
                        <span className="highlight" key={key}>{key.toUpperCase()}</span>
                    ))}
                </p>
                <p>
                    ♟️ <strong>Black Player Shortcuts:</strong><br />
                    You can also use any of these keys:
                    {blackKeys.map((key) => (
                        <span className="highlight" key={key}>{key.toUpperCase()}</span>
                    ))}
                </p>
            </div>}
        </>
}
