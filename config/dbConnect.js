const mongoose = require("mongoose");

// connect to mongodb atlas database
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Connection failed", error.message);
  }
};

dbConnect();