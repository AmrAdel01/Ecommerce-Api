const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getsubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id format "),
  validatorMiddleware,
];

exports.createsubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory name is required. ")
    .isLength({ min: 2 })
    .withMessage("subCategory name must be at least 3 characters long.")
    .isLength({ max: 32 })
    .withMessage("subCategory name must not exceed 32 characters."),
  check("category")
    .notEmpty()
    .withMessage("Sub category must belong to a category.")
    .isMongoId()
    .withMessage("Invalid category id format."),
  validatorMiddleware,
];

exports.updatesubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id format "),
  validatorMiddleware,
];
exports.deletesubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory id format "),
  validatorMiddleware,
];
