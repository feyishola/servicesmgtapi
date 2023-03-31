require('dotenv').config({path:'../.env'})
const express = require('express')
require('./connection/mongodb.conn')()
const routes = require('./routes/services.routes')()
const app = express()
const cors = require('cors')

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

app.use('/api/v1/services', routes)

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    
    console.log(`connected to ${PORT}`);
    
 })



