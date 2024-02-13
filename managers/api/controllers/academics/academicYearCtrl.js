const AsyncHandler = require("express-async-handler");

const AcademicYear = require("../../../entities/academic/AcademicYear");
const Admin = require("../../../entities/staff/Admin");

//@desc: Create Academic Year
exports.createAcademicYear = AsyncHandler(async (req, res) => {
  const {name, fromYear, toYear} = req.body;
  //check if exists
  const academicYear = await AcademicYear.findOne({ name });
  if (academicYear) throw new Error("Academic year already exists");
  const academicYearCreated = await AcademicYear.create({
    name, fromYear, toYear, createdBy: req.userAuth._id});
  //push academic into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.academicYears.push(academicYearCreated._id);
  await admin.save();
  res.status(201).json({status: "success", message: "Academic year created successfully", data: academicYearCreated});
});

//@desc: Get all Academic Years
exports.getAcademicYears = AsyncHandler(async (req, res) => {
  const academicYears = await AcademicYear.find();
  res.status(201).json({status: "success", message: "Academic years fetched successfully", data: academicYears});
});

//@desc: Get single Academic Year
exports.getAcademicYear = AsyncHandler(async (req, res) => {
  const academicYears = await AcademicYear.findById(req.params.id);
  res.status(201).json({status: "success", message: "Academic years fetched successfully", data: academicYears});
});

//@desc: Update  Academic Year
exports.updateAcademicYear = AsyncHandler(async (req, res) => {
  const {name, fromYear, toYear} = req.body;
  //check name exists
  const createAcademicYearFound = await AcademicYear.findOne({ name });
  if (createAcademicYearFound) throw new Error("Academic year already exists");

  const academicYear = await AcademicYear.findByIdAndUpdate(
    req.params.id, {name, fromYear, toYear, createdBy: req.userAuth._id}, {new: true}
  );
  res.status(201).json({status: "success", message: "Academic years updated successfully", data: academicYear});
});

//@desc: Update  Academic Year
exports.deleteAcademicYear = AsyncHandler(async (req, res) => {
  await AcademicYear.findByIdAndDelete(req.params.id);
  res.status(201).json({status: "success", message: "Academic year deleted successfully"});
});
