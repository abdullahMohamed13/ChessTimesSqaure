import React, { useState } from "react";
import { FaFacebook, FaGithub, FaEnvelope, FaChessKnight, FaDiscord } from "react-icons/fa";
import '../css/contact.css';

export default function Contact() {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <>
            <div className="contact-page">
                <div className="disclaimer">
                    <h1>⚠️ Disclaimer</h1>
                    <p>
                        This website is an independent project and is <strong>not affiliated</strong> with, endorsed by, 
                        or officially connected to Chess.com or Lichess. The content is provided "as-is" for 
                        casual and personal use.
                    </p>
                    <p>
                        <span className="highlight">Note:</span> Player data is sourced from public APIs and displayed 
                        without warranty of accuracy. All trademarks belong to their respective owners.
                    </p>
                </div>

                <div className='lore'>
                    <h1>🧙 Lore</h1>
                    <p>{`While playing chess with my dad, we did'nt have a clock - so I said why not make one <3`}</p>
                </div>

                <div className="challenge">
                    <h2><FaChessKnight /> Challenge Me to a Match!</h2>
                    <div className="chess-links">
                        <a href="https://www.chess.com/member/am_255" target="_blank" rel="noopener noreferrer">
                            <img src="../../chess.com.svg" alt="Chess.com" />
                            Chess.com
                        </a>
                        <a href="https://lichess.org/@/Abdallah138" target="_blank" rel="noopener noreferrer">
                            <img src="../../lichess.svg" alt="Lichess" />
                            Lichess
                        </a>
                    </div>
                </div>

                <div className="contact-container">
                    <h1>📬 Get In Touch</h1>
                    <div className="contact-info">
                        <a href="mailto:abdullah.229op@gmail.com" className="contact-item">
                            <FaEnvelope className="icon" />
                            <span>Email</span>
                        </a>
                        <a href="https://www.facebook.com/abdllaMohaamad" target="_blank" rel="noopener noreferrer" className="contact-item">
                            <FaFacebook className="icon" />
                            <span>Facebook</span>
                        </a>
                        <a href="https://github.com/abdullahMohamed13" target="_blank" rel="noopener noreferrer" className="contact-item">
                            <FaGithub className="icon" />
                            <span>GitHub</span>
                        </a>
                        <div className="contact-item discord-item" title="Click To Copy Username"
                        onClick={() => copyToClipboard("._russo_")}>
                            <FaDiscord className="icon" />
                            <span>Discord</span>
                            {copied && <span className="copy-message">Copied!</span>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}