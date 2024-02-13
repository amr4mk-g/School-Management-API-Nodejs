const express = require("express");

const {createClassLevel, deleteClassLevel, getClassLevel,
  getClassLevels, updateClassLevel
} = require("../../../api/controllers/academics/classLevel");

const isRoleAccess = require("../../../api/middlewares/isRoleAccess");
const isAuthenticated = require("../../../api/middlewares/iaAuthenticated");
const Admin = require("../../../entities/staff/Admin");
const classLevelRouter = express.Router();

classLevelRouter.route("/")
  .post(isAuthenticated(Admin), isRoleAccess('admin'), createClassLevel)
  .get(isAuthenticated(Admin), isRoleAccess('admin'), getClassLevels);

classLevelRouter.route("/:id")
  .get(isAuthenticated(Admin), isRoleAccess('admin'), getClassLevel)
  .put(isAuthenticated(Admin), isRoleAccess('admin'), updateClassLevel)
  .delete(isAuthenticated(Admin), isRoleAccess('admin'), deleteClassLevel);

module.exports = classLevelRouter;