const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone_number: { type: String },
    password: { type: String }, // Will be empty for Google login users
    year: { type: String },
    verifytoken: { type: String },
    createdAt: { type: Date, default: Date.now },
    googleId: { type: String }, // Stores Google User ID for Google login users
    isGoogleUser: { type: Boolean, default: false }, // Identifies Google login users
});

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
