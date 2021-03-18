const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/reviewData',
{useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('successfully connected to database');
});


const reviewSchema  = new mongoose.Schema({
  product_id: { type: String, required: true, index: true },
  id: { type: Number, required: true, unique: true },
  rating: { type: Number, required: true },
  date:  { type: String, required: true },
  summary: { type: String, required: true },
  body: { type: String, required: true },
  recommend: { type: Boolean, required: true },
  reported: Boolean,
  reviewer_name: { type: String, required: true },
  reviewer_email: String,
  response: String,
  helpfulness: { type: Number, required: true }
});

const photoSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  review_id: { type: Number, required: true, index: true},
  url: { type: String, required: true }
});

const Reviews = mongoose.model('Reviews', reviewSchema);
const Photos = mongoose.model('Photos', photoSchema);

/*--------------------------CSV PARSER FUNCTIONS----------------------------*/

const convertReviews = (arr) => {
  console.log('converting...');
  const allreviews = arr.map(obj => {
    const review = new Reviews({
      product_id: obj.product_id,
      id: obj.id,
      rating: obj.rating,
      date: obj.date,
      summary: obj.summary,
      recommend: obj.recommend,
      reported: obj.reported,
      reviewer_name: obj.reviewer_name,
      reviewer_email: obj.reviewer_email,
      response: obj.response,
      helpfulness: obj.helpfulness
    });
    return review;
  });
    return allreviews;
  };

  const convertPhotos = (arr) => {
    console.log('converting...');
    const allPhotos = arr.map(obj => {
      const photo = new Photos({
        id: obj.id,
        review_id: obj.review_id,
        url: obj.url
      })
      return photo;
    })
    return allPhotos;
  }



const insertAll = (model, arr, callback) => {
  console.log('inserting...');
  model.collection.insertMany(arr, callback);
};


/*------------------------------------DATABASE QUERIES------------------------*/

const getReviews = async (data, callback) => {
  console.log('data');
  let reviews = await Reviews.find(data).lean();
  reviews = await combineData(reviews);
  callback(null, reviews);
}


const getPhotosbyId = async (id) => {
  console.log('getPhotosbyId invoked');
  let urls = await Photos.find({"review_id": id}).lean();
  urls = urls.map(photo => photo.url);
    return urls;
}




/*-------------------------------ASSEMBLY FUNCTIONS--------------------------*/


const combineData = async (reviewsArr, callback) => {
  console.log(reviewsArr);
  let aggregate = await Promise.all(reviewsArr.map(async (review) => {
    let photos = await getPhotosbyId(review.id);
    review.photos = photos;
    return review;
  }))
  return aggregate;
}

module.exports = {
  convertReviews,
  convertPhotos,
  insertAll,
  getReviews,
  getPhotosbyId,
  Reviews,
  Photos,
}