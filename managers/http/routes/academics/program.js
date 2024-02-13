const express = require("express");

const {createProgram, deleteProgram, getProgram,
  getPrograms, updateProgram, addSubjectToProgram,
} = require("../../../api/controllers/academics/programs");

const isRoleAccess = require("../../../api/middlewares/isRoleAccess");
const isAuthenticated = require("../../../api/middlewares/iaAuthenticated");
const Admin = require("../../../entities/staff/Admin");
const programRouter = express.Router();

programRouter.route("/")
  .post(isAuthenticated(Admin), isRoleAccess('admin'), createProgram)
  .get(isAuthenticated(Admin), isRoleAccess('admin'), getPrograms);

programRouter.route("/:id")
  .get(isAuthenticated(Admin), isRoleAccess('admin'), getProgram)
  .put(isAuthenticated(Admin), isRoleAccess('admin'), updateProgram)
  .delete(isAuthenticated(Admin), isRoleAccess('admin'), deleteProgram);

programRouter.put("/:id/subjects", 
  isAuthenticated(Admin), isRoleAccess('admin'), addSubjectToProgram);

module.exports = programRouter;