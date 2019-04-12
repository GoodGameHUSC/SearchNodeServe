import { app } from './consts';
import mockData from './mockData'
const cors = require('cors')

function containString(string, searchString) {
  return string.includes(searchString)
}
function isNegative(string) {
  return containString(string, '!')
}
function filterByString(field, filterString, absolute = false) {
  if (filterString) {
    let isPass = false;
    if (isNegative(filterString)) {
      filterString = filterString.substring(1, filterString.length)
      if(absolute) isPass = field != filterString;
      else  
      isPass = !containString(field, filterString)
    }
    else{
      if(absolute)
        isPass = field == filterString;
      else
      isPass = containString(field, filterString)
    } 
    return isPass;
  }
  return true;
}
function parseDatetoObject(stringdate) {
  const listDateString = stringdate.split(',');
  const fromDate = listDateString[0] == '' ? null : new Date(listDateString[0])
  const toDate = listDateString[1] == '' ? null : new Date(listDateString[1])
  return {
    fromDate: fromDate,
    toDate: toDate
  }
}
function filterByDate(field, filterDate) { 
  if (filterDate) {
    let isPass = false;
    const isNega = isNegative(filterDate);
    field = new Date(field);
    if (isNega) filterDate = filterDate.substring(1, filterDate.length)

    filterDate = parseDatetoObject(filterDate)
    if (filterDate.fromDate && filterDate.toDate)
      isPass = filterDate.fromDate <= field && field <= filterDate.toDate
    else if (filterDate.fromDate)
      isPass = filterDate.fromDate <= field
    else if (filterDate.toDate)
      isPass = field <= filterDate.toDate
    else isPass = true;
    if (isNega) isPass = !isPass
    return isPass;
  }
  return true;
}
app.get('/',cors(), (req, res) => {
  try{
    const { name, type, date, owner, content, api_key } = req.query;
  const data = mockData.filter((element) => {
    return (filterByString(element.name, name)
      && filterByString(element.ower, owner, true)
      && filterByString(element.type, type)
      && filterByString(element.content, content)
      && filterByDate(element.date,date)
    )
  })
  if (api_key && api_key == 'hungpham_ws_201200') 
    res.json({
      status: 'OK',
      data: data
    },200);
   else {
    res.json({
      status: 'Fail',
      message: 'Expect API key or API key wrong',
      error : 'Authentication problem'
    },401)
  }
  }catch(e){
    res.json({
      status: 'Fail',
      message: 'Some thing went wrong',
      error : e
    },400)
  }
  
});
