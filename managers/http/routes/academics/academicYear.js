const express = require("express");

const {createAcademicYear, getAcademicYears, getAcademicYear,
  updateAcademicYear, deleteAcademicYear,
} = require("../../../api/controllers/academics/academicYearCtrl");

const isRoleAccess = require("../../../api/middlewares/isRoleAccess");
const isAuthenticated = require("../../../api/middlewares/iaAuthenticated");
const Admin = require("../../../entities/staff/Admin");
const academicYearRouter = express.Router();

academicYearRouter.route("/")
  .post(isAuthenticated(Admin), isRoleAccess('admin'), createAcademicYear)
  .get(isAuthenticated(Admin), isRoleAccess('admin'), getAcademicYears);

academicYearRouter.route("/:id")
  .get(isAuthenticated(Admin), isRoleAccess('admin'), getAcademicYear)
  .put(isAuthenticated(Admin), isRoleAccess('admin'), updateAcademicYear)
  .delete(isAuthenticated(Admin), isRoleAccess('admin'), deleteAcademicYear);

module.exports = academicYearRouter;