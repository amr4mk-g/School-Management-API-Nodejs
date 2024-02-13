const express = require("express");

const {adminRegisterStudent, loginStudent, getStudentProfile, writeExam,
  getAllStudentsByAdmin, getStudentByAdmin, studentUpdateProfile, adminUpdateStudent
} = require("../../../api/controllers/students/studentsCtrl");

const isRoleAccess = require("../../../api/middlewares/isRoleAccess");
const isAuthenticated = require("../../../api/middlewares/iaAuthenticated");
const Admin = require("../../../entities/staff/Admin");
const Student = require("../../../entities/academic/Student");
const studentRouter = express.Router();

studentRouter.post("/login", loginStudent);
studentRouter.post("/register", isAuthenticated(Admin), isRoleAccess('admin'), adminRegisterStudent);
studentRouter.get("/profile", isAuthenticated(Student), isRoleAccess('student'), getStudentProfile);
studentRouter.get("/admin", isAuthenticated(Admin), isRoleAccess('admin'), getAllStudentsByAdmin);
studentRouter.get("/:studentID/admin", isAuthenticated(Admin), isRoleAccess('admin'), getStudentByAdmin);
studentRouter.put("/update", isAuthenticated(Student), isRoleAccess('student'), studentUpdateProfile);
studentRouter.put("/:studentID/admin-update", isAuthenticated(Admin), isRoleAccess('admin'), adminUpdateStudent);

module.exports = studentRouter;