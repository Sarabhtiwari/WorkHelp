const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const workerController = require("../controllers/workerController");

const router = express.Router();

router.post(
  "/complete-profile",
  authMiddleware,
  workerController.completeProfile
);

router.put("/set-role", authMiddleware, workerController.setRole);

router.post("/post-job", authMiddleware, workerController.postJob);

router.delete("/unpost-job", authMiddleware, workerController.unPostJob);

router.get("/details/:id", authMiddleware, workerController.getWorkerDetails);

module.exports = router;
