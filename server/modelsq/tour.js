const mongoose = require('mongoose')
const validator = require('validator')
var validateDate = require("validate-date");
var isPositiveInteger = require('is-positive-integer');
var myEnv = require('schema')('envIdentifier')
const Site = require('../models/site.js')
var objectid = require('objectid')

var couponSchema = new mongoose.Schema({
    code: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!isPositiveInteger(parseFloat(value))) {
          throw new Error('code coupon must be positive integer')
        }
      }
  
    },
    percent: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
          if (value <= 0)
            throw new Error("duration must be positive number");
        }
    
      },
      start_date: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validateDate(value, responseType = "boolean", dateFormat = "YYYY-MM-DD", dateFormat = "YYYY-DD-MM"))
          throw new Error('required date format');
  
      }
    },
    expire_date: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validateDate(value, responseType = "boolean", dateFormat = "YYYY-MM-DD", dateFormat = "YYYY-DD-MM")) {
          throw new Error('required date format');
        }
      }
    },
    
  },
  { timestamps: true }
);
var TourSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        trim: true
    },
    start_date: {
        type:Date,
        required: true,
        trim: true,
      
    },
    duration: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (!isPositiveInteger(parseFloat(value))) {
              throw new Error('duration must be positive integer');
            }
          }
    },
    price: {
        type: Number,
        default: 0,
        validate(value) {
            if (value <= 0) {
                throw new Error('price must be a postive number')
            }
        }
    },
    
    cupon: [couponSchema],
    
  
site:{
  type:[{
    
    siteID:mongoose.Schema.Types.ObjectId
}]

}
   
}, { timestamps: true }
);

const Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour