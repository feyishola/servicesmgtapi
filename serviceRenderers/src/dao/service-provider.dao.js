const renderModel = require('../model/renderer.model')

class ServiceProviderDao {

    async createServiceProvider(serviceRendererName,phoneNumber,services,locationUpdate,permanentAddress,temporaryAddress,ratings,password){
        const newserviceProvider = new renderModel({
            serviceRendererName,
            phoneNumber,
            services,
            locationUpdate,
            permanentAddress,
            temporaryAddress,
            ratings,
            password
        })
        const result = await newserviceProvider.save()
        return result
    }

    async getServiceProvider(id){
        let result = await renderModel.findById(id)
        return result
    }

    async getAllServiceProviders(){
        const result = await renderModel.find()
        return result
    }

    async updateServiceProvider(id,phoneNumber,services,locationUpdate,permanentAddress,temporaryAddress,userType,password){
        
        const updates = await renderModel.findByIdAndUpdate({_id:id}, {$set:{phoneNumber,services,locationUpdate,permanentAddress,temporaryAddress,userType,password}})
        return updates
    }

    async deleteServiceProvider(id){
        const serviceProvider = await renderModel.findByIdAndDelete(id)
        return "ServiceProvider deleted Successfully"
    }
}

module.exports = new ServiceProviderDao()