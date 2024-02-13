const AsyncHandler = require("express-async-handler");

const Admin = require("../../../entities/staff/Admin");
const generateToken = require("../../../../libs/utils/generateToken");
const {hashPassword, isPassMatched} = require("../../../../libs/utils/helpersPassword");

//@desc: Register admin
exports.registerAdmCtrl = AsyncHandler(async (req, res) => {
  const {name, email, password} = req.body;
  //check if email exists
  const adminFound = await Admin.findOne({email});
  if (adminFound) throw new Error("Admin Exists");
  //register
  const user = await Admin.create({name, email, password: await hashPassword(password)});
  res.status(201).json({status: "success", data: user, message: "Admin registered successfully"});
});

//@desc: Login admin
exports.loginAdminCtrl = AsyncHandler(async (req, res) => {
  const {email, password} = req.body;
  //check if user exists
  const user = await Admin.findOne({ email });
  if (!user) return res.json({message: "Invalid login credentials"});
  //verify password
  const isMatched = await isPassMatched(password, user.password);
  if (!isMatched) return res.json({message: "Invalid login credentials"});
  else return res.json({token: generateToken(user._id), message: "Admin logged in successfully"});
});

//@desc: Get all admins
exports.getAdminsCtrl = AsyncHandler(async (req, res) => {
  const admins = await Admin.find();
  res.status(200).json({status: "success", message: "Admins fetched successfully", data: admins});
});

//@desc: Get single admin
exports.getAdminProfileCtrl = AsyncHandler(async (req, res) => {
  //get admin and excluded some result
  //populate use ids to get data from other tables
  const admin = await Admin.findById(req.userAuth._id)
    .select("-password -createdAt -updatedAt")
    .populate("academicYears").populate("academicTerms")
    .populate("programs").populate("yearGroups").populate("classLevels")
    .populate("teachers").populate("students");

  if (!admin) throw new Error("User-Admin Not Found");
  else res.status(200).json({status: "Success", data: admin, 
      message: "Admin Profile fetched successfully"});
});

//@desc: Update admin
exports.updateAdminCtrl = AsyncHandler(async (req, res) => {
  const {email, name, password} = req.body;
  //if email is taken
  const emailExist = await Admin.findOne({email});
  if (emailExist) throw new Error("This email is taken/exist!");
  //hash password is user updating it
  if (password) {
    const admin = await Admin.findByIdAndUpdate(
      req.userAuth._id, {name, email, password: await hashPassword(password)},
      {new: true, runValidators: true}
    );
    res.status(200).json({status: "Success", data: admin, message: "Admin updated successfully"});
  } else {
    const admin = await Admin.findByIdAndUpdate(
      req.userAuth._id, {name, email}, {new: true, runValidators: true}
    );
    res.status(200).json({status: "Success", data: admin, message: "Admin updated successfully"});
  }
});

//@desc: Delete admin
exports.deleteAdminCtrl = AsyncHandler(async (req, res) => {
  try {
    //remove user
    res.status(201).json({status: "Success", data: "Admin deleted"});
  } catch (error) {
    res.json({status: "Failed", error: error.message});
  }
});
