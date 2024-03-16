const User = require("../Model/user_Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const uuid = require("uuid").v4;

// Create and Save a new User
exports.registerUser = async (req, res) => {
  const { username, email, user_password } = req.body;

  try {
    const existingUser = await User.findOne({
      where: {
        email: {
          [Op.eq]: email,
        },
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: `${email} is already registered.`,
      });
    }

    const user = await User.create({
      id: uuid(),
      username,
      email,
      user_password,
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    if (user) {
      const { id, email, username } = user;

      res.status(200).json({
        token,
        user: {
          id,
          email,
          username,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || "Some error occurred while creating User.",
    });
  }
};

// Login a registered User
exports.loginUser = async (req, res) => {
  try {
    const { user_password } = req.body;

    const user = await User.findOne({
      where: {
        email: {
          [Op.eq]: req.body.email,
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: `${req.body.email} is not registered.`,
      });
    }

    const isMatch = await bcrypt.compare(user_password, user.user_password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect Password",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    const { id, email, username } = user;

    res.status(200).json({
      token,
      user: {
        id,
        email,
        username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Some error occurred while logging in.",
    });
  }
};

// Forget Password
exports.forgetPassword = async (req, res) => {
  const { user_password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email: {
          [Op.eq]: req.body.email,
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: `${req.body.email} is not registered.`,
      });
    }
    const hashPassword = await bcrypt.hash(user_password, 10);

    await User.update({
      user_password: hashPassword,
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    const { id, email, username } = user;

    res.status(200).json({
      token,
      User: {
        id,
        email,
        username,
      },
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "Some error occurred while updating the password.",
    });
  }
};

// Retrieve and return current user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: {
          [Op.eq]: req.body.email,
        },
      },
    });

    res.status(200).json({
      message: "OK",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Some error occurred while fetching Users.",
    });
  }
};
