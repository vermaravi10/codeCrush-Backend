const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://rverma10:HQn3OXRb4nXTr6ua@learnnode.stp1y8s.mongodb.net/devTinder"
  );
};
module.exports = { connectDB };
