import React, { useContext } from "react"
import '../css/dashboard.css'
import PlayerContext from '../contexts/PlayerContext';
import GameContext from "../contexts/GameContext";
import useLocalStorage from "../hooks/useLocalStorage";
import Button from "../components/Button";

export default function Dashboard() {
    const {player, setPlayer} = useContext(PlayerContext);
    const {timeControl} = useContext(GameContext);

    // localStorages
    const [dashboardResults, setDashboardResults] = useLocalStorage('dashboardResults', []);

    // Get Players Usernames From The Home Page
    const p1username = player?.whitePlayer?.username;
    const p2username = player?.blackPlayer?.username;

    const getFinalScoreText = () => {
        const whitePoints = player.whitePlayer.wins + player.draws;
        const blackPoints = player.blackPlayer.wins + player.draws;
        return whitePoints > blackPoints ? `${renderPlayerUsername(p1username, 'Won', 'P1')}`:
        blackPoints > whitePoints ? `${renderPlayerUsername(p2username, 'Won', 'P2')}` : '   Draw'
    }

    const renderPlayerUsername = (pUsername, res='', initialVal='') => {
        return pUsername ? `${pUsername} ${res}` : `${initialVal} ${res}`;
    }
    
    const addWin = (color) => {
        const isWhite = color === 'white';
        const playerKey = isWhite ? 'whitePlayer' : 'blackPlayer';

        const resultText = isWhite ? renderPlayerUsername(p1username, 'Won', 'P1') :
        renderPlayerUsername(p2username, 'Won', 'P2');
        
        setPlayer(prev => ({
            ...prev,
            [playerKey]: {
                ...prev[playerKey],
                wins: prev[playerKey].wins + 1
            }
        }));
        
        setDashboardResults(prev => [...prev, {
            type: resultText,
            playerName: isWhite ? p1username || 'P1' : p2username || 'P2',
            timestamp: new Date().toISOString(),
            timeControl: timeControl,
        }]);
    }
    
    const addDraw = () => {
        setPlayer(prev => ({...prev, draws: prev.draws + 0.5}));
        setDashboardResults(prev => [...prev, {
            type: 'Draw',
            timestamp: new Date().toISOString(),
            timeControl: timeControl,
        }]);
    }

    const getDashboardResults = () => {
        return dashboardResults.map((result, index) => (
            <div className="dashboard-result-item" key={result.timestamp}>
                <div className="result-and-time-control">
                    <p className=
                    {`${result.playerName === p1username ? 'player-1-wins' : 
                        result.playerName === p2username ? 'player-2-wins' : ''}`}>
                        {`${index + 1}. ${result.type}`}
                    </p>
                    <p className="t-ctrl">{`${result.timeControl.charAt(0).toUpperCase() + result.timeControl.slice(1)}`}</p>
                </div>
                <p>{`${new Date(result.timestamp).toLocaleString()}`}</p>
                <Button onClick={() => removeResult(index)} text='❌' ariaLabel="Remove Dashboard Result" />
            </div>
        ));
    }   

    const removeResult = (indexToRemove) => {
        const resultToRemove = dashboardResults[indexToRemove];

        if(resultToRemove.type === 'P1 Won' || resultToRemove.type === `${p1username} Won`) {
            setPlayer(prev => ({
                ...prev,
                whitePlayer: {
                    ...prev.whitePlayer,
                    wins: Math.max(0, prev.whitePlayer.wins - 1)
                }
            }));
        } else if (resultToRemove.type === 'P2 Won' || resultToRemove.type === `${p2username} Won`) {
            setPlayer(prev => ({
                ...prev,
                blackPlayer: {
                    ...prev.blackPlayer,
                    wins: Math.max(0, prev.blackPlayer.wins - 1)
                }
            }));
            
        } else if (resultToRemove.type === 'Draw') {
            setPlayer(prev => ({
                ...prev,
                draws: Math.max(0, prev.draws - 0.5)
            }));
        }
        setDashboardResults(prev => prev.filter((_, index) => index !== indexToRemove));
    }

    const calculateStatistics = () => {
        
        let currentStreak = 0;
        let maxStreak = 0;
        let lastResult = null;
        let whiteWins = 0;
        let blackWins = 0;
        let draws = 0;
        let streakType = '';
        
        dashboardResults.forEach(result => {
            if (result.type === 'P1 Won' || result.type === `${p1username} Won`) whiteWins++;
            if (result.type === 'P2 Won' || result.type === `${p2username} Won`) blackWins++;
            if (result.type === 'Draw') draws++;
            
            if (result.type === lastResult || lastResult === null) {
                currentStreak++;
            } else {
                currentStreak = 1;
            }
            
            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
                streakType = result.type;
            }
            
            lastResult = result.type;
        });
        
        const currentStreakCount = dashboardResults
            .slice()
            .reverse()
            .findIndex((result, i, arr) => i > 0 && result.type !== arr[i-1].type);
        
        const currentStreakValue = currentStreakCount === -1 ? dashboardResults.length : currentStreakCount;
        const currentStreakResult = dashboardResults.length > 0 ? dashboardResults[dashboardResults.length-1].type : '';
        
        return {
            totalGames: dashboardResults.length,
            whiteWins,
            blackWins,
            draws,
            whiteWinPercentage: (whiteWins / dashboardResults.length * 100 || 0).toFixed(1),
            blackWinPercentage: (blackWins / dashboardResults.length * 100 || 0).toFixed(1),
            drawPercentage: (draws / dashboardResults.length * 100 || 0).toFixed(1),
            currentStreak: dashboardResults.length > 0 ? 
                `${currentStreakResult} ${currentStreakValue}` : 'None',
            maxStreak: maxStreak > 1 ? `${streakType} ${maxStreak}` : 'None'
        };
    }

    const renderStatistics = () => {
        const stats = calculateStatistics();
        
        return <div className="dashboard-statistics">
                <h3>Statistics</h3>
                <div className="stats-grid">
                    <div>Total Games:</div><div>{stats.totalGames}</div>
                    <div>{renderPlayerUsername(p1username, 'Victories', 'Player-1')}:</div><div>{stats.whiteWins} ({stats.whiteWinPercentage}%)</div>
                    <div>{renderPlayerUsername(p2username, 'Victories', 'Player-2')}:</div><div>{stats.blackWins} ({stats.blackWinPercentage}%)</div>
                    <div>Draws:</div><div>{stats.draws} ({stats.drawPercentage}%)</div>
                    <div>Current Streak:</div><div>{stats.currentStreak}</div>
                    <div>Max Streak:</div><div>{stats.maxStreak}</div>
                </div>
        </div>
    }
    
    const resetDashboard = () => {
        setDashboardResults([]);
        setPlayer(prev => ({
            ...prev,
            whitePlayer: { ...prev.whitePlayer, wins: 0 },
            blackPlayer: { ...prev.blackPlayer, wins: 0 },
            draws: 0
        }));
        localStorage.removeItem('dashboardResults');
        localStorage.removeItem('finalScore');
    }

    return <div className="dashboard">
        <h1 className="dashboard-heading">Dashboard</h1>
        <div className="dashboard-btns">
            <Button onClick={() => addWin('white')} text={renderPlayerUsername(p1username, 'Wins', 'P1')}
            ariaLabel="Add Win to Player-1" id='white-win' />
            <Button onClick={addDraw} text='Draw' id='draw' ariaLabel='Add Draw' />
            <Button onClick={() => addWin('black')} text={renderPlayerUsername(p2username, 'Wins', 'P2')}
            ariaLabel="Add Win to Player-2" id='black-win' />
        </div>
        <div className="dashboard-score">{player.whitePlayer.wins + player.draws} - {player.blackPlayer.wins + player.draws}
            <span className={(player.whitePlayer.wins + player.draws) !== (player.blackPlayer.wins + player.draws) ? 'winner' : ''}>
                {getFinalScoreText()}
            </span>
        </div>
        <div className="dashboard-results">
            {dashboardResults.length === 0 ? <p>No Games Yet</p> : getDashboardResults()}
        </div>
        <Button onClick={resetDashboard} text='Reset Dashboard'
            ariaLabel="Reset Dashboard Results" cName='reset' />
        {renderStatistics()}
        <p className="highlight save-progress">💡 Your preferences and progress are saved, so you can pick up right where you left off next time.</p>
    </div>
}
