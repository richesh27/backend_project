const express = require("express");
const { getComments, addComment } = require("../controllers/comment-controller");

const router = express.Router();

router.get("/:postId", getComments);
router.post("/", addComment);

module.exports = router;