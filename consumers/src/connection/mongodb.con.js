const mongoose = require('mongoose')

module.exports = async ()=>{

    const dbConn = mongoose.connection
    
    dbConn.on('connected', ()=>{
        console.log("connected to mongodb");
    })
    .on('error', (err)=>{
        console.log('error occured on connecting to mongo', err.message);
    })
    .on('disconnected', ()=>{
        setTimeout(async()=>{
            await mongoose.connect(process.env.MONGO_URI)
        },3000)
    })

    await mongoose.connect(process.env.MONGO_URI)
}