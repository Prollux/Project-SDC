const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/reviewData',
{useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('successfully connected to database');
});

const metaSchema = new mongoose.Schema({
  product_id: { type: Number, index: true },
  review_id: { type: Number, index: true },
  name: String,
  value: Number,
  rating: Number,
  recommend: Boolean
})


const reviewSchema  = new mongoose.Schema({
  product_id: { type: Number, required: true, index: true },
  review_id: { type: Number, required: true, unique: true },
  rating: { type: Number, required: true },
  date:  { type: String, required: true },
  summary: { type: String, required: true },
  body: { type: String, required: true },
  recommend: { type: Boolean, required: true },
  reported: Boolean,
  reviewer_name: { type: String, required: true },
  reviewer_email: String,
  response: String,
  helpfulness: { type: Number, required: true },
  photos: [
    { url: String}
  ]
});

const Reviews = mongoose.model('Reviews', reviewSchema);
const MetaData = mongoose.model('MetaData', metaSchema);

/*--------------------------CSV PARSER FUNCTIONS----------------------------*/

const convertReviews = (arr) => {
  const allreviews = arr.map(obj => {
    const review = new Reviews({
      product_id: +obj.product_id,
      review_id: obj.id,
      rating: obj.rating,
      date: obj.date,
      summary: obj.summary,
      body: obj.body,
      recommend: obj.recommend,
      reported: obj.reported,
      reviewer_name: obj.reviewer_name,
      reviewer_email: obj.reviewer_email,
      response: obj.response,
      helpfulness: obj.helpfulness,
      photos: obj.photos
    });
    return review;
  });
    return allreviews;
  };


  const convertMeta = (arr) => {
    const allChars = arr.map(obj => {
      const char = new MetaData({
        product_id: obj.product_id,
        value: obj.value,
        name: obj.name,
        review_id: obj.review_id,
        rating: obj.rating,
        recommend: obj.recommend
      })
      return char;
    })
    return allChars;
  }



const insertAll = (model, arr, callback) => {
  model.collection.insertMany(arr, callback);
};


/*--------------------------------DATABASE QUERIES---------------------------*/

const getReviews = async (data, callback) => {
  Reviews.find(data, (err, result) => {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  }).lean()
}


const getMeta = (id, callback) => {
 MetaData.find({product_id: id}, (err, result) => {
    if (err) {
      callback(err)
    } else {
      callback(null, result);
    }
  }).lean()
}




/*-----------------------------ASSEMBLY FUNCTIONS-----------------------------*/


const combineData = async (reviewsArr, callback) => {
  let aggregate = await Promise.all(reviewsArr.map(async (review) => {
    let photos = await getPhotosbyId(review.id);
    review.photos = photos;
    return review;
  }))
  return aggregate;
}


/*------------------------------------EXPORTS---------------------------------*/
module.exports = {
  convertReviews,
  convertMeta,
  insertAll,
  getReviews,
  getMeta,
  Reviews,
  MetaData,
}