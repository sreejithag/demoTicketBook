const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type: String,
        required: true,
        lowercase: true
    },
    password:{
        type: String,
        required:true,
    },
    active:{
        type: Boolean,
        default: true,
      select: false,
    }
})

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;