const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;
const cookieParser = require('cookie-parser');
const axios = require('axios');
require('dotenv').config();

const ELEVEN_LABS_ADD_VOICE_API_ENDPOINT='https://api.elevenlabs.io/v1/voices/add';

require('./server/config/mongoose.config');

app.use(cookieParser());
app.use(cors({
    credentials: true, 
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
    
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

require('./server/routes/user.routes')(app);
require('./server/routes/voice.routes')(app);
require('./server/routes/aws.routes')(app);

const server = app.listen(port, () => {
    console.log(`Listening on port: ${port}`) 
});

const io = require("socket.io")(server, {cors: true});

const headers = {
  'Content-Type': 'multipart/form-data',
  'xi-api-key': process.env.REACT_APP_ELEVEN_LABS_API_KEY
};

io.on("connection", (socket) => {
  socket.on("save_voice_sample", data => {
    const {
      name,
      file
    } = data;

    console.log('opop');
    console.log(data);

    const body = {
      name: name,
      files: [file]
    };

    let count = 0;

    axios.post(
      ELEVEN_LABS_ADD_VOICE_API_ENDPOINT, 
      body, 
      { headers }
    )
      .then(response => {
        console.log(response.data);
        //emitSocketEvent(response.data.voice_id, name, socket);\
          socket.emit(
            "receive_voice_id", 
            {
              voice_id: response.data.voice_id,
              voice_name: name
            }
          );
      })
      .catch(error => {
        console.error(JSON.stringify(error));
      });
  });

  socket.on("put_object_in_s3_bucket", data => {
    const {
      signedRequest,
      file,
      fileType
    } = data;

    console.log(data);

    var options = {
      headers: {
        'Content-Type': fileType
      }
    };

    let count = 0;

    axios.put(
      signedRequest,
      file,
      options
    )
      .then(result => {
        console.log("Response from s3");
        console.log(result);
          socket.emit(
            "after_putting_object_in_s3_bucket",
            "success"
          );
        //this.setState({success: true});
      })
      .catch(error => {
        console.log(error);
        //alert("ERROR " + JSON.stringify(error));
      })
  });

  socket.on('generate_speech', data => {
    const{
      voice_id,
      text_to_speech
    } = data;

    console.log('generate_speech');
    console.log(data);

    const headers = {
      'xi-api-key': process.env.REACT_APP_ELEVEN_LABS_API_KEY
    };

    axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      {
        text: text_to_speech
      },
      headers
    )
      .then(result => {
        console.log("Response from text_to_speech");
        console.log(result);
        //socket.emit("retrieved_text_to_speech", result.data);
      })
      .catch(err => {
        console.log(err);
        console.log(JSON.stringify(err));
      });
  });
});

const emitSocketEvent = (voiceId, voiceName, socket) => {
  socket.emit("retrieved_text_to_speech", {voiceId: voiceId, voiceName: voiceName})
}

const emitAfterS3BucketPutEvent = (socket) => {
  4724090477636961
}