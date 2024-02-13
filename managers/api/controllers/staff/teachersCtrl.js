const AsyncHandler = require("express-async-handler");

const Admin = require("../../../entities/staff/Admin");
const Teacher = require("../../../entities/staff/Teacher");
const generateToken = require("../../../../libs/utils/generateToken");
const {hashPassword, isPassMatched} = require("../../../../libs/utils/helpersPassword");

//@desc: Admin Register Teacher
//@route: POST /api/teachers/admin/register
exports.adminRegisterTeacher = AsyncHandler(async (req, res) => {
  const {name, email, password} = req.body;
  //find the admin
  const adminFound = await Admin.findById(req.userAuth._id);
  if (!adminFound) throw new Error("Admin not found");
  //check if teacher already exists
  const teacher = await Teacher.findOne({email});
  if (teacher) throw new Error("Teacher already employed");
  //create
  const hashedPassword = await hashPassword(password);
  const teacherCreated = await Teacher.create({name, email, password: hashedPassword});
  //push teacher into admin
  adminFound.teachers.push(teacherCreated?._id);
  await adminFound.save();
  //send teacher data
  res.status(201).json({status: "success", message: "Teacher registered successfully", data: teacherCreated});
});

//@desc: Login Teacher
//@route: POST /api/v1/teachers/login
exports.loginTeacher = AsyncHandler(async (req, res) => {
  const {email, password} = req.body;
  //find the teacher
  const teacher = await Teacher.findOne({email});
  if (!teacher) return res.json({message: "Invalid login credentials"});
  //verify the password
  const isMatched = await isPassMatched(password, teacher?.password);
  if (!isMatched) return res.json({ message: "Invalid login credentials" });
  else res.status(200).json({status: "success",
      message: "Teacher logged in successfully", data: generateToken(teacher?._id)});
});

//@desc: Get All Teachers, ?limit=0&page=1
exports.getAllTeachersByAdmin = AsyncHandler(async (req, res) => {
  const query = req.query;
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || 0;
  let skip = (page-1)*limit;
  const total = await Teacher.countDocuments();
  const teachers = await Teacher.find().skip(skip).limit(limit);
  res.status(200).json({status: "success", message: "Teachers fetched successfully", 
    total, results: teachers.length, data: teachers});
});

//@desc: Get Single Teacher
exports.getTeacherByAdmin = AsyncHandler(async (req, res) => {
  const teacherID = req.params.teacherID;
  //find the teacher
  const teacher = await Teacher.findById(teacherID);
  if (!teacher) throw new Error("Teacher not found");
  res.status(200).json({status: "success", message: "Teacher fetched successfully", data: teacher});
});

//@desc: Teacher Profile
exports.getTeacherProfile = AsyncHandler(async (req, res) => {
  //find the teacher
  const teacher = await Teacher.findById(req.userAuth?._id).select("-password -createdAt -updatedAt");
  if (!teacher) throw new Error("Teacher not found");
  res.status(200).json({status: "success", data: teacher, message: "Profile fetched successfully"});
});

//@desc: Teacher updating profile admin
exports.teacherUpdateProfile = AsyncHandler(async (req, res) => {
  const {email, name, password} = req.body;
  //if email is taken
  const emailExist = await Teacher.findOne({ email });
  if (emailExist) throw new Error("This email is taken/exist");
  //hash password if user is updating
  if (password) {
    const teacher = await Teacher.findByIdAndUpdate(
      req.userAuth._id, {email, name, password: await hashPassword(password)},
      {new: true, runValidators: true});
    res.status(200).json({status: "success", data: teacher, message: "Teacher updated successfully"});
  } else {
    const teacher = await Teacher.findByIdAndUpdate(
      req.userAuth._id, {email, name}, {new: true, runValidators: true}
    );
    res.status(200).json({status: "success", data: teacher, message: "Teacher updated successfully"});
  }
});

//@desc: Admin updating Teacher profile
exports.adminUpdateTeacher = AsyncHandler(async (req, res) => {
  const {program, classLevel, academicYear, subject} = req.body;
  //if email is taken
  const teacherFound = await Teacher.findById(req.params.teacherID);
  if (!teacherFound) throw new Error("Teacher not found");
  //Check if teacher is withdrawn
  if (teacherFound.isWithdrawn) throw new Error("Action denied, teacher is withdraw");
  //assign a program
  if (program) teacherFound.program = program;
  //assign Class level
  if (classLevel) teacherFound.classLevel = classLevel;
  //assign Academic year
  if (academicYear) teacherFound.academicYear = academicYear;
  //assign subject
  if (subject) teacherFound.subject = subject;
  //save
  await teacherFound.save();
  res.status(200).json({status: "success", data: teacherFound, message: "Teacher updated successfully"});
});
