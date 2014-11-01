'use strict';

var async = require('async');
var GM = require('gm');
var gm = GM.subClass({ imageMagick: true });

//## Doesn't seem to work. Filesize or something is wrong which results in gray bottom in images

exports.resize = function resize (source, sizes, callback) {
  var name = source.filename;

  async.map(sizes, function (size, done) {
    gm(source, name + size.suffix + '.jpg')
    .resize(size.width, size.height, '>')
    .filesize({ bufferStream: true }, function (err, filesize) {
      if(err) {
        return done(err);
      }

      var image = this.stream('jpg');

      image.filesize = parseInt(filesize);
      image.filename = name + size.suffix + '.jpg';
      done(null, image);
    });
  }, callback);
};
