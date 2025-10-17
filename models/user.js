const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

User.plugin(passportLocalMongoose);

module.exports = Model.mongoose(("user", userSchema));
