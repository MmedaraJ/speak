import React, {useContext} from 'react';
import { MyAudioContext } from '../context/MyAudioContext';

export default useAudioRecorder = () => useContext(MyAudioContext);