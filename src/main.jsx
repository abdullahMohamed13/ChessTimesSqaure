import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/css/index.css'

import App from './App.jsx'
import { PlayerProvider } from './contexts/PlayerContext'
import { GameProvider } from './contexts/GameContext.jsx'
import { SoundProvider } from './contexts/SoundContext';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
     <GameProvider>
        <SoundProvider>
          <PlayerProvider>
              <App />
          </PlayerProvider>
        </SoundProvider>
      </GameProvider>
    </ThemeProvider>
  </StrictMode>
)
