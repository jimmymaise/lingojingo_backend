'use strict';

const Glue = require('glue');
const Manifest = require('./manifest');

const composeOptions = {
  relativeTo: __dirname
};

module.exports = async () => {
  return Glue.compose(Manifest.get('/'), composeOptions);
}
