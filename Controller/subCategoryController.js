const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const subCategoryModel = require("../Model/subCategoryModel");
const ApiError = require("../utils/ApiError");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @Description:     Create a new subCategory
// @Routes :         POST /api/v1/subCategories
// @Access :         private
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  res
    .status(201)
    .json({ message: "SubCategory created successfully", data: subCategory });
});

//@Desc:        get all subcategories
//@Routes :     GET /api/v1/categories
//@Access :     public
exports.getSubCategories = asyncHandler(async (req, res) => {
  // pagination
  // req.query.page * 1 --> convert string to number
  // req.query.page  return String
  const page = req.query.page * 1 || 2; // default page is 1
  // number of items(documents) per page
  const limit = req.query.limit * 1 || 6;
  const skip = (page - 1) * limit; // calculate the index of the first document to skip --> (2-1) * 5 = 5

  let filterObj = {};
  if (req.params.categoryId) filterObj = { category: req.params.categoryId };
  const subCategories = await subCategoryModel
    .find(filterObj)
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });
  if (subCategories.length === 0) {
    return res.status(404).json({
      message: "No subcategories found",
      results: 0,
      page,
      data: [],
    });
  }
  res.status(200).json({
    message: "SubCategories fetched successfully",
    results: subCategories.length,
    page,
    data: subCategories,
  });
});

//@Desc: get specific category by id
//@Routes : GET /api/v1/categories/:id
//@Access : public

exports.getSubCategoryById = asyncHandler(async (req, res, next) => {
  //  const { id } = req.params; === const id = req.params.id;
  const { id } = req.params;
  const subCategory = await subCategoryModel.findById(id);
  // .populate({ path: "category", select: "name -_id" });
  if (!subCategory) {
    // return res
    //   .status(404)
    //   .json({ message: `Category not found with this id : ${id}` });
    return next(
      new ApiError(`SubCategory not found with this id : ${id}`, 404)
    );
  }
  res
    .status(200)
    .json({ message: "SubCategory fetched successfully", data: subCategory });
});

//@Desc: update specific subcategory by id
//@Routes : PUT /api/v1/subCategories/:id
//@Access : private

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const updateSubCategory = await subCategoryModel.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true } // return updated document if true
  );
  // .populate({ path: "category", select: "name -_id" });
  if (!updateSubCategory) {
    return next(
      new ApiError(`SubCategory not found with this id : ${id}`, 404)
    );
  }
  res.status(200).json({
    message: "SubCategory fetched successfully",
    data: updateSubCategory,
  });
});

// @Desc    Delete a Subcategory
// @Routes  DELETE /api/v1/subCategories/:id
// @Access  private

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const deleteSubCategory = await subCategoryModel.findByIdAndDelete({
    _id: id,
  });
  if (!deleteSubCategory) {
    return next(
      new ApiError(`SubCategory not found with this id : ${id}`, 404)
    );
  }
  res.status(204).json({ message: "SubCategory deleted successfully" });
});
