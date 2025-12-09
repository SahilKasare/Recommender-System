const express = require("express");
const router = express.Router();
const {
  signup,
  getUser,
  toggleLikeProduct,
} = require("../controllers/userController");

router.post("/signup", signup);
router.get("/:user_id", getUser);
router.put("/:user_id/like", toggleLikeProduct);

module.exports = router;
