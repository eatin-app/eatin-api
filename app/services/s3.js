'use strict';

var AWS = require('aws-sdk');
var nconf = require('nconf');
var s3Client = new AWS.S3({
  accessKeyId: nconf.get('AWS_ACCESS_KEY_ID'),
  secretAccessKey: nconf.get('AWS_SECRET_ACCESS_KEY')
});

exports.upload = function (image, callback) {
  s3Client.putObject({
    Bucket: nconf.get('S3_IMAGE_BUCKET'),
    Key: 'images/' + image.filename,
    ACL: 'public-read',
    Body: image,
    ContentLength: image.filesize,
    ContentType: image.mimetype
  }, callback);
};
