
const nodeFetch = require('node-fetch')
// import fetch from 'node-fetch';

const microServiceConnector = (path,method="GET",payload)=>{
    return new Promise(async(resolve,reject)=>{
        const request = await nodeFetch(path,
            {headers:{"Content-Type":"application/json"},
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

