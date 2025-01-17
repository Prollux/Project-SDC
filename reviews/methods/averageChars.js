const averageChars = (charArr) => {
  let result = {characteristics: {}};
  let counts = {};
  review_ids = [];
  result.recommended = {true: 0, false: 0};
  result.ratings = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
  const charIDs = {
    Quality: 5,
    length: 11,
    Fit: 10,
    Size: 14,
    Comfort: 3,
    Width: 15,
  }

  charArr.forEach(obj => {
    if (!review_ids.includes(obj.review_id)) {
      review_ids.push(obj.review_id);
      if (!result[obj.name]) {
        result[obj.name] = {
                            value : Number(obj.value)};
        counts[obj.name] = 1;
      } else {
        result[obj.name].value += Number(obj.value);
        counts[obj.name]++;
      }
      if (obj.recommend) {
        result.recommended.true++;
      } else {
        result.recommended.false++;
      }
      if (obj.rating) {
      result.ratings[`${obj.rating}`] += 1;
      }
    } else {
      if (!result[obj.name]) {
        result[obj.name] = {
                          value : Number(obj.value)};
        counts[obj.name] = 1;
      } else {
        result[obj.name].value += Number(obj.value);
        counts[obj.name]++;
      }
    }
  })

  for (key in result) {
    if (result[key].value) {
      result.characteristics[key] = {
        value: (result[key].value / counts[key]).toString(),
        id: charIDs[key]
      };
      delete result[key];
    }
  }
  return result;
  };

module.exports = {
  averageChars,
}