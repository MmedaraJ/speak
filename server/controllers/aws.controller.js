var aws = require('aws-sdk'); 
require('dotenv').config();

aws.config.update({
    region: process.env.REACT_APP_S3_REGION.trim(),
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY.trim(),
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY.trim()
});
  
const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;

module.exports.sign_s3 = (req, res) => {
    const s3 = new aws.S3();  // Create a new instance of S3
    const {
        fileName,
        fileType,
        user_id
    } = req.body;
    const key = `audios/${user_id}/${fileName}.${fileType}`;
    /* const fileName = req.body.fileName;
    const fileType = req.body.fileType; */
    // Set up the payload of what we are sending to the S3 api
    const s3Params = {
      Bucket: S3_BUCKET.trim(),
      Key: key,
      Expires: 500,
      ContentType: fileType,
      ACL: 'public-read'
    };

    // Make a request to the S3 API to get a signed URL which we can use to upload our file
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
        console.log(err);
        res.json({success: false, error: err})
      }
      // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved. 
      const returnData = {
          signedRequest: data,
          url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
          key: key
      };
      // Send it all back
      res.json({success:true, data:{returnData}});
    });
}