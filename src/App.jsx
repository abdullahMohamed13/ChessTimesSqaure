import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import '../src/css/index.css';

import Home from './pages/Home';
import Footer from './components/Footer.jsx';
import NavBar from './components/NavBar.jsx';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Contact = lazy(() => import('./pages/Contact'));
const NoPage = lazy(() => import('./pages/NoPage'));

// if (document.documentElement.className === 'originalLight') {
//   document.querySelector('meta[name="theme-color"]').content = '#f6f6f6';
// } else if (document.documentElement.className === 'originalDark') {
//   document.querySelector('meta[name="theme-color"]').content = '#121212';
// } else if (document.documentElement.className === 'majesticLight') {
//   document.querySelector('meta[name="theme-color"]').content = '#f7f3ec';
// } else if (document.documentElement.className === 'majesticDark') {
//   document.querySelector('meta[name="theme-color"]').content = '#252525';
// } else if (document.documentElement.className === 'retroLight') {
//   document.querySelector('meta[name="theme-color"]').content = '#f0f0f0';
// } else if (document.documentElement.className === 'retroDark') {
//   document.querySelector('meta[name="theme-color"]').content = '#222222';
// } else {
//   document.querySelector('meta[name="theme-color"]').content = '#000000';
// }

function AnimatedRoutes() {
  const location = useLocation();

  return <AnimatePresence mode="wait">
        <motion.div
            key={location.pathname}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            <NavBar />
            <div className="app">
                <Suspense fallback={<div className="loading">Loading</div>}>
                    <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NoPage />} />
                    </Routes>
                </Suspense>
            </div>
            <Footer />
        </motion.div>
    </AnimatePresence>
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
