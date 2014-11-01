'use strict';

var mongoose = require('mongoose');


var Media = module.exports = mongoose.Schema({
  created: { type: Date, default: Date.now },
  stored: { type: Boolean, default: false, index: true },
  uploader: { type: mongoose.Schema.ObjectId, ref: 'User', index: true },
  meta: {} // Might wanna store mimetype and dimensions and stuff
});

Media.statics.sizes = [
  {
    suffix: '-original',
    height: 9999,
    width: 9999
  },
  {
    suffix: '-large',
    height: 1280,
    width: 1280,
  },
  {
    suffix: '-medium',
    height: 640,
    width: 640
  },
  {
    suffix: '-small',
    height: 320,
    width: 320
  }
];

