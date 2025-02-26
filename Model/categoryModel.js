const mongoose = require("mongoose");
// creating a schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
      unique: [true, "Category name must be unique."],
      minlength: [3, "Category name must be at least 3 characters long."],
      maxlength: [32, "Category name must not exceed 32 characters."],
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
const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;

//
