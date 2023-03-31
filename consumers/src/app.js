require('dotenv').config({path:'../.env'})
require('./connection/mongodb.con')()
const routes = require('./routes/consumer.routes')()
const cors = require('cors')
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.use('/api/v1/consumer', routes)

const PORT = process.env.PORT || 5001


app.listen(PORT, ()=>{
    console.log(`connected to the consumer microservice on port ${PORT}`);
})

