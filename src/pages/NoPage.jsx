import React from 'react'
import { Link } from 'react-router-dom';

export default function NoPage() {
    document.title = '404 Not Found!'
    return <div className='no-page-container' style={{textAlign: 'center'}}>
        <h1 style={{textTransform: 'uppercase'}}>bruh 👉 404 not found!</h1>
        <button><Link to={'/'}>Go Home</Link></button>
    </div>;
}
