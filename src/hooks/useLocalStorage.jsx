import React, { useState, useEffect } from "react";

export default function useLocalStorage(key, initialVal) {
    const [storedVal, setStoredVal] = useState(() => {
        try {
            const localVal = localStorage.getItem(key);
            return localVal ? JSON.parse(localVal) : initialVal;
        } catch(err) {
            console.log(err);
            return initialVal;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(storedVal));
        } catch (err) {
            console.error(err);
        }
    }, [key, storedVal]);

  return [storedVal, setStoredVal];
}