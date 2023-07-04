import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Link,
  Outlet, 
  useRoutes,
  useNavigate
} from "react-router-dom";
import MyButton from '../components/Button';
import Input from '../components/Input';
import Sample from '../components/Sample';
import useAudio from '../hooks/useAudio';
import MyAudioContext from '../context/MyAudioContext';
import song from '../audio/no be so (mastered).mp3';
import { uploadFile } from "react-s3";
import io from 'socket.io-client';
import { sign } from 'jsonwebtoken';

const AppDiv = styled.div`
    text-align: center;
    padding: 2%;
    background-color: #F5F5F5;
    height: max;
    width: max;
`;

const Header = styled.div`
    background-color: #F5F5F5;
    display: grid;
    grid-template-columns: auto auto auto;
    border-bottom: black solid 1.5px;
`;

const About = styled.span`
    text-align: left;
    align-self: center;
    vertical-align: bottom;
`;

const WeVoice = styled.span`
    text-align: center;
    align-self: center;
`;

const You = styled.span`
    text-align: right;
    align-self: center;
    vertical-align: bottom;
`;

const Title = styled.div`
    margin-top: 6%;
`;

const SampleDiv = styled.div`
    display: flex;
    padding: 5% 10%;
    border-bottom: 1.5px black solid;
    @media (max-width: 768px) {
        display: block;
        width: max;
        padding-bottom: 12%;
    }
`;

const GenDiv = styled.div`
    padding: 5% 10%;
    @media (max-width: 768px) {
        width: max;
    }
`;

const SampleSelect = styled.select`
    margin-bottom: 0px;
    padding-bottom: 0px;
    background-color: #D9D9D9;
    height: 45px;
    width: 100%;
    border: none;
    padding-left: 2%;
    padding-right: 2%;
    border-bottom: solid 1.5px black;
`;

const Left = styled.div`
    flex: 1;
    @media (max-width: 768px) {
        display: block;
        width: max;
        height: fit-content;
    }
`;

const RP = styled.p`
    text-align: left;
`;

const RecordDiv = styled.div`
    display: flex;
    width: 100%;
    margin-top: 4%;
    gap: 4%;
`;

const RecordButton = styled.div`
    flex: 1;
`;

const RestartButton = styled.div`
    flex: 1;
`;

const SaveButton = styled.div`
    margin-top: 4%;
`;

const TimeOuter = styled.div`
    height: 20vw;
    display: grid;
    background-color: #FFFFFF;
    border: solid black 1.5px;
    padding: 5%;
    @media (max-width: 768px) {
        width: max;
        height: 50vw;
    }
`;

const TimeInner = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    place-self: center;
    background-color: #D9D9D9;
`;

const Time = styled.h1`
    place-self: center;
`;

const Right = styled.div`
    flex: 2;
    text-align: left;
    margin-left: 10%;
    margin-top: 3%;
    @media (max-width: 768px) {
        display: block;
        width: max;
        height: fit-content;
        margin-left: 0;
        margin-top: 30%;
        padding-top: 20%;
        border-top: black solid 1.5px;
    }
`;

const UploadSectionTitle = styled.p`
    text-align: left;
    margin-bottom: 0px;
    font-size: small;
`;

const UploadDiv = styled.div`
    background-color: #D9D9D9;
    border: none;
    border-bottom: black 1.5px solid;
    height: 40px;
    //width: max;
    padding: 2%;
    margin-top: 0px;
    border-radius: 0px;
`;

const Div = styled.div`
    padding-right: 4%;
`;

const Name = styled.p`
    text-align: left;
    margin-bottom: 0px;
    font-size: small;
`;

const In = styled.input`
    background-color: #D9D9D9;
    border: none;
    border-bottom: black 1.5px solid;
    //max-height: fit-content;
    height: 21px;
    width: 100%;
    padding: 2%;
    margin-top: 0px;
    border-radius: 0px;
`;

const In75 = styled.input`
    background-color: #D9D9D9;
    border: none;
    border-bottom: black 1.5px solid;
    height: 21px;
    width: 100%;
    padding: 2%;
    margin-top: 0px;
    border-radius: 0px;
    display: inline-block;
`;

const U = styled.div`
    width: 30%;
`;

const Little = styled.p`
    color: black;
    font-size: x-small;
    text-align: left;
    margin-top: 0px;
    padding-top: 0px;
