const mongoose = require("mongoose");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const categoryModel = require("../../Model/categoryModel");
const subCategoryModel = require("../../Model/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product name is required. ")
    .isLength({ min: 3 })
    .withMessage("Product name must be at least 3 characters long.")
    .isLength({ max: 128 })
    .withMessage("Product name must not exceed 32 characters."),
  check("description")
    .notEmpty()
    .withMessage("Product description is required.")
    .isLength({ min: 10 })
    .withMessage("Product description must be at least 10 characters long.")
    .isLength({ max: 500 })
    .withMessage("Product description must not exceed 500 characters."),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required.")
    .isNumeric()
    .withMessage("product quantity must be a number."),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number."),
  check("price")
    .notEmpty()
    .withMessage("Product price is required.")
    .isNumeric()
    .withMessage("Product price must be a number.")
    .isLength({ max: 32 }),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product price after discount must be a number.")
    .toFloat()
    .custom((value, { req }) => {
      if (value > req.body.price) {
        throw new Error(
          "Product price after discount cannot be greater than product price."
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage(" availableColors must be an array"),
  check("imageCover")
    .notEmpty()
    .withMessage("Product cover image is required."),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images must be an array"),
  check("category")
    .notEmpty()
    .withMessage("Product category is required.")
    .isMongoId()
    .withMessage("Invalid category id format.")
    .custom((categoryId) =>
      categoryModel.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(new Error("Invalid category id."));
        }
      })
    ),
  check("subCategories")
    .optional()
    .isArray()
    .withMessage("Subcategories must be an array.")
    .custom(async (subCategoriesIds, { req }) => {
      // Validate each ID
      const validIds = subCategoriesIds.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );

      if (validIds.length === 0) {
        throw new Error("No valid subcategory IDs provided.");
      }

      // Check if all valid subcategories exist
      const existingSubCategories = await subCategoryModel.find({
        _id: { $in: validIds },
      });

      if (existingSubCategories.length !== validIds.length) {
        throw new Error("One or more subcategories do not exist.");
      }

      // Ensure each subcategory belongs to the given category
      const categoryId = req.body.category;
      if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
        throw new Error("Invalid category ID.");
      }

      const invalidSubCategories = existingSubCategories.filter(
        (subCategory) => subCategory.category.toString() !== categoryId
      );

      if (invalidSubCategories.length > 0) {
        throw new Error(
          "Some subcategories do not belong to the specified category."
        );
      }

      return true;
    }),

  check("ratingAverage")
    .optional()
    .isNumeric()
    .withMessage("Rating average must be a number.")
    .isLength({ min: 1 })
    .withMessage("Rating average must be at least 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating average must be at most 5.0"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("Rating quantity must be a number."),
  validatorMiddleware,
];
exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid category id format "),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format "),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format "),
  validatorMiddleware,
];
