import React, { useState, useContext, useEffect } from 'react'
import '../css/player-card.css'
import formatTime from '../utils/formatTime';
import GameContext from '../contexts/GameContext';
import PlayerContext from '../contexts/PlayerContext';
import usePlayerInfo from '../hooks/usePlayerInfo';
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessBoard } from '@fortawesome/free-solid-svg-icons';

export default function PlayerCard({ isWhite, isCustomTime}){
    // Contexts
    const { player, setPlayer } = useContext(PlayerContext);
    const {isRunning, timeControl} = useContext(GameContext)
    // Stats
    const [showWhiteRating, setShowWhiteRating] = useState(true);
    const [showBlackRating, setShowBlackRating] = useState(true);
    const [showTempMsg, setShowTempMsg] = useState(false)
    // Vars
    const playerKey = isWhite ? 'whitePlayer' : 'blackPlayer';
    const username = player[playerKey].username;
    const rating = player[playerKey].rating;
    const playerSite = player[playerKey].chosenSite;
    const avatarURL = player[playerKey].avatar;
    // Custom Hooks
    const {fetchPlayerData, loading} = usePlayerInfo(playerKey, username, playerSite, timeControl)

    useEffect(() => {
    if (typeof rating !== 'number' && rating !== null && rating !== undefined) {
        setShowTempMsg(true);

        const timer = setTimeout(() => {
            setShowTempMsg(false);
        }, 3000);

        return () => clearTimeout(timer);
    }
    }, [rating]);

    const handleUsernameChange = (e) => 
        setPlayer(prev => ({...prev, [playerKey]:
            {...prev[playerKey], username: e.target.value, rating: '', avatar: ''}}));

    const hideRating = (isWhite) =>
        isWhite ? setShowWhiteRating(prev => !prev) : setShowBlackRating(prev => !prev);

    const handleSiteSelection = (site) => {
        setPlayer(prev => ({...prev, [isWhite ? 'whitePlayer' : 'blackPlayer']:
        {...prev[isWhite ? 'whitePlayer' : 'blackPlayer'], rating: '', avatar: ''}}));
        
        if (playerSite === site) {
            setPlayer(prev => ({
                ...prev, [playerKey]: {...prev[playerKey], chosenSite: null,
                }
            }))
        } else {
            setPlayer(prev => ({
                ...prev, [playerKey]: {...prev[playerKey], chosenSite: site,
                }
            }))
        }
    }

    const usernameChecker = (isWhite, username) => {
        const colorBox = {
            display: 'inline-block',
            height: '20px',
            width: '20px',
            marginLeft: '8px',
            border: isWhite ? '2px solid black' : '',
            backgroundColor: isWhite ? 'white' : 'black',
            verticalAlign: 'middle'
        }
        if (!username) {
            return (
                <span>
                    {isWhite ? 'White' : 'Black'}
                    <span style={colorBox}></span>
                </span>
            );
        } else {
            return (
                <span>
                    {username}
                    <span style={colorBox}></span>
                </span>
            );
        }
    }

    return <div className="player-card">
        {isRunning &&
        <Button text='+10' cName='add-time' ariaLabel='Add 10 Seconds' onClick={() => {
            setPlayer(prev => ({ ...prev, [playerKey]: { ...prev[playerKey], time: prev[playerKey].time + 10}}))}}/>}

        <div id="time">
            {isCustomTime ? (
                <span className={(isRunning && player[playerKey].time < 60) ? `low-time` : ''}>
                    {formatTime(player[playerKey].time, player.increment)}
                </span>
            ) : (
                <span className={(isRunning && player[playerKey].time < 60) ? `low-time` : ''}>
                    {formatTime(player[playerKey].time, player.increment)}
                </span>
            )}
        </div>

        {avatarURL ?
            <img src={avatarURL} className="player-avatar" alt='Player Avatar' width={50} height={50} /> :
            <FontAwesomeIcon icon={faChessBoard} className='player-card-avatar'/>}

        <p className='white-black'>
            {usernameChecker(isWhite, username)}
        </p>

        <div className="player-stats">
            <div className="websites-logos">
                {(!isRunning || rating) && (
                    isRunning ? (
                        <img
                            src={`../../${playerSite}.svg`}
                            alt={`${playerSite} Logo`}
                            className="selected-site"
                        />
                    ) : (
                        <>
                            <img
                                src="../../chess.com.svg"
                                alt="Chess.com Logo"
                                className={`chess-com-logo ${playerSite === 'chess.com' ? 'selected-site' : ''}`}
                                onClick={() => handleSiteSelection('chess.com')}
                            />
                            <img
                                src="../../lichess.svg"
                                alt="Lichess Logo"
                                className={`lichess-logo ${playerSite === 'lichess' ? 'selected-site' : ''}`}
                                onClick={() => handleSiteSelection('lichess')}
                            />
                        </>
                    )
                )}
            </div>


            {!isRunning && <input  
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e)}
                placeholder='Enter your username'
            />}

            {((isWhite ? showWhiteRating : showBlackRating) && rating) && (
                <p className='rating'>
                    {typeof(rating) === 'number' ?
                    `${timeControl.charAt(0).toUpperCase() + timeControl.slice(1)} Rating: ${rating}`:
                        showTempMsg ? rating : ''
                    }
                </p>
            )}

            <div className="btns">
                {!isRunning && <>
                    <Button text={loading ? 'loading...' : 'Get Rating'} disabled={loading} ariaLabel="Get Player Data"
                    onClick={fetchPlayerData}/>

                    <Button text={isWhite && showWhiteRating ? `Hide Rating` : !isWhite && showBlackRating ? `Hide Rating` : `Hidden`}
                        ariaLabel="Hide Player Rating" onClick={() => hideRating(isWhite)}/>
                </>}
            </div>
        </div>
    </div>
}
