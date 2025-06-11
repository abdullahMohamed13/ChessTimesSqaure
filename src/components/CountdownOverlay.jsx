import React, { useState, useEffect } from 'react';
import '../css/countdown-overlay.css';

export default function CountdownOverlay({ onComplete }) {
    const [count, setCount] = useState(3);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsAnimating(true);
        const timer = setInterval(() => {
            setCount(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setTimeout(() => {
                        onComplete();
                    }, 1000);
                    return 0;
                }
                return prev - 1;
            });
            setIsAnimating(true);
        }, 1000);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="countdown-overlay">
            <div className={`countdown-number ${isAnimating ? 'pop' : ''}`}
                 onAnimationEnd={() => setIsAnimating(false)}>
                {count > 0 ? count : 'Start!'}
            </div>
        </div>
    );
}
