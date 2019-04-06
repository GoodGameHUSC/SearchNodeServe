import { app } from './consts';
import mockData from './mockData'

function containString(string, searchString) {
  return string.includes(searchString)
}
function isNegative(string) {
  return containString(string, '!')
}
function filterByString(field, filterString) {
  if (filterString) {
    let isPass = false;
    if (isNegative(filterString)) {
      console.log('here')
      filterString = filterString.substring(1, filterString.length)
      isPass = !containString(field, filterString)
    }
    else isPass = containString(field, filterString)
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
    console.log(field);
    if (isNega) filterDate = filterDate.substring(1, filterDate.length)

    filterDate = parseDatetoObject(filterDate)
    console.log(filterDate);
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
app.get('/', (req, res) => {
  const { name, type, date, owner, content } = req.query;
  const data = mockData.filter((element) => {
    return (filterByString(element.name, name)
      && filterByString(element.ower, owner)
      && filterByString(element.type, type)
      && filterByString(element.content, content)
      && filterByDate(element.date,date)
    )
  })
  if (data) {
    res.json({
      status: 'OK',
      data: data
    });
  } else {
    res.json({
      status: 'Fail',
      message: 'Error when read data'
    })
  }
});
