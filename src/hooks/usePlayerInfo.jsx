import React, { useContext, useState} from 'react'
import PlayerContext from '../contexts/PlayerContext';
import Axios from 'axios';

export default function usePlayerInfo(playerKey, username, playerSite, timeControl) {
    const { setPlayer } = useContext(PlayerContext);
    const [loading, setLoading] = useState(false);

    const updatePlayerRating = (rating) => {
        setPlayer(prev => ({...prev, [playerKey]: { ...prev[playerKey], rating }}));
    };

    const checker = () => {
        if (!username) {
            updatePlayerRating('Enter A Username First!');
            return false;
        }
        if (!playerSite) {
            updatePlayerRating('Choose A Website First!');
            return false;
        }
        if (!timeControl) {
            updatePlayerRating('Choose A Time Control First!');
            return false;
        }
        return true
    }

    const fetchPlayerData = () => {
        if (!checker()) return;

        setLoading(true);

        if (playerSite === 'chess.com') {
            const profileURL = `https://api.chess.com/pub/player/${username.toLowerCase()}`;

            Promise.all([
                Axios.get(`${profileURL}/stats`),
                Axios.get(profileURL)
            ]).then(([statsRes, profileRes]) => {
                const key = timeControl === 'classical' ? 'fide' : `chess_${timeControl}`;
                const dataStats = statsRes.data[key];
                const rating = dataStats?.last?.rating;

                const avatar = profileRes.data.avatar;
                setPlayer(prev => ({
                    ...prev, [playerKey]: { ...prev[playerKey],
                        avatar: avatar,
                        rating: key === 'fide' ? dataStats || 'No Rating Found!' : rating || 'No Rating Found!'
                    }
                }));
            })
            .catch(() => {
                updatePlayerRating('User Not Found!');
            })
            .finally(() => setLoading(false));

        } else if (playerSite === 'lichess') {
            Axios.get(`https://lichess.org/api/user/${username.toLowerCase()}`)
            .then(res => {
                const rating = res.data.perfs[timeControl]?.rating;
                setPlayer(prev => ({
                    ...prev,
                    [playerKey]: {
                        ...prev[playerKey],
                        rating: rating || 'No Rating Found!',
                        avatar: null  // Lichess doesn't provide avatars
                    }
                }));
            })
            .catch(() => {
                updatePlayerRating('User Not Found!');
            })
            .finally(() => setLoading(false));
        }
    }

    return {fetchPlayerData, loading}
}
