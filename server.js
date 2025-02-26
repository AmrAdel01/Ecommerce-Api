const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({
  path: "./config.env",
});

const dbConnection = require("./config/database");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const productRoutes = require("./routes/productRoutes");
const ApiError = require("./utils/ApiError");
const globalError = require("./middleware/errorMiddleware");

// database connection
dbConnection();

// express app setup
const app = express();

// middleware for parsing JSON request bodies
app.use(express.json());

// middleware setup
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // log requests to the console
  console.log(`mode : ${process.env.NODE_ENV} `);
}

//Mount routes
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/subCategories", subCategoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/products", productRoutes);

// route handling errors
app.all("*", (req, res, next) => {
  // const err = new Error();
  // next(err.message);
  next(new ApiError(`can't find this route : ${req.originalUrl}`, 400));
});

// global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

// handliing rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection error: ${err.message} | ${err.name}`);
  server.close(() => {
    console.error("Sutting down...");
    process.exit(1);
  }); // close the server and exit the process
});
