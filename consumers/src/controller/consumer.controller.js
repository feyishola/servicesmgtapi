const ConsumerModel = require("../model/consumer.model");

class ConsumerController {
  async createConsumer(
    consumerName,
    phoneNumber,
    locationUpdate,
    permanentAddress,
    temporaryAddress,
    password
  ) {
    const newConsumer = new ConsumerModel({
      consumerName,
      phoneNumber,
      locationUpdate,
      permanentAddress,
      temporaryAddress,
      password,
    });
    const result = await newConsumer.save();
    return result;
  }

  async getSingleConsumer(id) {
    let result = await ConsumerModel.findById(id);
    return result;
  }

  async getAllConsumers() {
    const result = await ConsumerModel.find();
    return result;
  }

  async getUser(phoneNumber) {
    const result = await ConsumerModel.findOne({ phoneNumber });
    console.log({ result });
    return result;
  }

  async updateConsumer(
    id,
    consumerName,
    phoneNumber,
    locationUpdate,
    permanentAddress,
    temporaryAddress,
    userType,
    password,
    services
  ) {
    const result = await ConsumerModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          consumerName,
          phoneNumber,
          locationUpdate,
          permanentAddress,
          temporaryAddress,
          userType,
          password,
          services,
        },
      }
    );
    return result;
  }

  async deleteConsumer(id) {
    const result = await ConsumerModel.findByIdAndDelete(id);
    return "Consumer successfully deleted";
  }
}

module.exports = new ConsumerController();
