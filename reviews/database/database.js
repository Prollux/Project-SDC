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

const photos = new mongoose.Schema({
  id: { type: Number, required: true },
  review_id: { type: Number, required: true },
  url: { type: String, required: true }
});

const Reviews = mongoose.model('Reviews', reviewSchema );

const convertAll = (arr) => {
  console.log('converting...');
  debugger;
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


const insertAll = (model, arr, callback) => {
  console.log('inserting...');
  debugger;
  model.collection.insertMany(arr, callback);
};

const deleteAll = (res) => {
  Reviews.collection.deleteMany();
  res.send('done');
};

module.exports = {
  convertAll,
  insertAll,
  Reviews,
  deleteAll,
}