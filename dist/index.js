'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _consts = require('./consts');

require('./routes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bodyParser = require('body-parser');
//here routes defined

var cors = require('cors');
_consts.app.use(cors());
// using the JSON body parser
_consts.app.use(bodyParser.urlencoded({ extended: false }));
_consts.app.use(bodyParser.json({ type: 'application/*+json' }));
_consts.app.listen(process.env.PORT || 3000, function () {
  console.log('Serve is running');
});