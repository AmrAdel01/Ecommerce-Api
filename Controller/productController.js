const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const productModel = require("../Model/productModel");
const ApiError = require("../utils/ApiError");

// @Description: Create a new product
// @Routes : POST /api/v1/products
// @Access : private
exports.createNewProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await productModel.create(req.body);
  res
    .status(201)
    .json({ message: "product created successfully", data: product });
});

//@Desc: get all products
//@Routes : GET /api/v1/products
//@Access : public
exports.getProducts = asyncHandler(async (req, res) => {
  // pagination
  // req.query.page * 1 --> convert string to number
  // req.query.page  return String
  const page = req.query.page * 1 || 1; // default page is 1
  // number of items(documents) per page
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit; // calculate the index of the first document to skip --> (2-1) * 5 = 5
  const products = await productModel
    .find({})
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });
  if (products.length === 0) {
    return res.status(404).json({
      message: "No Products found",
      results: 0,
      page,
      data: [],
    });
  }
  res.status(200).json({
    message: "products fetched successfully",
    results: products.length,
    page,
    data: products,
  });
});

//@Desc: get specific category by id
//@Routes : GET /api/v1/categories/:id
//@Access : public

exports.getProductyById = asyncHandler(async (req, res, next) => {
  //  const { id } = req.params; === const id = req.params.id;
  const { id } = req.params;
  const product = await productModel
    .findById(id)
    .populate({ path: "category", select: "name -_id" });
  if (!product) {
    // return res
    //   .status(404)
    //   .json({ message: `Category not found with this id : ${id}` });
    return next(new ApiError(`Product not found with this id : ${id}`, 404));
  }
  res
    .status(200)
    .json({ message: "Product fetched successfully", data: product });
});

//@Desc: update specific category by id
//@Routes : PUT /api/v1/categories/:id
//@Access : private

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await productModel.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError(`Product not found with this id : ${id}`, 404));
  }
  res
    .status(200)
    .json({ message: "Product fetched successfully", data: product });
});

// @Desc    Delete a category
// @Routes  DELETE /api/v1/categories/:id
// @Access  private

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleteProduct = await productModel.findByIdAndDelete({ _id: id });
  if (!deleteProduct) {
    return next(new ApiError(`Product not found with this id : ${id}`, 404));
  }
  res.status(204).json({ message: "Product deleted successfully" });
});
