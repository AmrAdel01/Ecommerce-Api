const mongoose = require("mongoose");
// creating a schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required."],
      unique: [true, "Brand name must be unique."],
      minlength: [3, "Brand name must be at least 3 characters long."],
      maxlength: [32, "Brand name must not exceed 32 characters."],
    },
    // slug is used for SEO and URL optimization ex: A and B --> shoping/a-and-b
    // it removes spaces, convert to lowercase and replace spaces with hyphen
    slug: {
      type: String,
      lowercase: true,
    },
    images: String,
  },
  {
    timestamps: true,
  }
);

// convert schema to model
const brandModel = mongoose.model("Brand", brandSchema);

module.exports = brandModel;

//
