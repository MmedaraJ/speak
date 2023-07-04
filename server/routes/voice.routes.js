const VoiceController = require('../controllers/voice.controller');

module.exports = function(app){
    app.post('/api/voices/new', VoiceController.createVoice);
    app.delete('/api/voices/delete', VoiceController.deleteAllVoices);
    app.get('/api/voices/user/:id', VoiceController.getAllVoicesForUser);
}