const helpfulness = (reviewsArr) => {
  return reviewsArr.sort((a, b) => b.helpfulness - a.helpfulness)
}

module.exports = {
  helpfulness,
}
