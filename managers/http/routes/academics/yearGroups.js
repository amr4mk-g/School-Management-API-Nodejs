const express = require("express");

const {createYearGroup, deleteYearGroup, getYearGroup,
  getYearGroups, updateYearGroup,
} = require("../../../api/controllers/academics/yearGroups");

const isRoleAccess = require("../../../api/middlewares/isRoleAccess");
const isAuthenticated = require("../../../api/middlewares/iaAuthenticated");
const Admin = require("../../../entities/staff/Admin");
const yearGroupRouter = express.Router();

yearGroupRouter.route("/")
  .post(isAuthenticated(Admin), isRoleAccess('admin'), createYearGroup)
  .get(isAuthenticated(Admin), isRoleAccess('admin'), getYearGroups);

yearGroupRouter.route("/:id")
  .get(isAuthenticated(Admin), isRoleAccess('admin'), getYearGroup)
  .put(isAuthenticated(Admin), isRoleAccess('admin'), updateYearGroup)
  .delete(isAuthenticated(Admin), isRoleAccess('admin'), deleteYearGroup);

module.exports = yearGroupRouter;