const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const User = require("../../model/User");

module.exports = {
  Mutation: {
    async register(
      parent,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      // TODO Validate user data
      // TODO Make sure user doesn't already exit
      const user = await User.findOne({ username });
      if (user)
        throw new UserInputError("Username is taken", {
          errors: { username: "This username is taken" },
        });
      // TODO Hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = jwt.sign(
        {
          id: res.id,
          email: res.email,
          username: res.username,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
