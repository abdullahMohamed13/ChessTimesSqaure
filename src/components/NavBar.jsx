import React from 'react';
import { Link } from 'react-router-dom';
import '../css/nav-bar.css';
import { useTheme } from '../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessPawn, faColumns, faCommenting, faHomeAlt, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

export default function NavBar() {
    const {theme, switchTheme, renderThemesOptions} = useTheme();

        return (
        <nav className="main-nav">
            <div className="theme-btns">
                <button className='theme-switch-btn' onClick={switchTheme} aria-label="Switch Theme">
                {theme.endsWith('Dark') ? <FontAwesomeIcon icon={faMoon} className="theme-icon" /> :
                <FontAwesomeIcon icon={faSun} className="theme-icon" />}
                </button>
                {renderThemesOptions()}
            </div>
            <div className="logo-section">
                <FontAwesomeIcon icon={faChessPawn} className='logo-icon'/>
                <h1 id="website-heading">ChessTimesSquare</h1>
                <FontAwesomeIcon icon={faChessPawn} className='logo-icon'/>
            </div>
            <div className="links-to-pages-sections">
                <Link to="/"><FontAwesomeIcon icon={faHomeAlt} /> Home</Link>
                <Link to="/dashboard"><FontAwesomeIcon icon={faColumns} /> Dashboard</Link>
                <Link to="/contact"><FontAwesomeIcon icon={faCommenting} /> Contact</Link>
            </div>
        </nav>
    );
}
