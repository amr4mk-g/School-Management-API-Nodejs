const express = require("express");

const {registerAdmCtrl, deleteAdminCtrl, getAdminProfileCtrl,
  getAdminsCtrl, loginAdminCtrl, updateAdminCtrl,
} = require("../../../api/controllers/staff/adminCtrl");

const isRoleAccess = require("../../../api/middlewares/isRoleAccess");
const isAuthenticated = require("../../../api/middlewares/iaAuthenticated");
const Admin = require("../../../entities/staff/Admin");
const adminRouter = express.Router();

adminRouter.post("/register", registerAdmCtrl);
adminRouter.post("/login", loginAdminCtrl);
adminRouter.get("/", isAuthenticated(Admin), isRoleAccess('admin'), getAdminsCtrl);
adminRouter.get("/profile", isAuthenticated(Admin), isRoleAccess('admin'), getAdminProfileCtrl);
adminRouter.put("/", isAuthenticated(Admin), isRoleAccess('admin'), updateAdminCtrl);
adminRouter.delete("/:id", isAuthenticated(Admin), isRoleAccess('admin'), deleteAdminCtrl);

module.exports = adminRouter;