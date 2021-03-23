const averageChars = (charArr) => {
  let result = {};
  let counts = {};

  charArr.forEach(obj => {
    if (!result[obj.name]) {
      result[obj.name] = {id : obj.id,
                          value : Number(obj.value)};
      counts[obj.name] = 1;
    } else {
      result[obj.name].value += Number(obj.value);
      counts[obj.name]++;
    }
  });
  for (key in result) {
    result[key] = result[key].value / counts[key];
  }
  return result;
}

module.exports = {
  averageChars,
}