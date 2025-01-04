const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const Employee = require("./models/Employee");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());

//Routes

app.post("/employee", async (req, res) => {
  const { name, employeeId, email } = req.body;

  if (!name || !employeeId) {
    return res.status(400).json({
      message: "Please provide name and employeeId",
    });
  }

  try {
    const duplicate = await Employee.findOne({ employeeId: employeeId });
    if (duplicate)
      return res.status(400).json({ message: "EmployeeId already exist" });

    const newEmployee = new Employee({
      name: name,
      employeeId: employeeId,
      email: email,
    });

    await newEmployee.save();

    res.status(201).json({ message: "Employee registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/employee/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.put("/employee/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  const { name, email } = req.body;

  if (!name && !email) {
    return res
      .status(400)
      .json({ message: "Please provide either name or email to update" });
  }

  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeId },
      { $set: { name, email } },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res
      .status(200)
      .json({ message: "Employee updated successfully", updatedEmployee });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.delete("/employee/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const deletedEmployee = await Employee.findOneAndDelete({ employeeId });

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});
connectDB();
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
