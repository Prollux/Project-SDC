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

const reviews = mongoose.model('review', reviewSchema );