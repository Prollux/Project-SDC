const helpfulness = (reviewsArr) => {

  return reviewsArr.sort((a, b) => b.helpfulness - a.helpfulness)
}

const newest = (reviewsArr) => {

  return reviewsArr.sort((a, b) => intByDate(a.date) - intByDate(b.date));
}

const relevant = (reviewsArr) => {

  return reviewsArr.sort((a, b) => (intByDate(a.date) - a.helpfulness * 7) - (intByDate(b.date)) - b.helpfulness * 7);
}

const monthVals = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12
};

const convertandReduce = (arr) => {
  arr[0] = monthVals[arr[0]] * 30;
  arr[1] = Number(arr[1]);
  arr[2] = Number(arr[2]) * 365;
  return arr.reduce((acc, val) => acc + val);
}

const intByDate = (str) => {
  let currentDate = convertandReduce(new Date().toString().split(' ').slice(1, 4));
  let reviewDate = convertandReduce(new Date(str).toString().split(' ').slice(1, 4));
  return currentDate - reviewDate;
}

module.exports = {
  helpfulness,
  newest,
  relevant,
}
