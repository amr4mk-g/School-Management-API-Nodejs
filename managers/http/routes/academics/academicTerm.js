const express = require("express");

const {createAcademicTerm, deleteAcademicTerm, getAcademicTerm,
  getAcademicTerms, updateAcademicTerms,
} = require("../../../api/controllers/academics/academicTermCtrl");

const isAuthenticated = require("../../../api/middlewares/iaAuthenticated");
const isRoleAccess = require("../../../api/middlewares/isRoleAccess");
const Admin = require("../../../entities/staff/Admin");
const academicTermRouter = express.Router();

academicTermRouter.route("/")
  .post(isAuthenticated(Admin), isRoleAccess('admin'), createAcademicTerm)
  .get(isAuthenticated(Admin), isRoleAccess('admin'), getAcademicTerms);

academicTermRouter.route("/:id")
  .get(isAuthenticated(Admin), isRoleAccess('admin'), getAcademicTerm)
  .put(isAuthenticated(Admin), isRoleAccess('admin'), updateAcademicTerms)
  .delete(isAuthenticated(Admin), isRoleAccess('admin'), deleteAcademicTerm);

module.exports = academicTermRouter;