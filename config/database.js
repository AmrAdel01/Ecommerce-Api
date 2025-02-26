const mongoose = require("mongoose");

// database connection setup
const dbConnection = () => {
  mongoose.connect(process.env.DB_URL).then((conn) => {
    console.log(`Database connected: ${conn.connection.host} `);
  });
  // .catch((err) => {
  //   console.error(`Error connecting to the database: ${err}`);
  //   process.exit(1); // Exit application with error
  // });
};

module.exports = dbConnection;
