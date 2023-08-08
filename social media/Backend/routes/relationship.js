const express = require("express");
const { getRelationships, addRelationship, deleteRelationship } = require("../controllers/relationship-contoller");

const router = express.Router();

router.get("/:followedUserId", getRelationships);
router.post("/", addRelationship);
router.delete("/:userId", deleteRelationship);

module.exports = router;