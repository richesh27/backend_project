const express = require("express");
const {getUser, updateUser}  = require("../controllers/user-controller");

const router = express.Router();

router.get("/:userId", getUser);
router.put("/", updateUser);

module.exports = router;