`;

const MyTA = styled.textarea`
    background-color: #D9D9D9;
    width: 100%;
    height: 100px;
    font-size: small;
    padding: 2%;
    resize: none;
    margin-bottom: 0px;
    padding-bottom: 0px;
    border: none;
    border-bottom: black solid 1.5px;
`;

const MyAudio = styled.audio`

`;

const Home = (props) => {
  const linkRef = useRef(null);
  const uploadRef = useRef(null);
    const [state, setState] = useState({
        sampleName: "",
        selectedSampleId: "Select a voice",
        gptPrompt: "",
        generatingText: ""
    });
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const [recordedUrl, setRecordedUrl] = useState("");
    const mediaRecorder = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [audio, setAudio] = useState(new Audio(recordedUrl));
  const [playing, setPlaying] = useState(false);
  const [file, setFile] = useState(null);
  const [fileTemp, setFileTemp] = useState(null);
  const [socket] = useState(() => io(':8000'));
  const toggle = () => setPlaying(!playing);
  const sampleSaved = useState(false);
  const [voiceId, setVoiceId] = useState("");
  const [voiceName, setVoiceName] = useState("");
  const [voices, setVoices] = useState([]);
  const [s3Key, setS3Key] = useState('');
  const [voiceState, setVoiceState] = useState(true);
  const [allowCreateVoice, setAllowCreateVoice] = useState(true);
  const [allowUploadS3, setAllowUploadS3] = useState(true);

    const config = {
        bucketName: process.env.REACT_APP_S3_BUCKET,
        dirName: `audios/${localStorage.getItem("userId")}/${voiceId}`,
        region: process.env.REACT_APP_S3_REGION,
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
        s3Url: process.env.REACT_APP_S3_URL,
    }

    let vId = "";
    let vN = "";
    let s3k = "";

    function getUserId() {
        let uId = "";
        if(localStorage.getItem('userId')){
            uId = localStorage.getItem('userId').replace(/"|'/g, '');
        }
        return uId;
    }

    useEffect(() => {
        //clearVoices();
        if(voiceState === true){
            getUsersVoices();
        }
    }, [voiceState]);

  useEffect(() => {
      playing ? audio.play() : audio.pause();
    },
    [playing]
  );

  useEffect(() => {
    audio.src = recordedUrl;
    console.log(audio);
  }, [recordedUrl])

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  const _startTimer = () => {
    const interval = setInterval(() => {
      setRecordingTime((time) => time + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const _stopTimer = () => {
    timerInterval !== null && clearInterval(timerInterval);
    setTimerInterval(undefined);
  };

  /**
   * Calling this method would result in the recording to start. Sets `isRecording` to true
   */
  const startRecording = useCallback(() => {
    if(!playing){
        setPlaying(false);

        if (timerInterval !== null) return;

        navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
            setIsRecording(true);
            mediaRecorder.current = new MediaRecorder(stream);
            mediaRecorder.current.start();
            _startTimer();

            mediaRecorder.current.addEventListener("dataavailable", (event) => {
            console.log(event.data);
                const url = URL.createObjectURL(event.data);
                setRecordedUrl(url);
                console.log(url);
            mediaRecorder.current.stream.getTracks().forEach((t) => t.stop());
            mediaRecorder.current = null;
            });
        })
        .catch((err) => console.log(err));
    }
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

    const nav = () => {
        navigate('/signup');
    }

    const onInputChanged = (e) => {
        let sampleName = state.sampleName;

        const name = e.target.name;
        const value = e.target.value;

        switch(name){
            case "sampleName":
                sampleName = value;
                break;
            default:
        }

        if(success.length > 0){setSuccess("");}
        if(errors.length > 0){setErrors([]);}

        setState({
            sampleName: sampleName,
        });
    }

    const onGenerateInputChanged = (e) => {
        let selectedSampleId = state.selectedSampleId;
        let generatingText = state.generatingText;
        let gptPrompt = state.gptPrompt;

        const name = e.target.name;
        const value = e.target.value;

        switch(name){
            case "selectedSampleId":
                selectedSampleId = value;
                break;
            case "generatingText":
                generatingText = value;
                break;
            case "gptPrompt":
                gptPrompt = value;
                break;
            default:
        }

        setState({
            selectedSampleId: selectedSampleId,
            generatingText: generatingText,
            gptPrompt: gptPrompt,
        });
    }

    function convertSecondstoTime() {
        const dateObj = new Date(recordingTime * 1000);
        const hours = dateObj.getUTCHours();
        const minutes = dateObj.getUTCMinutes();
        const seconds = dateObj.getSeconds();
        
        const timeString = hours.toString().padStart(2, '0')
            + ':' + minutes.toString().padStart(2, '0')
            + ':' + seconds.toString().padStart(2, '0');
        
        return timeString;
    }

    const downloadFile = () => {
        if(!playing && recordedUrl !== "" && !isRecording){
            linkRef.current.href = recordedUrl;
            linkRef.current.download = `${state.sampleName}.wav`;
            linkRef.current.click();
            //getAudioUrlBlob();
        }
    }

    useEffect(() => {
        socket.on('receive_voice_id', data => {
            doItRight(data);
        });
    }, []);

    const doItRight = (data) => {
        console.log('wow');
        vId = data.voice_id;
        vN = data.voice_name;
        setVoiceId(data.voice_id);
        setVoiceName(data.voice_name);
        console.log(vId);
        console.log(vN);
        handleUpload();
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if(!playing && !isRecording){
            if (!file) {
                return;
            }
            
            console.log(file);
            setFileTemp(file);
            setAllowCreateVoice(true);
            setAllowUploadS3(true);
            socket.emit(
                "save_voice_sample", 
                {
                    name: state.sampleName,
                    file: file
                },
            );
        }
    }

    const onGenerateSubmitHandler = (e) => {
        e.preventDefault();
        socket.emit('generate_speech', {
            voice_id: state.selectedSampleId,
            text_to_speech: state.generatingText
        });
    }

    const createVoiceObject = () => {
        //if(voiceName && s3Key && voiceId){
            console.log('cVo');
            axios.post(
                "http://localhost:8000/api/voices/new",
                {
                    user_id: getUserId(),
                    voice_name: vN,
                    s3_key: s3k,
                    voice_id: vId
                },
                { withCredentials: true }
            )
                .then(res => {
                    console.log(res);
                    setVoiceState(true);
                })
                .catch(err => {
                    console.log(err);
                });
        //}
    }

    const getUsersVoices = () => {
        axios.get(
            `http://localhost:8000/api/voices/user/${getUserId()}`
        )
            .then(res => {
                console.log(res);
                setVoices(res.data);
                setVoiceState(false);
            })
            .catch(err => {
                console.log(err);
            });
    }

    // Perform the upload
    const handleUpload = () => {
        // Split the filename to get the name and type
        let fileParts = uploadRef.current.files[0].name.split('.');
        let fileName = fileParts[0];
        let fileType = fileParts[1];
        console.log("Preparing the upload");
        console.log(fileParts);
        axios.post(
            "http://localhost:8000/sign_s3",
            {
                fileName : fileName,
                fileType : fileType,
                user_id: getUserId()
            },
            { withCredentials: true },
        )
            .then(response => {
                const returnData = response.data.data.returnData;
                const signedRequest = returnData.signedRequest;
                const url = returnData.url;
                setS3Key(returnData.key);
                s3k = returnData.key;
                //this.setState({url: url})
                console.log("Recieved a signed request " + signedRequest);

                socket.emit(
                    "put_object_in_s3_bucket",
                    {
                        signedRequest: signedRequest,
                        file: uploadRef.current.files[0],
                        fileType: fileType
                    }
                );
            })

            .catch(error => {
                console.log(error);
                //alert(JSON.stringify(error));
            })
    }

    useEffect(() => {
        socket.on("after_putting_object_in_s3_bucket", data => {
            afterPut(data);
        });
    }, []);

    const afterPut = (data) => {
        console.log("Response from s3");
        console.log(vId);
        console.log(vN);
        console.log(s3k);
        createVoiceObject();
    }

    return (
        <AppDiv>
            <Header>
                <About><p>about</p></About>
                <WeVoice><h2>WeVoice</h2></WeVoice>
                <You><p>you</p></You>
            </Header>
            <Title>
                <h1>This is where you create your voice samples.</h1>
            </Title>
            <form onSubmit={onSubmitHandler}>
                <SampleDiv>
                    <Left>
                        <RP>You record</RP>
                        <TimeOuter>
                            <TimeInner
                                onClick={
                                    !isRecording?
                                        (
                                            recordedUrl.length > 0?
                                            toggle:
                                            undefined
                                        ):
                                        undefined
                                }
                            >
                                <Time>
                                    {
                                        isRecording?
                                        convertSecondstoTime():
                                        (
                                            recordedUrl.length > 0?
                                            (
                                                playing?
                                                "Pause":
                                                "Play"
                                            ):
                                            "No recording"
                                        )
                                    }
                                </Time>
                            </TimeInner>
                        </TimeOuter>
                        <RecordDiv>
                            <RecordButton>
                                <MyButton
                                    backgroundColor="#000000"
                                    color="#D9D9D9"
                                    text={
                                        !isRecording?
                                        "Record":
                                        "Stop"
                                    }
                                    width="100%"
                                    type="button"
                                    onClick={
                                        !playing&&
                                        !isRecording?
                                        startRecording:
                                        stopRecording
                                    }
                                />
                            </RecordButton>
                            <RestartButton>
                                <MyButton
                                    backgroundColor="#D9D9D9"
                                    color="#000000"
                                    text="Download"
                                    width="100%"
                                    type="button"
                                    onClick={downloadFile}
                                />    
                            </RestartButton>
                        </RecordDiv>
                        <SaveButton>
                            <MyButton
                                backgroundColor="#000000"
                                color="#D9D9D9"
                                text="Save"
                                width="100%"
                                type="submit"
                            />    
                        </SaveButton>
                    </Left>
                    <Right>
                        <Div>
                            <Name>Name</Name>
                            <In
                                required
                                name="sampleName"
                                type="text"
                                minLength={3}
                                value={state.sampleName}
                                onChange={onInputChanged}
                            />
                            <br/><br/>
                            <input
                                required
                                type="file"
                                ref={uploadRef}
                                onChange={handleFileChange}
                            />
                        </Div>
                        <br/>
                        <UploadSectionTitle>Samples Uploaded ({voices.length})</UploadSectionTitle>
                        {
                            voices.length !== 0 && voices.map((voice, i) => {
                                return(
                                    <div key={i}>
                                        <Sample
                                            theKey={i}
                                            uploadName={voice.voice_name}
                                            s3Key={voice.s3_key}
                                        />
                                    </div>
                                )
                            })
                        }
                        {/* <Sample
                            uploadName="This is the first one"
                        /> */}
                        <a ref={linkRef} style={{ display: 'none' }}></a>
                    </Right>
                </SampleDiv>
            </form>
            <GenDiv>
                <form onSubmit={onGenerateSubmitHandler}>
                    <Title>
                        <h1>This is where you use your voice samples.</h1>
                    </Title>
                    <br/><br/>
                    <SampleSelect
                        required
                        value={state.selectedSampleId} 
                        onChange={onGenerateInputChanged}
                        name="selectedSampleId"
                    >
                        {
                            voices.length !== 0 && voices.map((voice, i) => {
                                return(
                                    <option
                                        value={voice.voice_id}
                                        key={i}
                                    >{voice.voice_name}</option>
                                )
                            })
                        }
                    </SampleSelect>
                    <Little>Select a voice</Little>
                    <br/>
                    <div>
                        <Div>
                            <In75
                                name="gptPrompt"
                                type="text"
                                minLength={10}
                                value={state.gptPrompt}
                                onChange={onGenerateInputChanged}
                            />
                            <Little><i>Optionally, tell us what kind of text you want to generate</i></Little>
                        </Div>
                        <U>
                            <MyButton
                                backgroundColor="#D9D9D9"
                                color="#000000"
                                text="Generate"
                                width="100%"
                            />    
                        </U>
                    </div>
                    <br/><br/>
                    <Div>
                        <MyTA
                            required
                            value={state.generatingText} 
                            onChange={onGenerateInputChanged} 
                            name="generatingText"
                        />
                        <Little>What do you want to say?</Little>
                    </Div>
                    <br/><br/>
                    <MyButton
                        backgroundColor="#000000"
                        color="#D9D9D9"
                        text="Generate"
                        width="30%"
                        type="submit"
                    />    
                </form>
            </GenDiv>
        </AppDiv>
    )
}

export default Home;