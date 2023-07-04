import React, { 
    createContext, 
    useState, 
    useCallback, 
    useRef 
} from 'react';
import MyAudioContext from './MyAudioContext';

/**
 * @returns Controls for the recording. Details of returned controls are given below
 *
 * @details `startRecording`: Calling this method would result in the recording to start. Sets `isRecording` to true
 * @details `stopRecording`: This results in a recording in progress being stopped and the resulting audio being present in `recordingBlob`. Sets `isRecording` to false
 * @details `togglePauseResume`: Calling this method would pause the recording if it is currently running or resume if it is paused. Toggles the value `isPaused`
 * @details `recordingBlob`: This is the recording blob that is created after `stopRecording` has been called
 * @details `isRecording`: A boolean value that represents whether a recording is currently in progress
 * @details `isPaused`: A boolean value that represents whether a recording in progress is paused
 * @details `recordingTime`: Number of seconds that the recording has gone on. This is updated every second
 */
const AudioContextProvider = ({children}) => {
    const mediaRecorder = useRef(null);
    const recordingBlob = useRef(
        new Blob(['<q id="a"><span id="b">hey!</span></q>'], { type: "text/html" })
    );
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  //const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [timerInterval, setTimerInterval] = useState(null);
  //const [recordingBlob, setRecordingBlob] = useState<Blob>([], {});

  const _startTimer = () => {
    const interval = setInterval(() => {
      setRecordingTime((time) => time + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const _stopTimer = () => {
    timerInterval != null && clearInterval(timerInterval);
    setTimerInterval(undefined);
  };

  /**
   * Calling this method would result in the recording to start. Sets `isRecording` to true
   */
  const startRecording = useCallback(() => {
    if (timerInterval != null) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setIsRecording(true);
        mediaRecorder.current = new MediaRecorder(stream);
        //setMediaRecorder(recorder);
        mediaRecorder.current.start();
        _startTimer();

        mediaRecorder.current.addEventListener("dataavailable", (event) => {
          recordingBlob.current = event.data;
          mediaRecorder.current.stream.getTracks().forEach((t) => t.stop());
          mediaRecorder.current = null;
        });
      })
      .catch((err) => console.log(err));
  }, [timerInterval]);

  /**
   * Calling this method results in a recording in progress being stopped and the resulting audio being present in `recordingBlob`. Sets `isRecording` to false
   */
  const stopRecording = () => {
    mediaRecorder.current?.stop();
    _stopTimer();
    setRecordingTime(0);
    setIsRecording(false);
    setIsPaused(false);
  };

  /**
   * Calling this method would pause the recording if it is currently running or resume if it is paused. Toggles the value `isPaused`
   */
  const togglePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
      mediaRecorder.current?.resume();
      _startTimer();
    } else {
      setIsPaused(true);
      _stopTimer();
      mediaRecorder.current?.pause();
    }
  };

  return (
    <MyAudioContext.Provider
        value={{
            startRecording,
            stopRecording,
            togglePauseResume,
            recordingBlob,
            isRecording,
            isPaused,
            recordingTime,
        }}
    >
        {children}
    </MyAudioContext.Provider>
  );
}

export default AudioContextProvider;