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

const getReviews = (data, callback) => {
  let reviews;
  Reviews.find(data, (err, rdata) => {
    if (err) {
      callback(404);
    } else {
      data.map(review => {

      })
    }
  })
}

const getPhotosbyId = (id, callback) => {
  Photos.find({review_id: id} , (err, results) => {
    if (err) {
      callback([]);
    } else {
      let urlArr = results.map(photo => {
        return photo.url;
      });
      callback(urlArr);
    }
  })
}




/*-------------------------------ASSEMBLY FUNCTIONS--------------------------*/


const combineData = (reviewsArr, photosArr) => {

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