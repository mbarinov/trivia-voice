import { useState, useEffect } from "react";

export const useGameTimer = () => {
  const [startTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const duration = currentTime - startTime;

  return { duration };
};
