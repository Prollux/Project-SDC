const sortBy = {};

sortBy.helpfulness = (reviewsArr) => {
  return reviewsArr.sort((a, b) => b.helpfulness - a.helpfulness)
}
