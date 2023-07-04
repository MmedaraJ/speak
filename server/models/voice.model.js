const mongoose = require('mongoose');

const VoiceSchema = new mongoose.Schema({
    user_id: { 
        type: String,
        required: [true],
        trim: true,
    },
    voice_name: { 
        type: String,
        required: [true],
        trim: true,
    },
    s3_key: { 
        type: String,
        required: [true],
        trim: true,
    },
    voice_id: { 
        type: String,
        required: [true],
        trim: true,
    },
}, { timestamps: true });

module.exports.Voice = mongoose.model('Voice', VoiceSchema);