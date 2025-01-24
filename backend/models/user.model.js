const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String , required: true }, // Will be empty for Google login users
    createdAt: { type: Date, default: Date.now },
    isGoogleUser: { type: Boolean, default: false }, // Identifies Google login users
    results: [
        [{
          type: mongoose.Schema.Types.ObjectId, // References quiz IDs
          ref: "quiz", // Refers to the 'quiz' collection
        },],
      ]
});

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
