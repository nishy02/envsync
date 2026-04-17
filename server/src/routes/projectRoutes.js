const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  listProjects,
  createProject,
  shareProject,
} = require("../controllers/projectController");

router.get("/", auth, listProjects);
router.post("/", auth, createProject);
router.post("/:projectId/share", auth, shareProject);

module.exports = router;
