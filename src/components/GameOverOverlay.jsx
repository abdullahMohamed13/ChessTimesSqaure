import React, { useEffect } from 'react';
import '../css/game-over-overlay.css';

export default function GameOverOverlay({ isWhite, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="game-over-overlay">
            <div className="game-over-content">
                <h2>Time's Up!</h2>
                <p>{isWhite ? 'White' : 'Black'} player is defeated</p>
                <div className={`loser-piece ${isWhite ? 'white' : 'black'}`}>♚</div>
            </div>
        </div>
    );
}
