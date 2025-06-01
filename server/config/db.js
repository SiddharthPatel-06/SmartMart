const mongoose = require("mongoose");
const chalk = require("chalk");
require("dotenv").config();

exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {});

    console.log(chalk.bgGreen.black.bold("✔️  DB connected successfully!"));
  } catch (error) {
    console.log(chalk.bgRed.white.bold("❌ DB connection failed"));
    console.error(chalk.redBright(error));
    process.exit(1);
  }
};
