const AsyncHandler = require("express-async-handler");

const ClassLevel = require("../../../entities/academic/ClassLevel");
const Admin = require("../../../entities/staff/Admin");

//@desc: Create Class Level
exports.createClassLevel = AsyncHandler(async (req, res) => {
  const {name, description, duration} = req.body;
  //check if exists
  const classFound = await ClassLevel.findOne({ name });
  if (classFound) throw new Error("Class  already exists");
  //create
  const classCreated = await ClassLevel.create({name, description, createdBy: req.userAuth._id});
  //push class into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.classLevels.push(classCreated._id);
  await admin.save();
  res.status(201).json({status: "success", message: "Class created successfully", data: classCreated});
});

//@desc: Get all class levels
exports.getClassLevels = AsyncHandler(async (req, res) => {
  const classes = await ClassLevel.find();
  res.status(201).json({status: "success", message: "Class Levels fetched successfully", data: classes});
});

//@desc: Get Single Class Level
exports.getClassLevel = AsyncHandler(async (req, res) => {
  const classLevel = await ClassLevel.findById(req.params.id);
  res.status(201).json({status: "success", message: "Class fetched successfully", data: classLevel});
});

//@desc: Update Class Level
exports.updateClassLevel = AsyncHandler(async (req, res) => {
  const {name, description} = req.body;
  //check name exists
  const classFound = await ClassLevel.findOne({ name });
  if (classFound) throw new Error("Class already exists");
  const classLevel = await ClassLevel.findByIdAndUpdate(
    req.params.id, {name, description, createdBy: req.userAuth._id}, {new: true});
  res.status(201).json({status: "success", message: "Class  updated successfully", data: classLevel});
});

//@desc: Delete class level
exports.deleteClassLevel = AsyncHandler(async (req, res) => {
  await ClassLevel.findByIdAndDelete(req.params.id);
  res.status(201).json({status: "success", message: "Class level deleted successfully"});
});
