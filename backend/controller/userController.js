import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/usemodel.js";
dotenv.config();
import crypto from "crypto";
import axios from "axios";
import nodemailer from 'nodemailer'



const OTP = crypto.randomInt(100000, 999999).toString();


export const Usersign = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const loginuser = await User.findOne({ email });
    if (!loginuser)
      return res.status(404).json({ message: "User not found" });

    const passwordIsCorrect = await bcrypt.compare(password, loginuser.password);
    if (!passwordIsCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate OTP EACH LOGIN (not using global OTP)
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log("OTP stored in DB:", otp);

    // Save OTP inside user
    loginuser.otp = otp;
    loginuser.otpExpiry = Date.now() + 5 * 60 * 1000;
    await loginuser.save();

    return res.status(200).json({
      message: "Login successful, OTP generated.",
      email,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const sendOTPEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = user.otp; // USE SAME OTP SAVED IN LOGIN
    console.log("Email OTP Sent:", otp);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `<h1>${otp}</h1>`
    });

    res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    console.log("Incoming OTP:", otp);
    console.log("DB OTP:", user.otp);

    if (user.otp !== otp) {
      return res.status(400).json({ message: "OTP is wrong" });
    }

    res.status(200).json({ message: "OTP verified successfully" });

    // Remove OTP after success
    user.otp = undefined;
    await user.save();

  } catch (error) {
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};


export const  changePassword = async(req,res,next)=>{

  const {email,currentPassword,newPassword} =req.body
try {
  if(!email||!currentPassword||!oldPassword ){
 return res.status(400).json({message:"all fileds reqired"})
  }
 const  user = User.findOne({email})
  if (!user) {
    return res.status(404).json({ message:"user not found"})
  }
  const isMatch = await bcrypt.compare(currentPassword,user.password)
if(!isMatch){
  return res.status(400).json({message :"user not found"})
}

 const newHashedPassword = await bcrypt.hash(newPassword, 10);
 user.password =newHashedPassword
 await user.save()

} catch (error) {
  res.status(500).json({message:"server error"})
  
}

}

export const getMydetail = async (req,res)=>{
  
try {
 const { email } = req.body; 

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user =  await User.findOne({email})
  if (!user) {
    return res.status(400).json({message :"not get your details"})
  }

  res.status(200).json({message : "successfully getting your detail",data:{
      fullname :user.fullname,
      email:user.email
    } })
  
} catch (error) {
   res.status(500).json({message:"server error",
    
   })
}


}


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -resetPasswordToken -resetPasswordExpiresAt -verificationToken -verificationTokenExpiresAt");

    res.status(200).json({
      success: true,
      total: users.length,
      data: users
    });

  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// export const ForgotPassword = async(req,res)=>{
//   const {email} =req.body

//   let user = User.findOne(email)
// try {
// if (user) {
//   let createOtp = otp
// user.otp =createOtp
// user.save
// user.deleteOne({otp})
// }



  
// } catch (error) {
  
// }


// }

 



