import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/usemodel.js";
  dotenv.config();
import crypto from "crypto";
import axios from "axios";



const otp = crypto.randomInt(100000, 999999).toString();
const apiKey = process.env.BRAVO;


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
    if (!loginuser) return res.status(404).json({ message: "User not found" });

    const passwordIsCorrect = await bcrypt.compare(
      password,
      loginuser.password
    );
    if (!passwordIsCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    loginuser.otp = otp;
    loginuser.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
    await loginuser.save();

    const token = jwt.sign(
      { userId: loginuser._id, email: loginuser.email, role: loginuser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: loginuser
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendOTPEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }


    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Hardeep",
          email: "singh123hardeep546@gmail.com", 
        },
        to: [{ email }],
        subject: "Your OTP Code",
        htmlContent: `
          <html>
            <body>
              <h2>Hello,</h2>
              <p>Your OTP code is:</p>
              <h1 style="color: #007bff;">${otp}</h1>
              <p>This OTP is valid for 10 minutes.</p>
            </body>
          </html>
        `,
      },
      {
        headers: {
          "api-key": apiKey, 
          "Content-Type": "application/json",
        },
      }
    );

    console.log("OTP Email sent successfully:", response.data);

    return res.status(200).json({
      message: "OTP Email sent successfully",
      otp, 
    });

  } catch (error) {
    console.error("Error sending OTP email:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Failed to send OTP email",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req,res,next)=>{
  
const {otp,email} =req.body
  try {
if (!otp) {
  return res.status(400).json({message:"otp is required"})
}
const record = User.findOne({email})

if(!record.otp == otp){
 return res.status(400).json({message:"otp is wrong"})
}

res.status(200).json({message :"otp verified"})
await User.deleteOne({otp})
next()
    
  } catch (error) {
    console.error("Error verify OTP :", error);
    return res.status(500).json({
      message: "Failed to verify OTP ",
      error: error.message,
    });
    
  }

}
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

 



