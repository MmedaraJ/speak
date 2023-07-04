const { Voice } = require("../models/voice.model");

module.exports.createVoice = (request, response) => {
    const {
        user_id,
        voice_name,
        s3_key,
        voice_id
    } = request.body;

    Voice.create({
        user_id,
        voice_name,
        s3_key,
        voice_id
    })
        .then(voice => {
            console.log(voice);
            response.json(voice);
        })
        .catch(err => {
            console.log(err);
            response.status(400).json(err);
        });
}

module.exports.getAllVoicesForUser = (request, response) => {
    Voice.find({
        user_id: request.params.id
    })
        .then(users => response.json(users))
        .catch(err => console.log(err));
}

module.exports.deleteAllVoices = (request, response) => {
    Voice.deleteMany({})
        .then(res => response.json(res))
        .catch(err => console.log(err));
}