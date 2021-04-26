import { useState, useEffect } from 'react';

/**
 * Util hook for testing component
 */
export function useClockWatch() {
  const [counter, setCounter] = useState(0);
  const [mode, setMode] = useState<'START' | 'STOP' | 'PAUSE'>('PAUSE');

  const start = () => {
    setMode('START');
    setCounter(0);
  };
  const stop = () => {
    setMode('STOP');
  };

  useEffect(() => {
    let timer: any;
    if (mode === 'START') {
      timer = setInterval(() => {
        setCounter(prevCounter => prevCounter + 1);
      }, 1);
    }
    return () => {
      // reset counter
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [mode]);

  return {
    counter,
    actions: {
      start,
      stop,
    },
  };
}
