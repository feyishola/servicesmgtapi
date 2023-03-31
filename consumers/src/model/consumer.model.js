const mongoose = require('mongoose')
const geocoder = require('../utils/geocoder')

const {Schema, model} = mongoose

const consumerSchema = new Schema({
    consumerName:{type:String, required:true},
    userType:{type:String, enum:["consumer","serviceProvider"], default:"consumer"},
    password:{type:String, required:true},
    services:{type:String,default:undefined},
    phoneNumber:{type:String, required:true, unique:true},
    locationUpdate:{type:Boolean, enum:[false,  true], default:false},
    permanentAddress:{type:String, required:true},
    temporaryAddress:{type:String},
    location: {             //Mongoose GeoJSON is a format for storing geographic points and polygons. That where i got this location obj
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
          type: [Number],
          index: '2dsphere' // MongoDB supports 2dsphere indexes for speeding up geospatial queries. 
        },
        formattedAddress:{type:String},
    },
    createdAt:{type:Date,default:Date.now}
})

// Geocode & create location

consumerSchema.pre('save', async function(next) {

    const loc = await geocoder.geocode(this.permanentAddress);
  
  // const loc = await geocoder.batchGeocode([this.permanentAddress,this.temporaryAddress]);
  
    // console.log("testing location", loc);
  
    this.location = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress
    };
  
    // Do not save address
    this.permanentAddress = undefined;
    next();
  });
  

const consumerModel = model('consumers',consumerSchema)

module.exports = consumerModel