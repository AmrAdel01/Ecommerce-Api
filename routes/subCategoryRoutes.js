const express = require("express");
const {
  createSubCategory,
  getSubCategoryById,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
} = require("../Controller/subCategoryController");
const {
  createsubCategoryValidator,
  getsubCategoryValidator,
  updatesubCategoryValidator,
  deletesubCategoryValidator,
} = require("../utils/validator/subCategoryValidator");

// mergeParams: true enables using :categoryId in subcategory routes (e.g., /categories/:categoryId/subcategories/:id)
// allow us to access the category id from the parent category route in the subcategory route
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(setCategoryIdToBody, createsubCategoryValidator, createSubCategory)
  .get(getSubCategories);
router
  .route("/:id")
  .get(getsubCategoryValidator, getSubCategoryById)
  .put(updatesubCategoryValidator, updateSubCategory)
  .delete(deletesubCategoryValidator, deleteSubCategory);

module.exports = router;
