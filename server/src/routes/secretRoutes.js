const express = require("express");
const router = express.Router();

const {
  pushSecrets,
  getSecrets,
  getLogs,
} = require("../controllers/secretController");

const auth = require("../middleware/auth");

router.post("/push", auth, pushSecrets);
router.get("/pull", auth, getSecrets);
router.get("/logs", auth, getLogs);

module.exports = router;