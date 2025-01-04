const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    reuired: true,
  },

  employeeId: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
