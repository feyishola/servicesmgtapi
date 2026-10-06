const { Schema, model } = require("mongoose");

const serviceRendererSchema = new Schema(
  {
    serviceRendererName: { type: String, required: true, trim: true, maxlength: 80 },
    userType: { type: String, enum: ["consumer", "serviceProvider"], default: "serviceProvider" },
    password: { type: String, required: true, select: false },
    phoneNumber: { type: String, required: true, unique: true, trim: true },
    services: { type: String, required: true, trim: true, maxlength: 80 },
    bio: { type: String, trim: true, maxlength: 160, default: "" },
    // GeoJSON point; coordinates are [longitude, latitude]
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
      formattedAddress: { type: String },
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    ratingCount: { type: Number, min: 0, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

serviceRendererSchema.index({ location: "2dsphere" });
serviceRendererSchema.index({ services: "text" });

module.exports = model("serviceRenderer", serviceRendererSchema);
