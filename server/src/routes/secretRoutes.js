const express = require("express");
const router = express.Router();

const {
  pushSecrets,
  getSecrets,
} = require("../controllers/secretController");

const auth = require("../middleware/auth");

router.post("/push", auth, pushSecrets);
router.get("/pull", auth, getSecrets);

module.exports = router;