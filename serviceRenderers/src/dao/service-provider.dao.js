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

    async getRequiredServiceProviders(service,lng,lat,meters){

        const result = await renderModel.aggregate([
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [lng, lat]
                },
                distanceField: "distance",
                spherical: true,
                maxDistance: meters
              }
            },
            {
              $match: {
                services: { $regex: service, $options: "i" }
              }
            }
          ]);
          
        //   In this code, we first use $geoNear to find the documents within a 5000 meter/ a certain distance in meters radius of the given coordinates. We then use $match to filter the results based on the service name. The $regex operator is used to perform a case-insensitive search for the given service name. You can check down for the struggle before arriving at dis
          return result;
        
    }

    async getUser(phoneNumber){
        const result = await renderModel.findOne({phoneNumber})
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









//  getRequiredServiceProviders(service,lng,lat){

//     // This worked but returnd all services based on search not minding how close or far

//         const result = await renderModel.find({
//             "$text":{"$search":service},
//             "location":{
//                 "$geoWithin":{
//                     "$centerSphere":[[
//                         lng,
//                         lat
//                     ],5000]
//                 }
//             }
//         })

//         return result


//     // This returned an error "$match with $text is only allowed as the first pipeline stage" so the code used eventually fixed it

//         const result = await renderModel.aggregate([
//             {
//             $geoNear: {
//                 near: { type: "Point", coordinates: [lng, lat] },
//                 distanceField: "distance",
//                 spherical: true,
//                 maxDistance: 5000
//             }
//             },
//             {
//             $match: {
//                 $text: { $search: service }
//             }
//             }
//         ]);
//         console.log({ result });
//         return result;

//         // Then i tried is but didnt work

//         const result = await renderModel.aggregate([
//             {
//             "$search": {
//                 "index": "services",
//                 "compound": {
//                 "must": [
//                     {
//                     "query_string": {
//                         "query": service,
//                         "default_operator": "AND",
//                         "default_field": "services"
//                     }
//                     },
//                     {
//                     "geo_within": {
//                         "circle": {
//                         "center": {
//                             "type": "Point",
//                             "coordinates": [lng, lat]
//                         },
//                         "radius": 1000
//                         },
//                         "path": "location"
//                     }
//                     }
//                 ]
//                 }
//             }
//             }
//         ]);
//         return result


//         // Tried dis but found out i needed to index my services in my schema and lots more
        
//         const result = await renderModel.aggregate(
//             [
//                 {
//                     "$search":{
//                         "index":"String",
//                         "compound":{
//                             "must":[
//                                 {
//                                     "String":{
//                                         "query":`${service}`,
//                                         "path":"services"
//                                     }
//                                 },
//                                 {
//                                     "geoWithin":{
//                                         "circle":{
//                                             "center":{
//                                                 "type":"Point",
//                                                 "coordinates":[lng,lat]
//                                             },
//                                             "radius":1000
//                                         },
//                                         "path":"location"
//                                     }
//                                 }
//                             ]
//                         }
//                     }
//                 }
//             ]
//         )

//         return result


// }