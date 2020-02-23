import {useEffect, useRef, createContext} from "react";


export const Store = {};

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
      let id;
    function tick() {
        if(savedCallback.current() === false){
            clearInterval(id);
        }
        savedCallback.current();
    }
    if (delay !== null) {
      id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

