const express = require("express");

const {adminRegisterTeacher, loginTeacher, getAllTeachersByAdmin,
  getTeacherByAdmin, getTeacherProfile, teacherUpdateProfile, adminUpdateTeacher,
} = require("../../../api/controllers/staff/teachersCtrl");

const isRoleAccess = require("../../../api/middlewares/isRoleAccess");
const isAuthenticated = require("../../../api/middlewares/iaAuthenticated");
const Admin = require("../../../entities/staff/Admin");
const Teacher = require("../../../entities/staff/Teacher");
const teachersRouter = express.Router();

teachersRouter.post("/login", loginTeacher);
teachersRouter.post("/register", isAuthenticated(Admin), isRoleAccess('admin'), adminRegisterTeacher);
teachersRouter.get("/admin", isAuthenticated(Admin), isRoleAccess('admin'), getAllTeachersByAdmin);
teachersRouter.get("/:teacherID/profile", isAuthenticated(Admin), isRoleAccess('admin'), getTeacherByAdmin);
teachersRouter.get("/profile", isAuthenticated(Teacher), isRoleAccess('teacher'), getTeacherProfile);
teachersRouter.put("/:teacherID/update", isAuthenticated(Teacher), isRoleAccess('teacher'), teacherUpdateProfile);
teachersRouter.put("/:teacherID/admin-update", isAuthenticated(Admin), isRoleAccess('admin'), adminUpdateTeacher);

module.exports = teachersRouter;