import React, { useState, useEffect, useRef } from "react";

/**
 * @returns Controls for playing given url.
 *
 * @details `playing`: returns the playing state. true or false
 * @details `toggle`: toggles the playing state
 */
const useAudio = () => {
  const [url, setUrl] = useState("");
  const audio = new Audio(url);
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
      playing ? audio.play() : audio.pause();
      //console.log(audio);
    },
    [playing]
  );

  useEffect(() => {
    audio.src = url;
    console.log(audio);
  }, [url])

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playing, toggle, setUrl];
};

export default useAudio;