import React, { useState, useContext, useRef } from 'react'
import { Link } from 'react-router-dom';
import '../css/home.css'
// Contexts
import PlayerContext from '../contexts/PlayerContext';
import { useSound } from '../contexts/SoundContext';
import GameContext from '../contexts/GameContext';
// Components
import ClockControls from '../components/ClockControls';
import PlayerCard from '../components/PlayerCard';
import Button from '../components/Button';
// Custom Hooks
import useCustomTimeControl from '../hooks/useCustomTimeControl';
import useMediaQuery from '../hooks/useMediaQuery';
// FontAwesome Library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

export default function Home () {
    // States
    const [isCustomTime, setIsCustomTime] = useState(false);
    const [playerPosition, setPlayerPosition] = useState(true);
    const topPlayerId = playerPosition ? 'whitePlayer' : 'blackPlayer';
    const bottomPlayerId = playerPosition ? 'blackPlayer' : 'whitePlayer';
    const [isGuidelineOpen, setIsGuidelineOpen] = useState(false);
    const [showAllTimeControls, setShowAllTimeControls] = useState(false);
    
    // Contexts
    const {setPlayer, activePlayer} = useContext(PlayerContext);
    const {isRunning, setIsRunning, timeControl, setTimeControl, setTime} = useContext(GameContext)
    
    // Refs
    const customTimeRef = useRef(null);

    // Components
    const whiteCard = <PlayerCard isWhite={true} isCustomTime={isCustomTime}/> 
    const blackCard = <PlayerCard isWhite={false} isCustomTime={isCustomTime}/>

    // Custom Hooks
    const {muted, toggleSound} = useSound()
    const {finalCustomTime, handleTimeChange} = useCustomTimeControl(setIsCustomTime, isRunning, setTimeControl);
    const isMobile = useMediaQuery('(max-width: 768px)')

    // Function and Handlers:
    const getTime = (e) => {
        const selectedTime = parseInt(e.target.getAttribute('data-time'));
        const bonus = parseInt(e.target.getAttribute('data-bonus-time')) || 0
        
        setTime(selectedTime);
        setPlayer(prev => ({
            ...prev,
            increment: bonus,
            whitePlayer: {...prev.whitePlayer, time: selectedTime},
            blackPlayer: {...prev.blackPlayer, time: selectedTime}
        }));
    }

    const switchPlayers = () => {
        setPlayerPosition(prev => !prev)
    }

    const handleTimeControl = (e) => {
        setIsCustomTime(false);
        getTime(e);
        setTimeControl(e.target.className)
        setPlayer(prev => ({
            ...prev,
            whitePlayer: {...prev.whitePlayer, rating: '',},
            blackPlayer: {...prev.blackPlayer, rating: '',}
        }));
    };
   
    const toggleTimeControls = () => {
        setShowAllTimeControls(!showAllTimeControls);
    };
    
    const getPlayerClass = (playerColor) => {
        if (!isRunning) return '';
        return activePlayer === playerColor ? 'active-player' : 'not-active-player';
    };

    const handleTimeCtrlClick = (e) => {
        disableBtnsCondition(() => handleTimeControl(e))
    }

    const scrollToCustomTCtrl = () => {
        customTimeRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        })
    }

    const disableBtnsCondition = (func) => !isRunning && func();
    const disabledBtnsStyle = isRunning ? {
        opacity: '0.5',
        cursor: 'not-allowed',
    } : undefined;

    return <>
    <div className='container'>

        <div className="landing">
        <div className="intro">
            <h2 className="landing-heading">CHESS - TIMES SQUARE</h2>
            ⏱️<span className="highlight">No physical clock?</span>⏱️<br/>
            This is your <span className="accent">browser-based</span> chess timer
            <p className="tagline">
                Perfect for over-the-board games when you don't have a physical clock.<br/>
                Custom time controls • Simple sharing • Works on any device
            </p>
            <span className="chess-icon">♟️</span>
            Every second matters. This isn’t just a timer. It’s your weapon.  
            <span className="chess-icon">♟️</span>
        </div>

            <div className={`guideline ${isGuidelineOpen ? 'open' : ''}`}>
                <h3 className="guideline-heading" title='Learn how to use the chess timer' onClick={() => setIsGuidelineOpen(!isGuidelineOpen)}>
                    <span className="icon">📜</span> Here's how to use it like a grandmaster
                    <span className={`arrow ${isGuidelineOpen ? 'down' : 'up'}`}>▼</span>
                </h3>
            <div className="guideline-content">
            <ul className="guideline-list">
                <li><span className="number">1.</span> 🕰️ Choose a time control—Rapid, Blitz, Bullet or go full Classical.
                You can even create your own with the
                <button className='highlight' onClick={scrollToCustomTCtrl}>custom timer</button> by setting the minutes, seconds and increment time for each move.
                </li>
                <li><span className="number">2.</span> 👤 (Optional) Enter your Chess.com or Lichess username to show off your rating & avatar.</li>
                <li><span className="number">3.</span> ✅ Hit <b className="highlight">Start ►</b>, make your move, and press <b className="highlight">Switch ⇄</b> to pass the clock.</li>
                <li><span className="number">4.</span> 🔇 Mute or unmute sounds with the speaker icon. Your game, your vibe.</li>
                <li><span className="number">5.</span> 📊 After the match, head to the<Link to="/dashboard"
                    style={{ cursor: 'pointer', textDecoration: 'underline'}}> <b className="highlight">Dashboard</b>
                    </Link>to track your results.</li>
            </ul>
            </div>

            </div>
        </div>

        <h1 className='time-controls-heading'>♟️ Choose A Time Control To Start ♟️</h1>
        <div className="time-controls">
            <section className="time-section">
                <h3>Classical</h3>
                <Button text='2 hours' data-time="7200" cName='classical' ariaLabel="Select 2-hour classical game"
                    onClick={handleTimeCtrlClick} style={disabledBtnsStyle} />
            </section>

            <section className="time-section">
                <h3>Rapid</h3>
                <Button text='15 min' data-time="900" cName='rapid' ariaLabel="Select 15-minutes rapid game"
                    onClick={handleTimeCtrlClick} style={disabledBtnsStyle} />
                <Button text='10 min' data-time="600" cName='rapid' ariaLabel="Select 10-minutes rapid game"
                    onClick={handleTimeCtrlClick} style={disabledBtnsStyle} />

                {showAllTimeControls && (
                    <>
                        <Button text='15 | 10' data-time="900" cName='rapid' ariaLabel="Select 15-minutes rapid game with 10-seconds bonus"
                        onClick={handleTimeCtrlClick} style={disabledBtnsStyle} data-bonus-time='10'  />

                        <Button text='10 | 5' data-time="600" cName='rapid' ariaLabel="Select 10-minutes rapid game with 5-seconds bonus"
                        onClick={handleTimeCtrlClick} style={disabledBtnsStyle} data-bonus-time='5' />

                        <Button text='30 min' data-time="1800" cName='rapid' ariaLabel="Select 30-minutes rapid game"
                        onClick={handleTimeCtrlClick} style={disabledBtnsStyle} />
                    </>
                )}
            </section>

            <section className="time-section">
                <h3>Blitz</h3>
                <Button text='5 min' data-time="300" cName='blitz' ariaLabel="Select 5-minutes blitz game"
                    onClick={handleTimeCtrlClick} style={disabledBtnsStyle} />
                <Button text='3 min' data-time="180" cName='blitz' ariaLabel="Select 3-minutes blitz game"
                    onClick={handleTimeCtrlClick} style={disabledBtnsStyle} />

                {showAllTimeControls && (
                    <>
                <Button text='5 | 2' data-time="300" cName='blitz' ariaLabel="Select 5-minutes blitz game with 2-seconds bonus"
                    onClick={handleTimeCtrlClick} style={disabledBtnsStyle} data-bonus-time='2' />
                <Button text='3 | 2' data-time="180" cName='blitz' ariaLabel="Select 3-minutes blitz game with 2-seconds bonus"
                    onClick={handleTimeCtrlClick} style={disabledBtnsStyle} data-bonus-time='2' />
                    </>
                )}
            </section>

            <section className="time-section">
                <h3>Bullet</h3>
                <Button text='2 | 1' data-time="120" cName='bullet' ariaLabel="Select 2-minutes bullet game with 1-second bonus"
                    onClick={handleTimeCtrlClick} style={disabledBtnsStyle} data-bonus-time='1' />
                <Button text='1 min' data-time="60" cName='bullet' ariaLabel="Select 1-minute bullet game"
                    onClick={handleTimeCtrlClick} style={disabledBtnsStyle} />

                {showAllTimeControls && (
                    <>
                    <Button text='1 | 1' data-time="60" cName='bullet' ariaLabel="Select 1-minutes bullet game with 1-second bonus"
                        onClick={handleTimeCtrlClick} style={disabledBtnsStyle} data-bonus-time='1' />
                    <Button text='30 sec' data-time="30" cName='bullet' ariaLabel="Select 1-minute bullet game"
                        onClick={handleTimeCtrlClick} style={disabledBtnsStyle} />
                    </>
                )}
            </section>
        </div>

        <Button cName="toggle-time-controls-btn" onClick={toggleTimeControls} style={disabledBtnsStyle}
        ariaLabel={showAllTimeControls ? "Show fewer time control options" : "Show more time control options"}
        text={<>
            {showAllTimeControls ? 'Less Time Controls' : 'More Time Controls'}
            <span className={`arrow ${showAllTimeControls ? 'up' : 'down'}`}>
                {showAllTimeControls ? '▲' : '▼'}
            </span>
        </>}/>

        <div ref={customTimeRef} className="custom-time-control">
            <div className="time-input-group">
                <input
                    style={disabledBtnsStyle}
                    type="number" 
                    className='minutes' 
                    min={0} 
                    placeholder="0" 
                    onChange={handleTimeChange}
                    aria-label="Minutes"
                />
                <span className="input-label">min</span>
            </div>
            
            <div className="time-input-group">
                <input
                    style={disabledBtnsStyle}
                    type="number" 
                    className='seconds' 
                    min={0} 
                    placeholder="0" 
                    onChange={handleTimeChange}
                    aria-label="Seconds"
                />
                <span className="input-label">sec</span>
            </div>
            
            <div className="time-input-group">
                <input
                    style={disabledBtnsStyle}
                    type="number" 
                    className='increment' 
                    min={0} 
                    placeholder="0" 
                    onChange={handleTimeChange}
                    aria-label="Increment"
                />
                <span className="input-label">inc</span>
            </div>
        </div>

        <div className="players-cards-container">
            <i onClick={toggleSound} title={muted ? 'Turn On' : 'Turn Off'} aria-label='Sound Icon'>
                {muted ? <FontAwesomeIcon icon={faVolumeMute} className="sound-icon" /> :
                <FontAwesomeIcon icon={faVolumeHigh} className="sound-icon"/>}
            </i>
            {timeControl &&
            <h3 className='chosen-time-control'>
                {`${timeControl.charAt(0).toUpperCase() + timeControl.slice(1)} Game`}
                    {timeControl === 'classical' ? <p className='time-control-icon classical'>🕰️</p> :
                    timeControl === 'rapid' ? <p className='time-control-icon rapid'>⏱️</p> :
                    timeControl === 'blitz' ? <p className='time-control-icon blitz'>⚡</p> :
                    timeControl === 'bullet' ? <p className='time-control-icon bullet'>💥</p> : ''
                }
            </h3>}

            <div className="players-cards">
                <div className={getPlayerClass(topPlayerId)}>
                    {playerPosition ? whiteCard : blackCard}
                </div>

                {isMobile && <ClockControls
                tControl={timeControl} sTControl={setTimeControl}
                setTime={setTime} cusTime={finalCustomTime}
                sPPos={setPlayerPosition} running={isRunning} stRunning={setIsRunning}/>}
                
                {!isMobile && <Button
                    className="switch-player"
                    onClick={() => disableBtnsCondition(switchPlayers)}
                    ariaLabel="Switch player positions"
                    style={disabledBtnsStyle}
                />}
                
                <div className={getPlayerClass(bottomPlayerId)}>
                    {playerPosition ? blackCard : whiteCard}
                </div>

                {isMobile &&  <Button
                    className="switch-player"
                    onClick={() => disableBtnsCondition(switchPlayers)}
                    ariaLabel="Switch player positions"
                    style={disabledBtnsStyle}/>}
            </div>
        </div>
        
            {!isMobile && <ClockControls
                tControl={timeControl} sTControl={setTimeControl}
                setTime={setTime} cusTime={finalCustomTime}
                sPPos={setPlayerPosition} running={isRunning} stRunning={setIsRunning}
            />}
    </div>
    </>
}
