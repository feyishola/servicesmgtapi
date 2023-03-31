const express = require('express')
const ServiceProviderDao = require('../dao/service-provider.dao')

const {Router} = express

module.exports = ()=>{
    const api = Router()

    api.get('/', async(req,res)=>{
        try {
            let result = await ServiceProviderDao.getAllServiceProviders()
            res.status(200).json({response:true, payload:result})
        } catch (error) {
            res.status(400).json({response:false, payload:error.message})
        }
        
    })

    api.get('/:id', async(req,res)=>{
        try {
            const id = req.params.id
            let result = await ServiceProviderDao.getServiceProvider(id)
            res.status(200).json({response:true, payload:result})
        } catch (error) {
            res.status(400).json({response:false, payload:error.message})
        }
        
    })

    api.post('/', async(req,res)=>{
        try {
            const {serviceRendererName,phoneNumber,services,locationUpdate,permanentAddress,temporaryAddress,ratings,password} = req.body
            const result = await ServiceProviderDao.createServiceProvider(serviceRendererName,phoneNumber,services,locationUpdate,permanentAddress,temporaryAddress,ratings,password)
            res.status(200).json({response:true, payload:result})
        } catch (error) {
            res.status(400).json({response:false, payload:error.message})
        }
    })

    api.put('/:id', async(req,res)=>{
        try {
            const id = req.params.id
            const {phoneNumber,services,locationUpdate,permanentAddress,temporaryAddress,userType,password} = req.body
            const result = await ServiceProviderDao.updateServiceProvider(id,phoneNumber,services,locationUpdate,permanentAddress,temporaryAddress,userType,password)
            res.status(200).json({response:true, payload:result})
        } catch (error) {
            res.status(400).json({response:false, payload:error.message})
        }
    })

    api.delete('/:id', async(req,res)=>{
        try {
            const id = req.params.id
            const result = await ServiceProviderDao.deleteServiceProvider(id)
            res.status(200).json({response:true, payload:result})
        } catch (error) {
            res.status(400).json({response:false, payload:error.message})
        }
    })

    return api;
}