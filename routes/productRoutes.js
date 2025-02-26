const express = require("express");

const {
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
  createProductValidator,
} = require("../utils/validator/productValidator");
const {
  createNewProduct,
  getProducts,
  getProductyById,
  updateProduct,
  deleteProduct,
} = require("../Controller/productController");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(createProductValidator, createNewProduct);
router
  .route("/:id")
  .get(getProductValidator, getProductyById)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
