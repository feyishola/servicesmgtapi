const mongoose = require('mongoose')
const geocoder = require('../utils/geocoder');

const {Schema, model} = mongoose

const serviceRendererSchema = new Schema({
    serviceRendererName:{type:String, required:true},
    phoneNumber:{type:String, required:true},
    services:{type:String, required:true},
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
    ratings:{type:Number, enum:[5,4,3,2,1,0], default:0},
    createdAt:{type:Date,default:Date.now}
})

// Geocode & create location

serviceRendererSchema.pre('save', async function(next) {

  const loc = await geocoder.geocode(this.permanentAddress);

// const loc = await geocoder.batchGeocode([this.permanentAddress,this.temporaryAddress]);

  console.log("testing location", loc);

  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress
  };

  // Do not save address
  this.permanentAddress = undefined;
  next();
});

const renderModel = model('serviceRenderer',serviceRendererSchema)


module.exports = renderModel


