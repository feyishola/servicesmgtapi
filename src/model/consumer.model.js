const mongoose = require('mongoose')

const {Schema, model} = mongoose

const consumerSchema = new Schema({
    consumerName:{type:String, required:true},
    phoneNumber:{type:String, required:true},
    currentLocation:{type:String, required:true}
})

const consumerModel = model('consumers',consumerSchema)

module.exports = consumerModel