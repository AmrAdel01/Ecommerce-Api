const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory name must be unique."],
      minlength: [3, "Subcategory name must be at least 3 characters long."],
      maxlength: [32, "Subcategory name must not exceed 32 characters."],
    },
    slug: { type: String, lowercase: true },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "Subcategory must belong to a category."],
    },
  },
  { timestamps: true }
);
const subCategoryModel = mongoose.model("subCategory", subCategorySchema);

module.exports = subCategoryModel;
