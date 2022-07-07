const mongoose = require("mongoose");

const PlantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  previewPicture: String,
  pictures: [String],
  rating: {
    type: [Object],
    userId: Number,
    value: Number,
  },
  soldCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Plant", PlantSchema);
