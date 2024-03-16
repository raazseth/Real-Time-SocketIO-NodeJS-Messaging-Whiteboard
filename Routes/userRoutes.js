const express = require("express");
const {
  registerUser,
  loginUser,
  forgetPassword,
  getUser,
} = require("../Controller/userController");
const { requireSignin } = require("../Middleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forget-password", forgetPassword);
router.get("/user",requireSignin, getUser);

module.exports = router;
