const AWSController = require('../controllers/aws.controller');

module.exports = function(app){
    app.post('/sign_s3', AWSController.sign_s3);
}