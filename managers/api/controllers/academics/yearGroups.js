const AsyncHandler = require("express-async-handler");

const YearGroup = require("../../../entities/academic/YearGroup");
const Admin = require("../../../entities/staff/Admin");

//@desc: Create year group
exports.createYearGroup = AsyncHandler(async (req, res) => {
  const {name, academicYear} = req.body;
  //check if exists
  const yearGroupFound = await YearGroup.findOne({name});
  if (yearGroupFound) throw new Error("Year Group already exists");
  //create
  const yearGroup = await YearGroup.create({name, academicYear, createdBy: req.userAuth._id});
  //find the admin, push to the program
  const admin = await Admin.findById(req.userAuth._id);
  if (!admin) throw new Error("Admin not found");
  admin.yearGroups.push(yearGroup._id);
  await admin.save();
  res.status(201).json({status: "success", message: "Year Group created successfully", data: yearGroup});
});

//@desc: Get all Year groups
exports.getYearGroups = AsyncHandler(async (req, res) => {
  const groups = await YearGroup.find();
  res.status(201).json({status: "success", message: "Year Groups fetched successfully", data: groups});
});

//@desc: Get single year group
exports.getYearGroup = AsyncHandler(async (req, res) => {
  const group = await YearGroup.findById(req.params.id);
  res.status(201).json({status: "success", message: "Year Group fetched successfully", data: group});
});

//@desc: Update Year Group
exports.updateYearGroup = AsyncHandler(async (req, res) => {
  const {name, academicYear} = req.body;
  //check name exists
  const yearGroupFound = await YearGroup.findOne({ name });
  if (yearGroupFound) throw new Error("year Group already exists");
  const yearGroup = await YearGroup.findByIdAndUpdate(
    req.params.id, {name, academicYear, createdBy: req.userAuth._id}, {new: true}
  );
  res.status(201).json({status: "success", message: "Year Group  updated successfully", data: yearGroup});
});

//@desc: Delete Year group
exports.deleteYearGroup = AsyncHandler(async (req, res) => {
  await YearGroup.findByIdAndDelete(req.params.id);
  res.status(201).json({status: "success", message: "Year Group deleted successfully"});
});
