const bcrypt = require("bcrypt");
const { DataTypes } = require("sequelize");
const { sequelize } = require("../Configs/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_password: {
      type: DataTypes.STRING,
      allowNull: false,
    }

  },
  {
    timestamps: true,
    tableName: "User",
    sequelize,
    hooks: {
      beforeCreate: async (user) => {
        if (user.user_password) {
          const salt = await bcrypt.genSalt(10);
          user.user_password = await bcrypt.hash(user.user_password, salt);
        }
      },
    },
  }
);

User.authenticate = async function (password) {
  return await bcrypt.compare(password, this.user_password);
};

module.exports = User;
