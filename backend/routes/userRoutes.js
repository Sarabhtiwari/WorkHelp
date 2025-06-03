const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const UserController = require("../controllers/userController");

const router = express.Router();

router.post("/completeUserProfile",authMiddleware,UserController.completeUserProfile);

router.get("/find-workers",authMiddleware,UserController.getJobs);
router.get('/profile', authMiddleware, UserController.checkProfile);

module.exports = router;