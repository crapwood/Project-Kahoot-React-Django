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

export function shuffle(array){
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
}

export function changeBgColor(){
      const colors = ["#ed8b06", "#2212ab", "#2bce79", "#9d15a9"];
      shuffle(colors);
      return colors[0];
}
