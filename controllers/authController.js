const jwt = require("jsonwebtoken");
const Admin = require('../models/adminModel')
const AppError = require("../utils/appErrors");
const bcrypt = require('bcrypt');
const { promisify } = require("util");

const createToken = id => {
    return jwt.sign(
      {
        id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );
  };

exports.login = async (req,res,next)=>{
    try{

        console.log(req.body)
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send("Email of password not provided");
          }

        const admin = await Admin.findOne({
            email: email
        });

        if (!admin) {
            return res.status(401).send("Email of password is incorrect");
        }

        const passwordVerified = await bcrypt.compare(password, admin.password);
        if (!passwordVerified) {
            return res.status(401).send("Email of password is incorrect");
        }

        const token = createToken(admin.id);


        res.status(200).json({
            status: "success",
            token,
          });
    } catch (err) {
          next(err);
        }
    
};


//todo valiadte the admin name is present or not
exports.signup = async (req, res, next) => {

    try{

        let admin = await Admin.findOne({
            email: req.body.email
        })

        if (admin) {
            return res.status(400).send("Admin exists");
        }

        admin = new Admin({
            name:req.body.name,
            email:req.body.email
        });
        
        const password = req.body.password
        admin.password = await bcrypt.hash(password,12)

        const saveData = await admin.save();

        const token =  createToken(saveData.id);


        res.status(201).json({
            status: "success",
            token
          });
    } catch (err) {
          next(err);
        }

};


exports.protect = async (req, res, next) => {

    try{

        let token;
        if(
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ){

            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next(
              new AppError(
                401,
                "fail",
                "You are not logged in! Please login with admin account",
              ),
              req,
              res,
              next,
            );
          }

        const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const admin = await Admin.findById(decode.id);
        if (!admin) {
         return next(
          new AppError(401, "fail", "This user is no longer exist"),
          req,
          res,
          next,
          );
         }


         next();




    }catch(error){
        next(error);
    }

}

