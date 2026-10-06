const renderModel = require("../model/renderer.model");
const { escapeRegex } = require("../utils/helperfuctions");

const PUBLIC_FIELDS = {
  serviceRendererName: 1,
  phoneNumber: 1,
  services: 1,
  bio: 1,
  location: 1,
  rating: 1,
  ratingCount: 1,
  distance: 1,
  createdAt: 1,
};

class ServiceProviderDao {
  createServiceProvider({ serviceRendererName, phoneNumber, services, bio, location, password }) {
    return renderModel.create({
      serviceRendererName,
      phoneNumber,
      services,
      bio,
      location,
      password,
    });
  }

  getServiceProvider(id) {
    return renderModel.findById(id);
  }

  getUserWithPassword(phoneNumber) {
    return renderModel.findOne({ phoneNumber }).select("+password");
  }

  // Providers offering `service` within `meters` of [lng, lat], nearest first.
  // The service filter runs inside $geoNear so the geo index does the heavy lifting.
  getRequiredServiceProviders(service, lng, lat, meters, limit = 50) {
    const geoNear = {
      near: { type: "Point", coordinates: [lng, lat] },
      // Name the field explicitly: older databases still carry a v1 index on
      // location.coordinates, and $geoNear refuses to guess between two
      key: "location",
      distanceField: "distance",
      spherical: true,
      query: { services: { $regex: escapeRegex(service), $options: "i" } },
    };
    if (meters) geoNear.maxDistance = meters;

    return renderModel.aggregate([
      { $geoNear: geoNear },
      { $limit: limit },
      { $project: PUBLIC_FIELDS },
    ]);
  }

  // Distinct services ranked by how many providers offer them
  async getPopularServices(limit = 8) {
    const rows = await renderModel.aggregate([
      { $group: { _id: { $toLower: "$services" }, label: { $first: "$services" }, count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: limit },
    ]);
    return rows.map(({ label, count }) => ({ label, count }));
  }

  updateServiceProvider(id, updates) {
    return renderModel.findByIdAndUpdate(id, { $set: updates }, { returnDocument: "after", runValidators: true });
  }

  // Folds a new score into the running average atomically
  addRating(id, score) {
    return renderModel.findByIdAndUpdate(
      id,
      [
        {
          $set: {
            rating: {
              $round: [
                {
                  $divide: [
                    { $add: [{ $multiply: ["$rating", "$ratingCount"] }, score] },
                    { $add: ["$ratingCount", 1] },
                  ],
                },
                2,
              ],
            },
            ratingCount: { $add: ["$ratingCount", 1] },
          },
        },
      ],
      { returnDocument: "after", updatePipeline: true }
    );
  }

  deleteServiceProvider(id) {
    return renderModel.findByIdAndDelete(id);
  }
}

module.exports = new ServiceProviderDao();
