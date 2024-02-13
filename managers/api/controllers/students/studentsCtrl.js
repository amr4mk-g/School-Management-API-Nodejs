const AsyncHandler = require("express-async-handler");

const Student = require("../../../entities/academic/Student");
const Admin = require("../../../entities/staff/Admin");
const generateToken = require("../../../../libs/utils/generateToken");
const {hashPassword, isPassMatched} = require("../../../../libs/utils/helpersPassword");

//@desc: Admin Register Student
exports.adminRegisterStudent = AsyncHandler(async (req, res) => {
  const {name, email, password} = req.body;
  //find the admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) throw new Error("Admin not found");
  //check if teacher already exists
  const student = await Student.findOne({email});
  if (student) throw new Error("Student already employed");
  //create
  const hashedPassword = await hashPassword(password);
  const studentRegistered = await Student.create({name, email, password: hashedPassword});
  //push teacher into admin
  adminFound.students.push(studentRegistered?._id);
  await adminFound.save();
  //send student data
  res.status(201).json({status: "success", message: "Student registered successfully", data: studentRegistered});
});

//@desc: Login Student
exports.loginStudent = AsyncHandler(async (req, res) => {
  const {email, password} = req.body;
  //find the student
  const student = await Student.findOne({ email });
  if (!student) return res.json({message: "Invalid login credentials"});
  //verify the password
  const isMatched = await isPassMatched(password, student?.password);
  if (!isMatched) return res.json({message: "Invalid login credentials"});
  else res.status(200).json({status: "success",
      message: "Student logged in successfully", data: generateToken(student?._id)});
});

//@desc: Student Profile
exports.getStudentProfile = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.userAuth?._id)
    .select("-password -createdAt -updatedAt");
  if (!student) throw new Error("Student not found");
  //get student profile
  const studentProfile = {name: student?.name, email: student?.email,
    currentClassLevel: student?.currentClassLevel,
    program: student?.program, dateAdmitted: student?.dateAdmitted,
    isSuspended: student?.isSuspended, isWithdrawn: student?.isWithdrawn,
    studentId: student?.studentId, prefectName: student?.prefectName};
  //send response
  res.status(200).json({status: "success", message: "Student Profile fetched successfully", data: studentProfile});
});

//@desc: Get All Students
exports.getAllStudentsByAdmin = AsyncHandler(async (req, res) => {
  const query = req.query;
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 0;
  let skip = (page-1)*limit;
  const total = await Student.countDocuments();
  const students = await Student.find().skip(skip).limit(limit);
  res.status(200).json({status: "success", message: "Students fetched successfully", 
    total, results: students.length, data: students});
});

//@desc: Get Single Student
exports.getStudentByAdmin = AsyncHandler(async (req, res) => {
  const studentID = req.params.studentID;
  //find the teacher
  const student = await Student.findById(studentID);
  if (!student) throw new Error("Student not found");
  res.status(200).json({status: "success", message: "Student fetched successfully", data: student});
});

//@desc: Student Updating Profile
exports.studentUpdateProfile = AsyncHandler(async (req, res) => {
  const {name, email, password} = req.body;
  //if email is taken
  const emailExist = await Student.findOne({ email });
  if (emailExist) throw new Error("This email is taken/exist");
  //hash password if user is updating
  if (password) {
    const student = await Student.findByIdAndUpdate(
      req.userAuth._id, {email, password: await hashPassword(password)}, 
      {new: true, runValidators: true});
    res.status(200).json({status: "success", data: student, message: "Student updated successfully"});
  } else {
    const student = await Student.findByIdAndUpdate(
      req.userAuth._id, {name, email}, {new: true, runValidators: true});
    res.status(200).json({status: "success", data: student, message: "Student updated successfully"});
  }
});

//@desc: Admin updating Students eg: Assigning classes....
exports.adminUpdateStudent = AsyncHandler(async (req, res) => {
  const {classLevels, academicYear, program, name, email,
    prefectName, isSuspended, isWithdrawn} = req.body;
  //find the student by id
  const studentFound = await Student.findById(req.params.studentID);
  if (!studentFound) throw new Error("Student not found");
  //update
  const studentUpdated = await Student.findByIdAndUpdate(
    req.params.studentID, {$set: {name, email, academicYear, program, prefectName, isSuspended, isWithdrawn},
      $addToSet: {classLevels}}, {new: true});
  //send response
  res.status(200).json({status: "success", data: studentUpdated, message: "Student updated successfully"});
});