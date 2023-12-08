const express = require("express");
const router = express.Router();
const { getEmailDetails } = require("../controller/email.controller");

// add a user
router.get("/email-details", getEmailDetails);

module.exports = router;
