const express = require("express");

const {createSubject, deleteSubject, getProgram, getSubjects, updateSubject,
} = require("../../../api/controllers/academics/subjects");

const isRoleAccess = require("../../../api/middlewares/isRoleAccess");
const isAuthenticated = require("../../../api/middlewares/iaAuthenticated");
const Admin = require("../../../entities/staff/Admin");
const subjectRouter = express.Router();

subjectRouter.post("/", isAuthenticated(Admin), isRoleAccess('admin'), createSubject);
subjectRouter.get("/", isAuthenticated(Admin), isRoleAccess('admin'), getSubjects);
subjectRouter.get("/:id", isAuthenticated(Admin), isRoleAccess('admin'), getProgram);
subjectRouter.put("/:id", isAuthenticated(Admin), isRoleAccess('admin'), updateSubject);
subjectRouter.delete("/:id", isAuthenticated(Admin), isRoleAccess('admin'), deleteSubject);

module.exports = subjectRouter;