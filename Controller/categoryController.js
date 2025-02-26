const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const categoryModel = require("../Model/categoryModel");
const ApiError = require("../utils/ApiError");

// @Description: Create a new category
// @Routes : POST /api/v1/categories
// @Access : private
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await categoryModel.create({ name, slug: slugify(name) });
  res
    .status(201)
    .json({ message: "Category created successfully", data: category });
});

//@Desc: get all categories
//@Routes : GET /api/v1/categories
//@Access : public
exports.getCategories = asyncHandler(async (req, res) => {
  // pagination
  // req.query.page * 1 --> convert string to number
  // req.query.page  return String
  const page = req.query.page * 1 || 1; // default page is 1
  // number of items(documents) per page
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit; // calculate the index of the first document to skip --> (2-1) * 5 = 5
  const categories = await categoryModel.find({}).skip(skip).limit(limit);
  if (categories.length === 0) {
    return res.status(404).json({
      message: "No Categories found",
      results: 0,
      page,
      data: [],
    });
  }
  res.status(200).json({
    message: "Categories fetched successfully",
    results: categories.length,
    page,
    data: categories,
  });
});

//@Desc: get specific category by id
//@Routes : GET /api/v1/categories/:id
//@Access : public

exports.getCategoryById = asyncHandler(async (req, res, next) => {
  //  const { id } = req.params; === const id = req.params.id;
  const { id } = req.params;
  const category = await categoryModel.findById(id);
  if (!category) {
    // return res
    //   .status(404)
    //   .json({ message: `Category not found with this id : ${id}` });
    return next(new ApiError(`Category not found with this id : ${id}`, 404));
  }
  res
    .status(200)
    .json({ message: "Category fetched successfully", data: category });
});

//@Desc: update specific category by id
//@Routes : PUT /api/v1/categories/:id
//@Access : private

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const updateCategory = await categoryModel.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!updateCategory) {
    return next(new ApiError(`Category not found with this id : ${id}`, 404));
  }
  res
    .status(200)
    .json({ message: "Category fetched successfully", data: updateCategory });
});

// @Desc    Delete a category
// @Routes  DELETE /api/v1/categories/:id
// @Access  private

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleteCategory = await categoryModel.findByIdAndDelete({ _id: id });
  if (!deleteCategory) {
    return next(new ApiError(`Category not found with this id : ${id}`, 404));
  }
  res.status(204).json({ message: "Category deleted successfully" });
});
