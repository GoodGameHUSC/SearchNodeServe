'use strict';

var _consts = require('./consts');

var _mockData = require('./mockData');

var _mockData2 = _interopRequireDefault(_mockData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cors = require('cors');

function containString(string, searchString) {
  return string.includes(searchString);
}
function isNegative(string) {
  return containString(string, '!');
}
function filterByString(field, filterString) {
  var absolute = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (filterString) {
    var isPass = false;
    if (isNegative(filterString)) {
      filterString = filterString.substring(1, filterString.length);
      if (absolute) isPass = field != filterString;else isPass = !containString(field, filterString);
    } else {
      if (absolute) isPass = field == filterString;else isPass = containString(field, filterString);
    }
    return isPass;
  }
  return true;
}
function parseDatetoObject(stringdate) {
  var listDateString = stringdate.split(',');
  var fromDate = listDateString[0] == '' ? null : new Date(listDateString[0]);
  var toDate = listDateString[1] == '' ? null : new Date(listDateString[1]);
  return {
    fromDate: fromDate,
    toDate: toDate
  };
}
function filterByDate(field, filterDate) {
  if (filterDate) {
    var isPass = false;
    var isNega = isNegative(filterDate);
    field = new Date(field);
    if (isNega) filterDate = filterDate.substring(1, filterDate.length);

    filterDate = parseDatetoObject(filterDate);
    if (filterDate.fromDate && filterDate.toDate) isPass = filterDate.fromDate <= field && field <= filterDate.toDate;else if (filterDate.fromDate) isPass = filterDate.fromDate <= field;else if (filterDate.toDate) isPass = field <= filterDate.toDate;else isPass = true;
    if (isNega) isPass = !isPass;
    return isPass;
  }
  return true;
}
_consts.app.get('/', cors(), function (req, res) {
  try {
    var _req$query = req.query,
        name = _req$query.name,
        type = _req$query.type,
        date = _req$query.date,
        owner = _req$query.owner,
        content = _req$query.content,
        api_key = _req$query.api_key;

    var data = _mockData2.default.filter(function (element) {
      return filterByString(element.name, name) && filterByString(element.ower, owner, true) && filterByString(element.type, type) && filterByString(element.content, content) && filterByDate(element.date, date);
    });
    if (api_key && api_key == 'hungpham_ws_201200') res.json({
      status: 'OK',
      data: data
    }, 200);else {
      res.json({
        status: 'Fail',
        message: 'Expect API key or API key wrong',
        error: 'Authentication problem'
      }, 401);
    }
  } catch (e) {
    res.json({
      status: 'Fail',
      message: 'Some thing went wrong',
      error: e
    }, 400);
  }
});