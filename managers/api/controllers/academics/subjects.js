const AsyncHandler = require("express-async-handler");

const Program = require("../../../entities/academic/Program");
const Subject = require("../../../entities/academic/Subject");

//@desc: Create subject
exports.createSubject = AsyncHandler(async (req, res) => {
  const {name, description, academicTerm} = req.body;
  //find the program
  const programFound = await Program.findById(req.params.programID);
  if (!programFound) throw new Error("Program not found");
  //check if exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) throw new Error("Subject already exists");
  const subjectCreated = await Subject.create({name, description, academicTerm, createdBy: req.userAuth._id});
  //push to the program
  programFound.subjects.push(subjectCreated._id);
  await programFound.save();
  res.status(201).json({status: "success", message: "Program created successfully", data: subjectCreated});
});

//@desc: Get All Subjects
exports.getSubjects = AsyncHandler(async (req, res) => {
  const classes = await Subject.find();
  res.status(201).json({status: "success", message: "Subjects fetched successfully", data: classes});
});

//@desc: Get single subject
exports.getProgram = AsyncHandler(async (req, res) => {
  const program = await Subject.findById(req.params.id);
  res.status(201).json({status: "success", message: "Subject fetched successfully", data: program});
});

//@desc: Update Subject
exports.updateSubject = AsyncHandler(async (req, res) => {
  const {name, description, academicTerm} = req.body;
  //check name exists
  const subjectFound = await Subject.findOne({ name });
  if (subjectFound) throw new Error("Program already exists");
  const subject = await Subject.findByIdAndUpdate(
    req.params.id, {name, description, academicTerm, createdBy: req.userAuth._id}, {new: true}
  );
  res.status(201).json({status: "success", message: "subject updated successfully", data: subject});
});

//@desc: Delete Subject
exports.deleteSubject = AsyncHandler(async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);
  res.status(201).json({status: "success", message: "subject deleted successfully"});
});
