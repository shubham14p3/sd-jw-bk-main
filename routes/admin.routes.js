const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  updateStaff,
  changePassword,
  addStaff,
  getAllStaff,
  deleteStaff,
  getAdminUserById,
  forgetPassword,
  confirmAdminEmail,
  confirmAdminForgetPass,
  updateAdminStaff,
} = require("../controller/admin.controller");

//register a staff
router.post("/register", registerAdmin);

//confirming Adming Email
router.get("/confirmEmail/:token", confirmAdminEmail);

//login a admin
router.post("/login", loginAdmin);

//login a admin
router.patch("/change-password", changePassword);

//login a admin
router.post("/add", addStaff);

//login all admin
router.get("/all", getAllStaff);

//forget-password
router.patch("/forget-password", forgetPassword);

//forget-password
router.patch("/confirm-forget-password", confirmAdminForgetPass);

//get a staff
router.get("/getAdminUserById/:id", getAdminUserById);

// update a staff
router.patch("/update-staff/:id", updateStaff);

// update a admin staff
router.patch("/update-admin-staff/:id", updateAdminStaff);

//update staf status
// router.put("/update-status/:id", updatedStatus);

//delete a staff
router.delete("/:id", deleteStaff);

module.exports = router;
