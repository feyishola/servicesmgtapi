
const nodeFetch = require('node-fetch')

const microServiceConnector = (path,method="GET",payload)=>{
    return new Promise(async(resolve,reject)=>{
        const request = await nodeFetch(path,
            {Headers:{"Content-Type":"application/json"},
            method,
            body:payload?JSON.stringify(payload):null})

        const response = await request.json()

        if(response){
            resolve(response)
        }else{
            reject("Error occurred in connecting to microservice")
        }

    })
}

module.exports = microServiceConnector

