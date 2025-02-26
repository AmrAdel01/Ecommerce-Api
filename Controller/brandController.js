const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const brandModel = require("../Model/brandModel");
const ApiError = require("../utils/ApiError");

// @Description: Create a new brand
// @Routes : POST /api/v1/brands
// @Access : private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await brandModel.create({ name, slug: slugify(name) });
  res.status(201).json({ message: "Brand created successfully", data: brand });
});

//@Desc: get all categories
//@Routes : GET /api/v1/brands
//@Access : public
exports.getBrands = asyncHandler(async (req, res) => {
  // pagination
  // req.query.page * 1 --> convert string to number
  // req.query.page  return String
  const page = req.query.page * 1 || 1; // default page is 1
  // number of items(documents) per page
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit; // calculate the index of the first document to skip --> (2-1) * 5 = 5
  const brand = await brandModel.find({}).skip(skip).limit(limit);
  if (brand.length === 0) {
    return res.status(404).json({
      message: "No Brands found",
      results: 0,
      page,
      data: [],
    });
  }
  res.status(200).json({
    message: "brands fetched successfully",
    results: brand.length,
    page,
    data: brand,
  });
});

//@Desc: get specific brand by id
//@Routes : GET /api/v1/brand/:id
//@Access : public

exports.getBrandById = asyncHandler(async (req, res, next) => {
  //  const { id } = req.params; === const id = req.params.id;
  const { id } = req.params;
  const brand = await brandModel.findById(id);
  if (!brand) {
    // return res
    //   .status(404)
    //   .json({ message: `brand not found with this id : ${id}` });
    return next(new ApiError(`brand not found with this id : ${id}`, 404));
  }
  res.status(200).json({ message: "brand fetched successfully", data: brand });
});

//@Desc: update specific brand by id
//@Routes : PUT /api/v1/brand/:id
//@Access : private

exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const updateBrand = await brandModel.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!updateBrand) {
    return next(new ApiError(`Brand not found with this id : ${id}`, 404));
  }
  res
    .status(200)
    .json({ message: "Brand fetched successfully", data: updateBrand });
});

// @Desc    Delete a brand
// @Routes  DELETE /api/v1/brand/:id
// @Access  private

exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleteBrand = await brandModel.findByIdAndDelete({ _id: id });
  if (!deleteBrand) {
    return next(new ApiError(`Brand not found with this id : ${id}`, 404));
  }
  res.status(204).json({ message: "Brand deleted successfully" });
});
