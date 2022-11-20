const app = require("./app");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

const { HOST_DB } = process.env;

async function main() {
  try {
    await mongoose.connect(HOST_DB);
    console.log("Database connection successful");
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  } catch (error) {
    console.error("Error:", error.messege);
    process.exit(1);
  }
}

main();
