const averageChars = (charArr) => {
  debugger;
  let result = {};
  let counts = {};
  review_ids = [];
  result.recommend = {true: 0, false: 0};
  result.rating = 0;
  counts.rating = 0;


  charArr.forEach(obj => {
    if (!review_ids.includes(obj.review_id)) {
      review_ids.push(obj.review_id);
      if (!result[obj.name]) {
        result[obj.name] = {id : obj.id,
                            value : Number(obj.value)};
        counts[obj.name] = 1;
      } else {
        result[obj.name].value += Number(obj.value);
        counts[obj.name]++;
      }
      if (obj.recommend) {
        result.recommend.true++;
      } else {
        result.recommend.false++;
      }
      result.rating += obj.rating;
      counts.rating += 1
    } else {
      if (!result[obj.name]) {
        result[obj.name] = {id : obj.id,
                          value : Number(obj.value)};
        counts[obj.name] = 1;
      } else {
        result[obj.name].value += Number(obj.value);
        counts[obj.name]++;
      }
    }
  })

  for (key in result) {
    if (typeof result[key] !== 'object') {
      result[key] = result[key].value / counts[key];
    }
  }
  return result;
  };

module.exports = {
  averageChars,
}