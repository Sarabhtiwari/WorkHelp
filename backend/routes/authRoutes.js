const express = require("express");
const router = express.Router();
const authController = require("../controllers/RegisterLogin");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-email", authController.verifyEmail);
router.post('/logout', authController.logout);

module.exports = router;
