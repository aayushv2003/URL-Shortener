const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // ✅ use a comma, not a dot
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true }); // ✅ timestamps should be the second argument

const User = mongoose.model("User", userSchema); // Capitalize 'User' for consistency
module.exports = User;
