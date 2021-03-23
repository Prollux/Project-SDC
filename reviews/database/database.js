const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/reviewData',
{useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('successfully connected to database');
});


/*-----------------------------Schemas---------------------------*/

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

/*--------------------------CSV PARSER FUNCTIONS------------------*/

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


/*--------------------------DATABASE QUERIES----------------------*/

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


const AddReview = async (obj, callback) => {
  const charIDs = {
    '5': 'Quality',
    '11': 'Length',
    '10': 'Fit',
    '14': 'Size',
    '3': 'Comfort',
    '15': 'Width'
  }

  let idObj = await Reviews.find().sort({review_id: -1}).limit(1).lean();
  let newId = idObj[0].review_id + 1;
  let newReview = new Reviews({
    product_id: obj.product_id,
    review_id: newId,
    rating: +obj.rating,
    date: new Date().toString().substring(3, 15),
    summary: obj.summary,
    body: obj.body,
    recommend: JSON.parse(obj.recommend),
    reported: obj.reported,
    reviewer_name: obj.name,
    reviewer_email: obj.email,
    response: null,
    helpfulness: 0,
    photos: obj.photos
  })

  let meta = Object.keys(obj.characteristics).map(key => {
    let newMeta = new MetaData({
      product_id: +obj.product_id,
      value: obj.characteristics[key].value,
      name: charIDs[key],
      review_id: newId,
      rating: obj.rating,
      recommend: JSON.parse(obj.recommend)
    });

    return newMeta;
  })
  Reviews.create(newReview, (err) => {
    if (err) {
      debugger;
      callback(err)
      } else {
        MetaData.insertMany(meta, (err) => {
          if (err) {
            debugger;
          callback(err)
        } else {
          callback(null)
        }
      })
    }
  })
}





/*-----------------------ASSEMBLY FUNCTIONS-----------------------*/



/*----------------------------EXPORTS-----------------------------*/
module.exports = {
  convertReviews,
  convertMeta,
  insertAll,
  getReviews,
  getMeta,
  AddReview,
  Reviews,
  MetaData,
}